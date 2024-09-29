const amqplib = require("amqplib");
const amqpUrl = process.env.AMQP_URL || "amqp://localhost:5673";

const admin = require("firebase-admin");
const serviceAccount = require("./fcmServiceAccountKey.json");

const Fcm = require("./db/fcm.model");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function processMessage(msg) {
  console.log(msg.content.toString(), "Call FCM API here");
  const registrationToken =
    "f5guBQAaJCUlKM7tYHGiyb:APA91bG4omJuWGi9D3COjqqN2-GdJKiD95W7QeOcxA3Tl4y7h_c0IIJPo492s6eIIqtPVe7-of369cPqFElrVlp0IRdMWILEcGbZgiLM811YgKaTnU8LBg1-6ZT7ltFj85klOJts2J9o";

  const message = {
    notification: {
      title: "FCM message",
      body: msg.text,
      image: "image",
    },
    token: registrationToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin
    .messaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message to firebase:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

(async () => {
  const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
  const channel = await connection.createChannel();
  channel.prefetch(10);

  const queue = "notification.fcm";
  const exchange = "notification.done";
  const routingKey = "notification.topic.key";

  process.once("SIGINT", async () => {
    console.log("got sigint, closing connection");
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  await channel.assertQueue(queue, { durable: true });
  await channel.assertExchange(exchange, "topic", { durable: false });
  await channel.consume(
    queue,
    async (msg) => {
      console.log("processing messages");
      await processMessage(msg);
      const fcmJob = await Fcm.create({
        identifier: "fcm-msg-a1beff5ac",
        deliverAt: "2021-01-31T12:34:56Z",
      });
      console.log("fcm-job", fcmJob);
      await channel.ack(msg);
      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(msg)));
    },
    {
      noAck: false,
      consumerTag: "notification_consumer",
    }
  );
  console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
