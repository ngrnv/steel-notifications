import { EventStatus, IFileEvent, SenderKey } from './models';
import { Mongo } from './Mongo';
import { ObjectId } from 'mongodb';

export class NotificationsService {

  private static collectionId = 'events'

  public static async persistEvent(e: IFileEvent) {
    const { insertedId } = await Mongo.db().collection(NotificationsService.collectionId)
      .insertOne(e);
    return insertedId;
  }

  public static async updateEventStatus(id: ObjectId, status: EventStatus, senderKey?: SenderKey) {
    const update = { status };
    if (senderKey) {
      update[`statuses.${senderKey}`] = status;
    }
    await Mongo.db().collection<IFileEvent>(NotificationsService.collectionId)
      .updateOne({ _id: id }, { $set: update })
  }

}
