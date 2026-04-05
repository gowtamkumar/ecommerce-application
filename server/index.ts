/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDBConnection } from '@/config/db';
import { NotificationType } from '@/enums/notification-type.enum';
import { errorHandler } from '@/middlewares/errorHandler';
import { trafficMonitor } from '@/middlewares/traffic-monitor.middleware';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';
import { RoleEnum } from '@/modules/user/auth/enums/role.enum';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'reflect-metadata';
// all routes
import { auditLogMiddleware } from '@/middlewares/audit-log.middleware';
import { setupRoutes } from '@/routes/routes';
import { initCronJobs } from '@/services/cron.service';
import { rateLimit } from 'express-rate-limit';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: envFile });
const app = express();

// access public folder for image
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, 'public')));
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  getDBConnection();
  initCronJobs();
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});
// Apply the rate limiting middleware to all requests.
app.use(limiter);
app.use(trafficMonitor);

// middleware
app.use(cookieParser()); // cookie parser when we needed the cookies value then we simply get and set
app.use(express.json()); // you ensure that your express application can handle json data sent in the request body automatically
app.use(express.urlencoded({ extended: true })); // it parses incoming request with url-encoded payloads and is based on a body parser.
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin images
  }),
);
app.use(cors({ origin: '*' })); // CORS is crucial for security and functioning of web applications making cross-origin requests. In Node.js, the cors middleware for Express simplifies enabling and configuring CORS, allowing you to control resource sharing with fine-grained policies. This ensures that your API can be securely accessed by authorized web applications across different domains.

// app.use((req, res, next) => {
//   // console.log(`Static file request: ${req.url}`);
//   next();
// });
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global audit logging middleware (before routes)
app.use(auditLogMiddleware);

//main route
setupRoutes(app);
// error Handler
app.use(errorHandler);

//root route
app.get('/', (req, res) => {
  res.send('Welcome to nodejs server!');
});

// app.use(logger)

// not found route
app.get('*', (req, res) => {
  res.send('Not found route, Please right route hite');
});

// Port
const PORT = process.env.PORT || 3900;

const server = app.listen(PORT, async () => {
  console.log(colors.magenta(`Server running in ${process.env.NODE_ENV} Mode on Port ${PORT}`));

  // Notify Admins: Server Started / Restarted
  try {
    const connection = await getDBConnection();
    const userRepo = connection.getRepository(UserEntity);
    const notificationRepo = connection.getRepository(NotificationEntity);
    const admins = await userRepo.find({ where: { role: RoleEnum.Admin } });

    const alerts = admins.map((admin: UserEntity) =>
      notificationRepo.create({
        type: NotificationType.ServerDown, // Using to indicate status change/recovery
        title: 'Server Alert',
        message: `Server successfully started/restarted.`,
        userId: admin.id,
        isRead: false,
      }),
    );

    if (alerts.length > 0) {
      await notificationRepo.save(alerts);
    }
  } catch (error) {
    console.error('Failed to send server startup alert', error);
  }
});

//handle and unhandle promise rejections
process.on('unhandledRejection', (err: any, _message) => {
  console.log(colors.red(`Error ${err.message}`));
  // close server & process exit
  server.close(() => process.exit(1));
});
