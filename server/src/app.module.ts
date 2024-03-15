import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configValidationSchema } from './config/config.schema'
import { MulterModule } from '@nestjs/platform-express'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { DatabaseModule } from './database/database.module'
import { OtherModule } from '@modules/other/other.module'
import { AdminModule } from '@admin/admin.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
      validationSchema: configValidationSchema,
    }),
    MulterModule.register({
      dest: 'public/uploads',
    }),
    DatabaseModule,
    AdminModule,
    OtherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static nodeEnv: string
  static port: number
  static apiVersion: string
  static apiPrefix: string
  static documentationEnabled: boolean

  constructor(private readonly configService: ConfigService) {
    AppModule.nodeEnv = this.configService.get('NODE_ENV')
    AppModule.port = +this.configService.get('API_PORT')
    AppModule.apiVersion = this.configService.get('API_VERSION')
    AppModule.apiPrefix = this.configService.get('API_PREFIX')
    AppModule.documentationEnabled = true // only for dev mode
  }

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [LoggerMiddleware]
    consumer.apply(...middlewares).forRoutes({ path: '/**', method: RequestMethod.ALL })
  }
}
