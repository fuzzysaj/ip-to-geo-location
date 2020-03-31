import { Location } from './Location';
import { getAdmin1GeoJson } from '@fuzzysaj/nat-earth-geojson-cache'
import * as gjgLookup from 'geojson-geometries-lookup';
import Debug from 'debug';
const debug = Debug('ip-to-geo-location');

/**
 * Create a function that returns a copy of a Location with state/provice information added.
 * Uses the built-in admin1 spatial index created from Natural Earth shapefiles.
 */
export const getAddRegionFn = async () =>
  addRegion(await getAdmin1SpatialIndex());

/**
 * Return a copy of Location enhanced with state/province information.
 * @param admin1SpatialIndex - geojson-geometries-lookup spatial index initialized with admin1 data.
 * @param loc - Location object that includes lat, lon.
 * @returns - A copy of Location object with region, region_code and region_type fields set.
 */
const addRegion = admin1SpatialIndex =>
  (loc: Location): Location =>
{
  if (!loc) return loc;
  const p = { type: "Point", coordinates: [loc.lon, loc.lat] };
  const ccount = admin1SpatialIndex.countContainers(p);
  const containers = admin1SpatialIndex.getContainers(p);
  if (ccount === 0 || !containers || !containers.features) {
    debug(`Region lookup failed for {lat: ${loc.lat}, lon: ${loc.lon}}.`);
    return loc;
  }
  const props = containers.features[0].properties;
  return {
    ...loc,
    region: props.name, // adm1 name
    region_code: props.iso_3166_2.split("-")[1], // adm1 code
    region_type: props.type_en 
  }
}

/**
 * Return a geojson-geometries-lookup object, initialized with locally
 * saved state/provinces feature collection.
 */
const getAdmin1SpatialIndex = (() => {
  let glookup = null;
  return async () => {
    if (glookup) {
      debug(`Admin1 spatial index already initialized`);
      return glookup;
    }
    debug(`Admin1 spatial index has not been initialized yet.  Initializing....`);
    const admin1FeatColl = await getAdmin1GeoJson();
    debug(`admin1FeatColl.type: ${admin1FeatColl.type}`);
    glookup = new gjgLookup(admin1FeatColl);
    debug('Finished initializing GeoJsonGeometries index for Admin1.');
    if (!glookup) throw new Error('Admin1 spatial index was not initialized.');
    return glookup;
  }
})();
