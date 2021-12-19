import * as nodemailer from 'nodemailer';
import { EmailSendResult } from './models';

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

  public async sendEmails(to: string[], payload: string): Promise<EmailSendResult> {
    return this.transporter.sendMail({
      from: 'info@steelnotifications.com',
      subject: 'Notifications from Steel Notificator',
      bcc: to,
      text: payload,
    })
  }
}
