import { Injectable } from '@nestjs/common';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RealEstate } from './entities/real-estate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RealEstatesService {
  constructor(
    @InjectRepository(RealEstate)
    private realEstateRepository: Repository<RealEstate>,
  ) {}

  async saveHouse(createRealEstateDto: CreateRealEstateDto) {
    const found = await this.findHousesByLink(createRealEstateDto.link);
    if (found?.length > 0) {
      return found[0];
    }
    const house = this.realEstateRepository.create(createRealEstateDto);
    const saved = await this.realEstateRepository.save(house);

    return saved;
  }

  async findHousesByLink(searchingLink: string): Promise<RealEstate[]> {
    return this.realEstateRepository.find({
      where: {
        link: searchingLink,
      },
    });
  }
}
