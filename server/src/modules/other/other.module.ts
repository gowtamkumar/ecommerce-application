import { Module } from '@nestjs/common'
import { FileModule } from './file/file.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [FileModule, MailModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OtherModule {}
