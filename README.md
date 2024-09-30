# NodeJS service to handle message from RabbitMQ Queue'

The purpose of this service is to consume an incoming message from RabbitMQ queue, send FCM message to firebase, save the message identifier to MySQL dabase, and publish the message to RabbitMQ topic.

### Technologies

1. NodeJS
2. RabbitMQ
3. Docker
4. Docker Compose
5. MySQL
6. Firebase

### Firebase

Since this service is integrating firebase for sending FCM message, it requires firebase service account config that is stored in .env file. For the purpose of demo, this service uses the author's service account configuration. You can use your own firebase service account config.

### FCM

To send FCM message to firebase we need some kind of token that must be included in the targeted requests. For the demo purpose, the author's has generated a registration token inside the .env file. You can use your own registration token if you want.

### How to run

Since this application is using docker, you need to have Docker already installed in you local machine. Below command will install all the dependencies, and run the service, in this case the service is the consumer itself.

```
docker compose up
```

To check if the RabbitMQ is running fine, you can go to `http://localhost:15673`.

### How to test the service functionality

After the service is running, you can open another terminal in the root project directory and run below command.

```
docker compose exec consumer /bin/bash -c 'for ((i=1;i<=2;i++)); do node producer.js; done'
```

The above command will triger the producer.js file to send a message to RabbitMQ queue which then will be consumed by the consumer which will handle the message. This action is for demo or testing purpose only. Idealy the message should comming from a client app.

### Monitor the logs

To monitor the logs you can run below command in another terminal in the root project directory.

```
docker compose logs -f consumer
```
