import { Addresses } from 'src/addresses/entities/addresses.entity';
import { EstatesPage } from 'src/estates-pages/entities/estates-page.entity';
import { RealEstate } from 'src/real-estates/entities/real-estate.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.aeuirtwblkqfetehbzwp:322322co@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  synchronize: true,
  logging: false,
  entities: [RealEstate, Addresses, EstatesPage],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
