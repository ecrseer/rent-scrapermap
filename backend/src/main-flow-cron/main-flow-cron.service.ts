import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AddressesService } from 'src/addresses/addresses.service';
import { EstatesPage } from 'src/estates-pages/entities/estates-page.entity';
import { EstatesPagesService } from 'src/estates-pages/estates-pages.service';
import { RealEstatesService } from 'src/real-estates/real-estates.service';

export const TIMES = {
  ONE_HOUR: '0 * * * *',
  ONE_MINUTE: '* * * * *',
};

@Injectable()
export class MainFlowCronService {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly estatesPagesService: EstatesPagesService,
    private readonly realEstatesService: RealEstatesService,
  ) {}

  onModuleInit() {
    this.scrapForHouses();
  }

  @Cron(TIMES.ONE_HOUR)
  async scrapForHouses() {
    console.log('Checking estates-pages...');
    const pending = await this.estatesPagesService.findPendingPages();
    for (const page of pending) {
      await this.addLatLong(page);
    }
  }

  async addLatLong(page: EstatesPage) {
    const all = await this.realEstatesService.findAll();
    console.log('🚀 ~ file: main-flow-cron.service.ts:36 ~ all:', all);
    const saved = await this.addressesService.appendLatLong(all);
    const savedAll = await this.realEstatesService.saveAll(saved);
    console.log('🚀 ~ file: main-flow-cron.service.ts:37 ~ saved:', saved);
  }

  async _addLatLong(page: EstatesPage) {
    for (const link of page.links) {
      console.log(link);
      const houses = await this.realEstatesService.findHousesByLink(link);
      console.log('🚀 ~ file: main-flow-cron.service.ts:38 ~ houses:', houses);
      if (houses?.length > 0) {
        const first = houses[0];
        const apnedd = await this.addressesService.appendLatLong([first]);
        console.log('🚀 ~ file: main-flow-cron.service.ts:41 ~ apnedd:', apnedd);
        // const saved = await this.realEstatesService.saveHouse(first);
      }
    }
  }
}
