import * as fs from 'fs';

export function fileWrite(data: any, filePath: string = 'listings.json') {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Listings saved to ${filePath}`);
  return filePath;
}
