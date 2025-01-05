import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EstatesPagesService } from 'src/estates-pages/estates-pages.service';

export const TIMES = {
  ONE_HOUR: '0 * * * *',
  ONE_MINUTE: '* * * * *',
};

@Injectable()
export class MainFlowCronService {
  constructor(private readonly estatesPagesService: EstatesPagesService) {}

  onModuleInit() {
    this.scrapForHouses();
  }

  @Cron(TIMES.ONE_HOUR)
  scrapForHouses() {
    console.log('Checking estates-pages...');
    // this.estatesPagesService.checkEstatesPages(); // Call your service method here
  }
}
