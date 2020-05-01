import { Location } from './Location';
import Debug from 'debug';
const debug = Debug('ip-to-geo-location');
import * as path from 'path';
import * as fs from 'fs';
import * as csvParse from 'csv-parse';

export function contiCodeToName( code ) {
  switch (code) {
    case 'AF':
      return 'Africa';
    case 'AN':
      return 'Antarctica'
    case 'AS':
      return 'Asia';
    case 'EU':
      return 'Europe';
    case 'OC':
    case 'AU':
      return 'Oceania';
    case 'NA':
      return 'North America';
    case 'SA':
      return 'South America';
    default:
      return 'Unknown';
  }
}

/**
 * Create a function that returns a copy of a Location with continent information added.
 */
export const getAddContinentFn = async () =>
  addContinent(await getContinentLookupTable());

/**
 * Return a copy of Location enhanced with continent information.
 * @param countryToContinentMap - initilized Map of country codes to continent codes.
 * @param loc - Location object includes an ISO 3166-1 alpha-2 country code in field country_code.
 * @returns - A copy of Location object with continent and continent_code fields set.
 */
const addContinent = countryToContinentMap =>
  (loc: Location): Location =>
{
  if (!loc) return loc;
  const code = countryToContinentMap.get(loc.country_code);
  return {
    ...loc,
    continent: contiCodeToName(code),
    continent_code: code 
  }
}

/**
 * Return a geojson-geometries-lookup object, initialized with locally
 * saved state/provinces feature collection.
 */
const getContinentLookupTable = (() => {
  const table = new Map<string, string>();
  return async () => {
    if (table.size > 0) {
      debug(`Country to continent table already loaded`);
      return table;
    }
    debug(`Country to continent table has not been loaded yet.  Initializing....`);
    const csvPath = path.join(__dirname, '../data/country_continent.csv');
    const parser = csvParse( { columns: true } );
    const readable = fs.createReadStream(csvPath, { encoding: 'utf8' }).pipe(parser);
    for await (const r of readable) {
      table.set(r['iso 3166 country'], r['continent code']);
    }
    debug('Finished loading country to continent table.');
    if (table.size === 0) throw new Error('No entries added to country to continent table.');
    return table;
  }
})();

(async ()=> {
  const addConti = await getAddContinentFn();
  let cc = 'BR';
  console.log(`'${cc}' location:`, addConti({country_code: cc, lat: 0, lon: 0}));
})();