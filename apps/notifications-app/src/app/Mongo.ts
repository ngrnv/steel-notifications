import { Db, MongoClient } from 'mongodb';
import promiseRetry from 'promise-retry';

/**
 * Provides shared connection to DB
 */
export class Mongo {

  private static client: MongoClient;
  private static _db;

  public static connect() {
    MongoClient.connect('mongodb://localhost:27017')
      .then((client) => {
        console.log('Connected to MongoDB');
        Mongo.client = client;
        Mongo._db = Mongo.client.db()
      });
  }

  /**
   * Allow clients to safely get db connection right after app start
   */
  public static db(): Promise<Db> {
    return promiseRetry(
      { retries: 5, factor: 2 },
      (retry, attempt) => {
        if (attempt > 1) {
          console.log(`Trying retrieve mongo connection, attempt ${attempt}`);
        }
        if (Mongo._db) {
          return Promise.resolve(Mongo._db);
        } else {
          return retry(null);
        }
      }
    );
  }
}
