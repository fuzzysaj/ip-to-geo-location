import { Location } from './Location';

export async function ipToGeo(ip: string): Promise<Location> {
  if (typeof ip !== "string") throw new TypeError("Not a string.");
  const loc: Location = {
    country: null,
    country_code: null,
    region: null,
    region_code: null,
    region_type: null,
    city: null,
    lat: null,
    lon: null
  };
  return loc;
};
