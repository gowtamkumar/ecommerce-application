import { NextFunction, Response } from 'express';
import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { NotificationType } from '@/enums/notification-type.enum';
import { RoleEnum } from '@/modules/user/auth/enums/role.enum';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';

let requestCount = 0;
let lastReset = Date.now();
const THRESHOLD = 1000; // requests per minute
const INTERVAL = 60000; // 1 minute

export const trafficMonitor = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const now = Date.now();
  if (now - lastReset > INTERVAL) {
    requestCount = 0;
    lastReset = now;
  }

  requestCount++;

  if (requestCount === THRESHOLD) {
    // Trigger High Traffic Alert
    try {
      const connection = await getDBConnection();
      const userRepo = connection.getRepository(UserEntity);
      const notificationRepo = connection.getRepository(NotificationEntity);
      const admins = await userRepo.find({ where: { role: RoleEnum.Admin } });

      const alerts = admins.map((admin: UserEntity) =>
        notificationRepo.create({
          type: NotificationType.HighTraffic,
          title: 'High Traffic Alert',
          message: `Server is experiencing high traffic. >${THRESHOLD} requests/minute.`,
          userId: admin.id,
          isRead: false,
        }),
      );

      if (alerts.length > 0) {
        // We don't want to await this to block the request loop too much
        notificationRepo
          .save(alerts)
          .catch((err: any) => console.error('Failed to save traffic alert', err));
      }
    } catch (err) {
      console.error('Failed to trigger high traffic alert', err);
    }
  }

  next();
};
