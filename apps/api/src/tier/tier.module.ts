import { Module } from '@nestjs/common';
import { TierController } from './tier.controller';
import { TierService } from './tier.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CreatorModule } from '../creator/creator.module';

@Module({
  imports: [PrismaModule, CreatorModule],
  controllers: [TierController],
  providers: [TierService],
  exports: [TierService],
})
export class TierModule {}
