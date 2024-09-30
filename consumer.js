const amqplib = require("amqplib");

const admin = require("firebase-admin");
const serviceAccount = require("./fcmServiceAccountKey");

const Fcm = require("./db/fcm.model");
const { validateMessage } = require("./utils");

const amqpUrl = process.env.AMQP_URL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function processMessage(msgContent) {
  console.log(JSON.stringify(msgContent), "Call FCM API here");
  const registrationToken = process.env.DEVICE_REGRISTATION_TOKEN;

  const message = {
    notification: {
      title: "FCM message",
      body: msgContent.text,
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
      try {
        console.log("processing messages");

        const msgContent = msg.content.toString();
        const msgIsValid = validateMessage(JSON.parse(msgContent));

        if (!msgIsValid) {
          throw new Error("message is invalid");
        }

        await processMessage(JSON.parse(msgContent));
        const fcmJob = await Fcm.create({
          identifier: "fcm-msg-a1beff5ac",
          deliverAt: "2021-01-31T12:34:56Z",
        });
        await channel.ack(msg);

        const msgToBePublished = {
          identifier: "fcm-msg-a1beff5ac",
          deliverAt: "2021-01-31T12:34:56Z",
        };
        channel.publish(
          exchange,
          routingKey,
          Buffer.from(JSON.stringify(msgToBePublished))
        );
      } catch (error) {
        console.log("Error processing message:", error.message);
        channel.nack(msg, true, false);
      }
    },
    {
      noAck: false,
      consumerTag: "notification_consumer",
    }
  );
  console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
