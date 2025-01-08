import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  async sendEmail({ email, code, title }: NotificationDto): Promise<string> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.NOTIFICATION_HOST,
        port: process.env.NOTIFICATION_PORT,
        auth: {
          user: process.env.NOTIFICATION_EMAIL,
          pass: process.env.NOTIFICATION_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.NOTIFICATION_EMAIL,
        to: email,
        subject: title,
        html: `<table role="presentation" style="padding: 10px; border: 1px solid lightblue; font-size: 24px; margin: 0 auto; width: 326px; border-radius: 8px; font-weight: 700; text-align: center;">
        <tr>
            <td>
                <h3 style="margin-top: 0;">${title}</h3>
            </td>
        </tr>
        <tr>
            <td>
                <table role="presentation" style="display: inline-table;">
                    <tr style="display: flex;">
                    ${String(code)
                      .split('')
                      .map(
                        (el, index, array) =>
                          `<td style="padding: 5px 10px; border: 1px solid lightblue; border-radius: 4px; ${index !== array.length - 1 ? 'margin: 0 10px 0 0;' : 'margin: 0'};">${el}</td>`,
                      )
                      .join('')}
                    </tr>
                </table>
            </td>
        </tr>
        </table>`,
      });

      return 'Успішно';
    } catch (error) {
      throw error;
    }
  }
}
7;
