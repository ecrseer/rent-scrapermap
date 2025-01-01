import { Injectable } from '@nestjs/common';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { UpdateRealEstateDto } from './dto/update-real-estate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RealEstate } from './entities/real-estate.entity';
import { Repository } from 'typeorm';
import { estatesSample } from 'src/logs/estates-sample';

@Injectable()
export class RealEstatesService {
  constructor(
    @InjectRepository(RealEstate)
    private realEstateRepository: Repository<RealEstate>,
  ) {}

  onModuleInit() {
    this.create(estatesSample[1]);
  }

  create(createRealEstateDto: CreateRealEstateDto) {
    return this.realEstateRepository.save(createRealEstateDto);
  }

  // findAll() {
  //   return `This action returns all realEstates`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} realEstate`;
  // }

  // update(id: number, updateRealEstateDto: UpdateRealEstateDto) {
  //   return `This action updates a #${id} realEstate`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} realEstate`;
  // }
}
