import { Module } from '@nestjs/common';
import { RealEstatesService } from './real-estates.service';
import { RealEstatesController } from './real-estates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstate } from './entities/real-estate.entity';

@Module({
  controllers: [RealEstatesController],
  providers: [RealEstatesService],
  imports: [TypeOrmModule.forFeature([RealEstate])],
})
export class RealEstatesModule {}
