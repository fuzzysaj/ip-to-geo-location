import { getIpToCityCountryFn } from './ip-to-city-country';
import { getAddRegionFn } from './loc-to-region';
import { getAddCountyFn } from './loc-to-county';
import { pipe } from 'ramda';

/**
 * Returns a function that returns rich Location objects from ip addresses.
 */
export const getIpToLocationFn = async () => {
  const [ipToCityCountryLoc, addRegion, addCounty] = await Promise.all([
    getIpToCityCountryFn(), getAddRegionFn(), getAddCountyFn()
  ]);
  return pipe(
    ipToCityCountryLoc,
    addRegion,
    addCounty
  );
}
