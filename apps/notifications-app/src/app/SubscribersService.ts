import { ISubscription, Periodicity } from './models';
import { Mongo } from './Mongo';

export class SubscribersService {

  private static collectionId = 'subscribers'

  public static async getSubscribersByPeriodicity(p: Periodicity): Promise<ISubscription[]> {
    return Mongo.db().collection<ISubscription>(SubscribersService.collectionId)
      .find({ periodicity: p })
      .toArray();
  }

}
