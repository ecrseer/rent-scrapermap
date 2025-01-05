import { PartialType } from '@nestjs/mapped-types';
import { RealEstate } from '../entities/real-estate.entity';

export class CreateRealEstateDto extends PartialType(RealEstate) {}
