import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RealEstatesService } from './real-estates.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { UpdateRealEstateDto } from './dto/update-real-estate.dto';

@Controller('real-estates')
export class RealEstatesController {
  constructor(private readonly realEstatesService: RealEstatesService) {}
  @Get()
  findAll() {
    return this.realEstatesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.realEstatesService.findOne(+id);
  // }
}
