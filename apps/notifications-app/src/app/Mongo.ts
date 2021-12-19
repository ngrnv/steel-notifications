import { Db, MongoClient } from 'mongodb';

export class Mongo {

  private static client: MongoClient;

  public static connect() {
    MongoClient.connect('mongodb://localhost:27017')
      .then((client) => {
        console.log('Connected to MongoDB');
        Mongo.client = client;
      });
  }

  public static db(): Db {
    return Mongo.client.db();
  }
}
