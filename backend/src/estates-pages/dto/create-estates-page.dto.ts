import { PartialType } from '@nestjs/mapped-types';
import { EstatesPage } from '../entities/estates-page.entity';

export class CreateEstatesPageDto extends PartialType(EstatesPage) {}
