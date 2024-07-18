import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Resend } from 'resend';
import {
  cronErrorEmailHtml,
  newUserEmailOwner,
  newUserEmailUser,
  userVerifiedEmail,
} from 'src/email-templates';
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

  async sendNewUserEmail({
    newUserId,
    companyOwnerEmail,
    newUserFullName,
    newUserEmail,
  }: {
    newUserId: string;
    companyOwnerEmail?: string;
    newUserFullName: string;
    newUserEmail: string;
  }) {
    try {
      const url = `${env.CLIENT_URL}/admin/verify-user/${newUserId}`;
      if (companyOwnerEmail) {
        await this.sendEmail({
          html: newUserEmailOwner(url, newUserFullName),
          subject: 'Verify New User',
          to: [companyOwnerEmail],
        });
      }

      await this.sendEmail({
        html: newUserEmailUser(newUserFullName),
        subject: 'Pending Verification',
        to: [newUserEmail],
      });
      return {
        message: 'Email sent successfully',
        status: HttpStatus.OK,
        url,
      };
    } catch (error) {
      console.error(['Verify Email Error'], error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Could not verify email');
    }
  }

  async sendUserVerifiedEmail({
    companyName,
    newUserEmail,
    newUserFirstName,
  }: {
    newUserFirstName: string;
    newUserEmail: string;
    companyName: string;
  }) {
    await this.sendEmail({
      html: userVerifiedEmail(newUserFirstName, companyName),
      subject: "You've been approved!",
      to: [newUserEmail],
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
