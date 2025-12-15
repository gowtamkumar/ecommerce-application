import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { getDBConnection } from '../config/db';
import { NotificationType } from '../enums/notification-type.enum';
import { RoleEnum } from '../modules/auth/enums/role.enum';
import { UserEntity } from '../modules/auth/model/user.entity';
import { NotificationEntity } from '../modules/other/notification/model/notification.entity';

export const sendEmail = async (mailOptions: Options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      // service: process.env.SERVICE,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    } as unknown as {
      host: string;
      port: number;
      secure: boolean;
      auth: { user: string; pass: string };
    });

    await transporter.sendMail(mailOptions);

    console.log('email sent sucessfully');
  } catch (error: any) {
    console.log(error, 'email not sent');
    
    try {
      const connection = await getDBConnection();
      const userRepo = connection.getRepository(UserEntity);
      const notificationRepo = connection.getRepository(NotificationEntity);
      const admins = await userRepo.find({ where: { role: RoleEnum.Admin } });
      
      const alerts = admins.map((admin: UserEntity) => notificationRepo.create({
          type: NotificationType.SmsEmailFailed,
          title: 'Email Gateway Failed',
          message: `Failed to send Email. Error: ${error.message}`,
          userId: admin.id,
          isRead: false
      }));
      
      if (alerts.length > 0) {
        await notificationRepo.save(alerts);
      }
    } catch (notifyErr) {
      console.error("Failed to send Email failure notification", notifyErr);
    }

    throw new Error('email not sent');
  }
};
