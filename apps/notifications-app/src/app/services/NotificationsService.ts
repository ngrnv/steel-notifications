import { IFileEvent, SenderKey, NotificationsStatus } from "../models";
import { Mongo } from "../Mongo";
import { ObjectId } from "mongodb";

export class NotificationsService {

  private static collectionId = "events";

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
      .updateOne({ _id: id }, { $set: update });
  }

  static async updateEventsStatuses(ids: ObjectId[], status: NotificationsStatus, senderKey: SenderKey) {
    const db = await Mongo.db();
    const update = {};
    if (senderKey) {
      update[`statuses.${senderKey}`] = status;
    }
    await db.collection<IFileEvent>(NotificationsService.collectionId)
      .updateMany({ _id: { "$in": ids } }, { $set: update });
  }

  /**
   *
   * @param senderKey
   * @param interval limits number of events picked when first subscriber for interval just added, or app server was restarted
   */
  static async getEventsForSender(
    senderKey: SenderKey, interval?: number
  ): Promise<IFileEvent[]> {
    const db = await Mongo.db();
    const senderCondition = {};
    senderCondition[`statuses.${senderKey}`] = { "$exists": false };
    const and = [senderCondition];
    if (interval) {
      and.push({
        timestamp: {
          "$gte": new Date(Date.now() - interval)
        }
      });
    }
    return db.collection<IFileEvent>(NotificationsService.collectionId)
      .find({ "$and": and })
      .toArray();
  }

}
