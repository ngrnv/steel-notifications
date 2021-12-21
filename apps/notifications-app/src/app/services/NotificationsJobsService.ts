import { Mongo } from '../Mongo';
import { ObjectId } from 'mongodb';
import { NotificationsJob, NotificationsStatus } from '../models';

export class NotificationsJobsService {

  private static collectionId = 'notificationsJobs'

  static async createNotificationsSendJob(
    events: ObjectId[], senderKey: string, status?: NotificationsStatus
  ) {
    const db = await Mongo.db();
    return db.collection(NotificationsJobsService.collectionId)
      .insertOne({
        _id: new ObjectId(),
        status: status || NotificationsStatus.Pending,
        senderKey,
        events,
      } as NotificationsJob);
  }

  static async setNotificationsSendJobStatus(
    _id: ObjectId, status: NotificationsStatus, failedSubscribers?: string[]
  ) {
    const db = await Mongo.db();
    const update: Partial<NotificationsJob> = { status };
    if (failedSubscribers) {
      update.failedSubscribers = failedSubscribers;
    }
    return db.collection(NotificationsJobsService.collectionId)
      .updateOne({ _id }, { $set: update });
  }
}
