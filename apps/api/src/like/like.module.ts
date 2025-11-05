import { Module, forwardRef } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, forwardRef(() => NotificationModule)],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
