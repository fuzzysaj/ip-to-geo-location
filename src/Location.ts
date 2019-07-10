export type RegionType = 'state' | 'province' | 'district' | 'other'

export interface Location {
  country: string,
  country_code: string,
  region: string,
  region_code: string,
  region_type: RegionType,
  city: string
  lat: number,
  lon: number
};
