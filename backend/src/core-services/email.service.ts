import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { env } from 'src/env';

interface EmailData {
  from?: string;
  to: string[];
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private RESENT_API_KEY = env.RESEND_API_KEY;
  private resend: Resend;

  constructor() {
    if (!this.RESENT_API_KEY) {
      throw new Error('API Key is not defined');
    }
    this.resend = new Resend(this.RESENT_API_KEY);
  }

  async sendCronErrorNotification(errorDetails: string, errorTitle: string) {
    const emailPath = path.resolve(
      __dirname,
      '..',
      'html-templates',
      'cronerror.html',
    );
    const emailTemplate = fs.readFileSync(emailPath, 'utf8');

    const htmlContent = emailTemplate
      .replace('{{ title }}', errorTitle)
      .replace('{{ errorDetails }}', errorDetails);

    await this.sendEmail({
      to: ['ianfrye.dev@gmail.com'],
      subject: 'Error Notification',
      from: 'Ian <ian@praise-pal.com',
      html: htmlContent,
    });
  }

  public async sendEmail({
    from = 'ian@email.praise-pal.com',
    ...rest
  }: EmailData) {
    const { data, error } = await this.resend.emails.send({ from, ...rest });
    if (error) {
      return console.error(error);
    }

    console.log(data);
  }
}
