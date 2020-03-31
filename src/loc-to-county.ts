import { Location } from './Location';
import { County, getLocToCountyLookupService } from '@fuzzysaj/location-to-usa-county';

/**
 * Create a function that returns a copy of a Location USA county information added.
 * Uses the built in USA counties geo-spatial index.
 */
export const getAddCountyFn = async () =>
  addCounty(await getLocToCountyLookupService());

/**
 * Return a copy of Location enhanced with USA county information if a USA location.
 * @param locToCountyService a function for looking up USA counties.
 * @param loc Location object that includes lat, lon and optionally country.  If country
 * is set and is not 'us' or 'US', then no lookup is done and original loc is returned.
 * @param
 * @returns A copy of loc with with county_name and county_fips set according to lookup.
 */
const addCounty = (locToCountyService: (lat: number, lon: number) => County) =>
  (loc: Location): Location =>
{
  if (!loc) return loc;
  if (loc.country_code && !/^US$/i.test(loc.country_code)) return loc;
  if (!loc.lat || !loc.lon ) return loc; 
  const c = locToCountyService(loc.lat, loc.lon);
  if (!c) return loc;
  return { ...loc, county: c.county_name, county_fips: c.county_fips };
}
