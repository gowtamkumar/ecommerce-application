import axios from 'axios';
import { getDBConnection } from '@/config/db';
import { NotificationType } from '@/enums/notification-type.enum';
import { RoleEnum } from '@/modules/user/auth/enums/role.enum';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';

export async function sendSms(number: string, message: string) {
  const apiKey = process.env.BULKSMSBD_API_KEY;
  const senderId = process.env.BULKSMSBD_SENDER_ID;

  const url = 'http://bulksmsbd.net/api/smsapi';

  const params = {
    api_key: apiKey,
    type: 'text',
    number,
    senderid: senderId,
    message,
  };

  try {
    const res = await axios.post(url, null, { params });
    console.log('SMS sent:', res.data);
  } catch (err: any) {
    console.error('SMS error:', err);
    try {
      const connection = await getDBConnection();
      const userRepo = connection.getRepository(UserEntity);
      const notificationRepo = connection.getRepository(NotificationEntity);
      const admins = await userRepo.find({ where: { role: RoleEnum.Admin } });

      const alerts = admins.map((admin: UserEntity) =>
        notificationRepo.create({
          type: NotificationType.SmsEmailFailed,
          title: 'SMS Gateway Failed',
          message: `Failed to send SMS to ${number}. Error: ${err.message}`,
          userId: admin.id,
          isRead: false,
        }),
      );

      if (alerts.length > 0) {
        await notificationRepo.save(alerts);
      }
    } catch (notifyErr) {
      console.error('Failed to send SMS failure notification', notifyErr);
    }
  }
}
