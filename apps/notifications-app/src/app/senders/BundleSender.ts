import { Sender } from './Sender';
import { EmailSendResult, Periodicity, NotificationsStatus } from '../models';
import { NotificationsService } from '../services/NotificationsService';
import { SubscribersService } from '../services/SubscribersService';
import { NotificationsJobsService } from '../services/NotificationsJobsService';
import promiseRetry from 'promise-retry';
import { EmailService } from '../services/EmailService';

export abstract class BundleSender extends Sender {
  protected interval: number;

  protected constructor(periodicity: Periodicity, interval: number) {
    super(periodicity);
    this.interval = interval;
  }

  start() {
    this.send();
    setInterval(() => {
      this.send();
    }, this.interval);
  }

  async send() {
    console.log(`Sender: ${this.getSenderKey()}: send`);

    const events = await NotificationsService.getEventsForSender(this.periodicity)
    const eventsIds = events.map(e => e._id);
    const subscribers = await SubscribersService.getSubscribersByPeriodicity(this.periodicity);
    if (!subscribers.length || !events.length) {
      return;
    }

    const { insertedId: jobId } = await NotificationsJobsService.createNotificationsSendJob(
      eventsIds,
      this.getSenderKey(),
      NotificationsStatus.Sending,
    );

    let rejectedEmails = [];
    try {
      await promiseRetry(
        { retries: 3, factor: 2 },
        async (retry, attempt) => {
          console.log(`Sender ${this.getSenderKey()}: attempt ${attempt} for job ${jobId}`)
          await NotificationsService.updateEventsStatuses(
            eventsIds, NotificationsStatus.Sending, this.getSenderKey()
          );
          const sendResult: EmailSendResult = await EmailService.getInstance()
            .sendEmails(
              rejectedEmails.length ? rejectedEmails : subscribers.map(s => s.email),
              events.map(e => e.payload).join('; '),
              `Notifications from Steel Notificator: ${this.periodicity}`
            );
          if (sendResult.rejected.length) {
            rejectedEmails = sendResult.rejected;
            return retry(sendResult.rejected);
          }
          await NotificationsService.updateEventsStatuses(
            eventsIds, NotificationsStatus.Sent, this.getSenderKey()
          );
          await NotificationsJobsService.setNotificationsSendJobStatus(
            jobId,
            NotificationsStatus.Sent,
            [],
          );
          return sendResult;
        });
    } catch (err) {
      console.error(`Error sending notifications for job ${jobId}`);
      if (rejectedEmails.length) {
        await NotificationsJobsService.setNotificationsSendJobStatus(
          jobId, NotificationsStatus.PartiallySent, rejectedEmails
        );
        await NotificationsService.updateEventsStatuses(
          eventsIds, NotificationsStatus.PartiallySent, this.getSenderKey()
        );
      } else {
        await NotificationsJobsService.setNotificationsSendJobStatus(
          jobId, NotificationsStatus.Failed
        );
        await NotificationsService.updateEventsStatuses(
          eventsIds, NotificationsStatus.Failed, this.getSenderKey()
        );
      }
      throw err;
    }
  }

}
