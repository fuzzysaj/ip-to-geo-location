import * as path from 'path';
import maxmind, { CityResponse } from 'maxmind';
import { updateIpCityFile, isIpCityFileCurrent, okIpCityFile } from './ip-city-db-update';
import { Location } from './Location';
import Debug from 'debug';
const debug = Debug('ip-to-geo-location');


/**
 * Create a function for lookuping up approximate location, country and city information
 * from an IP address.  Uses the default MaxMind lookup service.
 */
export const getIpToCityCountryFn = async () =>
  ipToCityCountryLoc(await getMaxMindLookup());

/**
 * Create a function for lookuping up approximate location, country and city information
 * from an IP address.
 * @param maxMindLookup - Fully initialized MaxMind ip lookup service
 * @param ip - IP address to lookup.
 * @returns Location object with lat, lon, country, country_code and city fields set.
 */
const ipToCityCountryLoc = maxMindLookup =>
  (ip: string): Location =>
{
  if (typeof ip !== "string") throw new TypeError("Not a string.");
  const city = maxMindLookup.get(ip);
  if (!city || !city.city || !city.country || !city.location) {
    debug(`Lat/long, city, and country lookup failed for ${ip}`);
    return null;
  }
  const { latitude: lat, longitude: lon } = city.location;
  debug(`${ip} => city: ${city.city.names.en}, country: ${city.country.names.en}, `
     + `location: {lat: ${lat}, lon: ${lon}}`);
  return {
    country: city.country.names.en,
    country_code: city.country.iso_code,
    city: city.city.names.en,
    lat: lat,
    lon: lon
  }
}

const getMaxMindLookup = (() => {
  let mmlookup = null;
  const mmdbPath = path.resolve(__dirname, '../data/GeoLite2-City.mmdb');
  return async () => {
    if (!await isIpCityFileCurrent()) {
      debug(`MaxMind database file is out of date.  Updating...`);
      await updateIpCityFile();
      if (!await okIpCityFile()) {
        throw new Error(`Problem with MaxMind db file ${mmdbPath}`);
      }
      mmlookup = null;
    }
    if (mmlookup) {
      debug(`MaxMind lookup service already initialized`);
      return mmlookup;
    }
    debug(`MaxMind lookup service has not been initialized yet.  Initializing...`);
    mmlookup = await maxmind.open<CityResponse>(mmdbPath);
    debug(`Finished inializing MaxMind lookup service`);
    if (!mmlookup) throw new Error('There was a problem initializing MaxMind lookup service.');
    return mmlookup;
  }
})();
