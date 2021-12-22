import express from 'express';
import { FileEventsSource } from './app/FileEventsSource';
import { FileEventReceiver } from './app/FileEventReceiver';
import { Mongo } from './app/Mongo';
import { SubscriptionsController } from "./app/SubscriptionsController";
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

Mongo.connect();
app.use('/api/notifications', FileEventReceiver.getInstance(new FileEventsSource().start()));
app.use('/api/subscriptions', new SubscriptionsController().routes);
