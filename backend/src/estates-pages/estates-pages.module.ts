import { Module } from '@nestjs/common';
import { EstatesPagesService } from './estates-pages.service';
import { EstatesPagesController } from './estates-pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstatesPage } from './entities/estates-page.entity';
import { RealEstatesModule } from 'src/real-estates/real-estates.module';
import { MainFlowCronService } from 'src/main-flow-cron/main-flow-cron.module';

@Module({
  controllers: [EstatesPagesController],
  providers: [EstatesPagesService, MainFlowCronService],
  imports: [TypeOrmModule.forFeature([EstatesPage]), RealEstatesModule],
})
export class EstatesPagesModule {}
