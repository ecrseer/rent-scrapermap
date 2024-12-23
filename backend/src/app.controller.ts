import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Listing } from './types/listing';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('listings')
  async getListings(): Promise<Listing[]> {
    return this.appService.scrapeListings();
  }
}
