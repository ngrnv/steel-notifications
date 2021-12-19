import express from 'express';
import { FileEventsSource } from './app/FileEventsSource';
import { FileEventReceiver } from './app/FileEventReceiver';
import { Mongo } from './app/Mongo';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to notifications-app!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

Mongo.connect();
app.use('/notifications', FileEventReceiver.getInstance(new FileEventsSource().start()));
