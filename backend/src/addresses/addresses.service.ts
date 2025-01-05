import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Addresses } from './entities/addresses.entity';
import { getZipToLatStrategy } from './zipcode-to-lat-lon/izipcode-to-lat-lon';
import { RealEstate } from 'src/real-estates/entities/real-estate.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Addresses)
    private addressesRepository: Repository<Addresses>,
  ) {}

  public async findAll(): Promise<Addresses[]> {
    return await this.addressesRepository.find();
  }

  public async create(address: Addresses): Promise<Addresses> {
    return await this.addressesRepository.save(address);
  }

  async appendLatLong(realEstates: RealEstate[]) {
    const strategy = getZipToLatStrategy();
    const scraped = realEstates;
    for (const estate of scraped) {
      const cached = this.findByZipCode(estate.address);
      if (cached) {
        estate.latitude = cached.latitude;
        estate.longitude = cached.longitude;
        continue;
      } else {
        const latlong = await strategy.cepToLatLng(estate.address);
        this.create({
          zipCode: estate.zipCode,
          latitude: latlong.lat,
          longitude: latlong.lng,
          address: estate.address,
          id: null,
        });
        estate.latitude = latlong.lat;
        estate.longitude = latlong.lng;
      }
    }
    return scraped;
  }

  findByZipCode(address: string): any {
    // throw new Error('Method not implemented.');
    return {};
  }
}
