import { PartialType } from '@nestjs/mapped-types';
import { CreateEstatesPageDto } from './create-estates-page.dto';

export class UpdateEstatesPageDto extends PartialType(CreateEstatesPageDto) {}
