import axios from 'axios';
import { IZipCodeToLatLong } from '../izipcode-to-lat-lon';

export class OpenCageZipcodeStrategy implements IZipCodeToLatLong {
  async cepToLatLng(zipCode: string, country = 'BR'): Promise<{ lat: number; lng: number }> {
    console.log('🚀 ~ file: opencage-zipcode-strategy.ts:6 ~ zipCode:', zipCode);
    const params = {
      q: `${zipCode}, Brazil`,
      key: process.env.OPEN_CAGE_API_KEY,
      limit: 1, // Get only the top result
    };
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, { params });
    console.log('🚀 ~ file: opencage-zipcode-strategy.ts:13 ~ response:', response.config.url);
    const data = response.data;
    console.log('🚀 ~ file: opencage-zipcode-strategy.ts:8 ~ data:', data);
    return {
      lat: data.results[0].geometry.lat,
      lng: data.results[0].geometry.lng,
    };
  }
}
