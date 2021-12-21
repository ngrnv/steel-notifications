import { ISubscription, Periodicity } from '../models';
import { Mongo } from '../Mongo';

export class SubscribersService {

  private static collectionId = 'subscribers'

  static async getSubscribersByPeriodicity(p: Periodicity): Promise<ISubscription[]> {
    const db = await Mongo.db();
    return db.collection<ISubscription>(SubscribersService.collectionId)
      .find({ periodicity: p })
      .toArray();
  }

}
