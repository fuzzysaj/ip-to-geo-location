import * as path from 'path';
import { Location } from './Location';
import { FeatColl, NatEarthFeature } from './NatEarthFeature';
import { updateRegionFile } from './region-db-update';
import { updateIpCityFile } from './ip-city-db-update';
import maxmind, { CityResponse } from 'maxmind';
import * as gjgLookup from 'geojson-geometries-lookup';
import { County, locToCounty } from '@fuzzysaj/location-to-usa-county';

import Debug from 'debug';
import { stringify } from 'querystring';
const debug = Debug('ip-to-geo-location');

let glookup = null;
let lookupService = null;
let initialized = false;

async function initializeServices(): Promise<{ glookup: any, lookupService: any}> {
  await Promise.all([updateIpCityFile(), updateRegionFile()]);
  debug('Finished updating all database files.');
  const lookupService = await maxmind.open<CityResponse>(path.resolve(__dirname, '../data/GeoLite2-City.mmdb'));
  debug('Finished initializing ip lookup index.');
  const admin1FeatColl = require('../data/ne_10m_admin_1_states_provinces.json') as FeatColl;
  const glookup = new gjgLookup(admin1FeatColl);
  debug('Finished initializing GeoJsonGeometries index.');
  initialized = true;
  return { glookup: glookup, lookupService: lookupService }
}

export async function ipToGeo(ip: string): Promise<Location> {
  debug(`Entering ipToGeo(${ip})`);
  if (!initialized) {
    debug(`Databases and lookup indecies have not been initialized yet.  Initializing....`);
    const services = await initializeServices();
    glookup = services.glookup;
    lookupService = services.lookupService;
  }
  if (!glookup) throw new Error('glookup not initialized.');
  if (!lookupService) throw new Error('lookupService not initialized.');
  if (typeof ip !== "string") throw new TypeError("Not a string.");
  const city = lookupService.get(ip);
  if (!city || !city.city || !city.country || !city.location) {
    debug(`lookup failed for ${ip}`);
    return null;
  }
  const { latitude, longitude } = city.location;
  debug(`${ip} => city: ${city.city.names.en}, country: ${city.country.names.en}, `
     + `location: [lon: ${longitude}, lat: ${latitude}]`);
  const loc: Location = {
    country: city.country.names.en,
    country_code: city.country.iso_code,
    region: null,
    region_code: null,
    region_type: null,
    city: city.city.names.en,
    lat: latitude,
    lon: longitude
  };
  const p = { type: "Point", coordinates: [longitude, latitude] };
  const ccount = glookup.countContainers(p);
  const containers = glookup.getContainers(p);
  if (ccount === 0 || !containers || !containers.features) {
    debug(`City lookup successfull, but region lookup failed for ip ${ip}.`);
    return loc;
  }
  const props = containers.features[0].properties;
  const [adm0_code, adm1_code] = props.iso_3166_2.split("-");
  const adm1_name = props.name;
  loc.country_code = adm0_code;
  loc.region = adm1_name;
  loc.region_code = adm1_code;
  loc.region_type = props.type_en;
  if (loc.country_code === 'US') {
    debug(`Country is US.  Lookup up county.`);
    const county: County = locToCounty(loc.lat, loc.lon);
    if (county) {
      loc.county = county.county_name;
      loc.county_fips = county.county_fips;
    }
  }


  return loc;
};
