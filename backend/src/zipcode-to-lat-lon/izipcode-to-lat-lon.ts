import { NominatimZipcodeStrategy } from './strategies/nominatim-zipcode-strategy';
import { OpenCageZipcodeStrategy } from './strategies/opencage-zipcode-strategy';

export type IQueryAddress = string;
type _IQueryAddress = {
  zipCode: string;
  geoState: string;
  country: string;
};
export interface IZipCodeToLatLong {
  cepToLatLng(query: IQueryAddress): Promise<{ lat: number; lng: number }>;
}

export function getZipToLatStrategy(tipo?: string): IZipCodeToLatLong {
  if (tipo === 'nominatim') {
    return new NominatimZipcodeStrategy();
  } else {
    return new OpenCageZipcodeStrategy();
  }
}
