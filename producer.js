const amqplib = require("amqplib");
const amqpUrl = process.env.AMQP_URL || "amqp://localhost:5673";

(async () => {
  const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
  const channel = await connection.createChannel();
  try {
    console.log("Sending message");
    const queue = "notification.fcm";
    await channel.assertQueue(queue, { durable: true });

    const msg = {
      identifier: "fcm-msg-a1beff5ac",
      type: "device",
      deviceId: "string",
      text: "Notification message",
    };
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
    console.log("Message sent");
  } catch (e) {
    console.error("Error in sending message", e);
  } finally {
    console.info("Closing channel and connection if available");
    await channel.close();
    await connection.close();
    console.info("Channel and connection closed");
  }
  process.exit(0);
})();
