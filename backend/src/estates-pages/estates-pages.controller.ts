import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstatesPagesService } from './estates-pages.service';
import { CreateEstatesPageDto } from './dto/create-estates-page.dto';
import { UpdateEstatesPageDto } from './dto/update-estates-page.dto';

@Controller('estates-pages')
export class EstatesPagesController {
  constructor(private readonly estatesPagesService: EstatesPagesService) {}
 
}
