import { Module } from '@nestjs/common';
import { MainFlowCronService } from './main-flow-cron.service';
import { EstatesPagesModule } from 'src/estates-pages/estates-pages.module';
import { RealEstatesModule } from 'src/real-estates/real-estates.module';
import { AddressesModule } from 'src/addresses/addresses.module';

@Module({
  providers: [MainFlowCronService],
  imports: [AddressesModule, EstatesPagesModule, RealEstatesModule],
  exports: [MainFlowCronService],
})
export class MainFlowCronModule {}
