import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RealEstatesModule } from './real-estates/real-estates.module';
import AppDataSource from 'ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from './addresses/addresses.module';
import { EstatesPagesModule } from './estates-pages/estates-pages.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MainFlowCronService } from './main-flow-cron/main-flow-cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot(AppDataSource.options),
    RealEstatesModule,
    AddressesModule,
    EstatesPagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Error during Data Source initialization:', error);
    }
  }
}
