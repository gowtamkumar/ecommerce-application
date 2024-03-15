import { Module } from '@nestjs/common'
import { FileModule } from './file/file.module'
import { SettingModule } from './setting/setting.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [FileModule, SettingModule, MailModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtherModule {}
