import { Sender } from './Sender';
import { EmailSendResult, IFileEvent, Periodicity, NotificationsStatus } from '../models';
import { SubscribersService } from '../services/SubscribersService';
import { EmailService } from '../services/EmailService';
import promiseRetry from 'promise-retry'
import { NotificationsService } from '../services/NotificationsService';

export class ImmediateSender extends Sender {
  constructor() {
    super(Periodicity.Immediate);
  }

  async send(event: IFileEvent) {
    const subscribers = await SubscribersService.getSubscribersByPeriodicity(this.periodicity);
    if (!subscribers.length) {
      return;
    }

    try {
      await NotificationsService.updateEventStatus(
        event._id, NotificationsStatus.Sending, this.getSenderKey()
      );
      await promiseRetry(
        { retries: 3, factor: 2 },
        async (retry, attempt) => {
          console.log(`Sender: ${this.getSenderKey()}: attempt ${attempt} for ${event._id}`);
          const sendResult: EmailSendResult = await EmailService.getInstance().sendEmails(
            subscribers.map(s => s.email),
            event.payload,
            `Notifications from Steel Notificator: ${this.periodicity}: ${event.payload}`
          );
          if (sendResult.rejected.length) {
            return retry(sendResult.rejected)
          }
          await NotificationsService.updateEventStatus(
            event._id, NotificationsStatus.Sent, this.getSenderKey()
          );
          return sendResult;
        });
    } catch (err) {
      console.error(`Error sending notification ${event._id}`);
      await NotificationsService.updateEventStatus(
        event._id, NotificationsStatus.Failed, this.getSenderKey()
      );
    }
  }
}
