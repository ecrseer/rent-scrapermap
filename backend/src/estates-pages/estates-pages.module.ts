import { Module } from '@nestjs/common';
import { EstatesPagesService } from './estates-pages.service';
import { EstatesPagesController } from './estates-pages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstatesPage } from './entities/estates-page.entity';
import { RealEstatesModule } from 'src/real-estates/real-estates.module';

@Module({
  controllers: [EstatesPagesController],
  providers: [EstatesPagesService],
  imports: [TypeOrmModule.forFeature([EstatesPage]), RealEstatesModule],
  exports: [EstatesPagesService],
})
export class EstatesPagesModule {}
