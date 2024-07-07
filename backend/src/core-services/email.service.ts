import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { cronErrorEmailHtml } from 'src/email-templates';
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
    await this.sendEmail({
      to: ['ianfrye.dev@gmail.com'],
      subject: 'Error Notification',
      html: cronErrorEmailHtml(errorDetails, errorTitle),
    });
  }

  async sendEmail({
    from = 'Praise-Pal Support <support@email.praise-pal.com>',
    ...rest
  }: EmailData) {
    const { data, error } = await this.resend.emails.send({ from, ...rest });
    if (error) {
      return console.error(error);
    }
    console.log('Email Sent. ID: ', data);
  }
}
