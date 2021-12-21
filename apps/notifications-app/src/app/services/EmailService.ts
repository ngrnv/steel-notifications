import * as nodemailer from 'nodemailer';
import { EmailSendResult } from '../models';
import promiseRetry from 'promise-retry';

export class EmailService {
  private static instance: EmailService;

  private transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 2500,
      secure: false,
    });

    this.transporter.verify()
      .then(ok => {
        if (ok) {
          console.log('Connection to SMTP server is ok')
        } else {
          throw new Error('Can\'t connect to SMTP server');
        }
      });
  }

  public static getInstance() {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmails(to: string[], payload: string, subject: string): Promise<EmailSendResult> {
    return await promiseRetry(
      { retries: 3, factor: 2 },
      async (retry, attempt) => {
        console.log(`[EmailService.sendEmails] attempt ${attempt} for "${subject}"`)
        let sendResult;
        try {
          sendResult = await this.transporter.sendMail({
            from: 'info@steelnotifications.com',
            text: payload,
            bcc: to,
            subject,
          });
        } catch (err) {
          console.log('Error sending emails', JSON.stringify(err));
          return retry(err);
        }
        return sendResult;
      })
  }
}
