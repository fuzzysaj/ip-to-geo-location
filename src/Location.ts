export interface Location {
  city_geonameid?: number,
  city?: string
  country?: string,
  country_code?: string,
  country_geonameid?: number,
  region?: string,
  region_code?: string,
  region_type?: string, // type_en
  county?: string,
  county_code?: string,
  continent?: string,
  continent_code?: string,
  lat: number,
  lon: number
};

// export type RegionType = 'State' | 'Province' | 'Department' | 'Region' | 'Autonomous Region' 
//   | 'Centrally Administered Area' | 'Administrative State' | 'Overseas department' | 'Neutral City'
//   | 'County' | 'Municipality' | 'Republic' | 'Territory' | 'Prefecture' | 'Autonomous Commune' | 'Division'
//   | 'Autonomous Community' | 'Indigenous Territory' | 'Governorate' | 'Préfecture'
//   | 'Municipality|Governarate' | 'Federal District' | 'Autonomous Province' | 'Independent Component City'
//   | 'Independent City' | 'Administrative Zone' | 'Autonomous Sector' | 'Highly Urbanized City'
//   | 'Special Municipality' | 'Metropolis' | 'Unitary District' | 'Unitary Authority'
//   | 'Administrative County' | 'Metropolitan department' | 'Parish' | 'Quarter'
//   | 'Special Municipality' | 'Federal Dependency' | 'Overseas department' | 'Dependency'
//   | 'District|Regencies' | 'Atoll' | 'Capital' | 'Unitary Single-Tier County' | 'Regional Council'
//   | 'Capital Territory' | 'Statistical Region' | 'Republican City'; // not exhaustive!
