import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Addresses } from './entities/addresses.entity';

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
}
