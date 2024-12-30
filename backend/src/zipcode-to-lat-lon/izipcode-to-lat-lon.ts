import { NominatimZipcodeStrategy } from './strategies/nominatim-zipcode-strategy';
import { OpenCageZipcodeStrategy } from './strategies/opencage-zipcode-strategy';

export interface IZipCodeToLatLong {
  cepToLatLng(zipCode: string, country?: string): Promise<{ lat: number; lng: number }>;
}

export function getZipToLatStrategy(tipo?: string): IZipCodeToLatLong {
  if (tipo === 'nominatim') {
    return new NominatimZipcodeStrategy();
  } else {
    return new OpenCageZipcodeStrategy();
  }
}
