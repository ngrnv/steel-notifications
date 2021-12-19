import { Sender } from './Sender';
import { EmailSendResult, IFileEvent, Periodicity } from '../models';
import { SubscribersService } from '../SubscribersService';
import { EmailService } from '../EmailService';
import promiseRetry from 'promise-retry'

export class ImmediateSender extends Sender {
  constructor() {
    super(Periodicity.Immediate);
  }

  async send(event: IFileEvent) {
    const subscribers = await SubscribersService.getSubscribersByPeriodicity(this.periodicity)

    try {
      await promiseRetry(
        { retries: 3, factor: 2 },
        async (retry, attempt) => {
          console.log(`[ImmediateSender.send] attempt for ${event._id}`, attempt)
          const sendResult: EmailSendResult = await EmailService.getInstance().sendEmails(
            subscribers.map(s => s.email),
            event.payload,
          );
          if (sendResult.accepted.length) {
            return retry(sendResult.rejected)
          }
          return sendResult;
        })
    } catch (err) {
      console.error(`Error sending notification ${event._id}`);
      throw err;
    }
  }
}
