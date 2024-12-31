import axios from 'axios';
import { IQueryAddress, IZipCodeToLatLong } from '../izipcode-to-lat-lon';

export class OpenCageZipcodeStrategy implements IZipCodeToLatLong {
  async cepToLatLng(query: IQueryAddress): Promise<{ lat: number; lng: number }> {
    console.log('🚀 ~ file: opencage-zipcode-strategy.ts:6 ~ zCode:', process.env.OPEN_CAGE_KEY);

    const params = {
      q: query,
      key: process.env.OPEN_CAGE_KEY,
      limit: 5,
    };
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, { params });
    // console.log('🚀 ~ file: opencage-zipcode-strategy.ts:13 ~ response:', response.config.url);
    const data = response.data.results;
    console.log('🚀 ~ file: opencage-zipcode-strategy.ts:8 ~ data:', data);
    return {
      lat: data[0].geometry.lat,
      lng: data[0].geometry.lng,
    };
  }
}
