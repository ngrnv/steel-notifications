import { IFileEvent, SenderKey, NotificationsStatus } from '../models';
import { Mongo } from '../Mongo';
import { ObjectId } from 'mongodb';

export class NotificationsService {

  private static collectionId = 'events'

  static async persistEvent(e: IFileEvent) {
    const db = await Mongo.db();
    const { insertedId } = await db.collection(NotificationsService.collectionId)
      .insertOne(e);
    return insertedId;
  }

  static async updateEventStatus(id: ObjectId, status: NotificationsStatus, senderKey: SenderKey) {
    const db = await Mongo.db();
    const update = {};
    if (senderKey) {
      update[`statuses.${senderKey}`] = status;
    }
    await db.collection<IFileEvent>(NotificationsService.collectionId)
      .updateOne({ _id: id }, { $set: update })
  }

  static async updateEventsStatuses(ids: ObjectId[], status: NotificationsStatus, senderKey: SenderKey) {
    const db = await Mongo.db();
    const update = {};
    if (senderKey) {
      update[`statuses.${senderKey}`] = status;
    }
    await db.collection<IFileEvent>(NotificationsService.collectionId)
      .updateMany({ _id: { '$in': ids } }, { $set: update })
  }

  static async getEventsForSender(senderKey: SenderKey): Promise<IFileEvent[]> {
    const db = await Mongo.db();
    const find = {};
    find[`statuses.${senderKey}`] = { '$exists': false };
    return db.collection<IFileEvent>(NotificationsService.collectionId)
      .find(find)
      .toArray();
  }

}
