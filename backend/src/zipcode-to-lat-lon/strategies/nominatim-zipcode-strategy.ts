import axios from 'axios';
import { IZipCodeToLatLong } from '../izipcode-to-lat-lon';

export class NominatimZipcodeStrategy implements IZipCodeToLatLong {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';

  async cepToLatLng(zipCode: string, country = 'BR'): Promise<{ lat: number; lng: number }> {
    console.log('🚀 ~ file: nominatim-zipcode-strategy.ts:8 ~ zipCode:', zipCode);
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: `20740-320`,
          format: 'json',
          addressdetails: 1,
          country: 'BR', // Restrict search to Brazil
        },
      });

      const data = response.data;
      console.log('🚀 ~ file: nominatim-zipcode-strategy.ts:20 ~ data:', data);

      if (!data || data.length === 0) {
        throw new Error('No results found');
      }

      const location = data[0];
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
      };
    } catch (error) {
      console.error('Error fetching geocoding data:', error.message);
      throw new Error('Failed to get coordinates\n\n' + error.message);
    }
  }
}
