import { getIpToCityCountryFn } from './ip-to-city-country';
import { getAddRegionFn } from './loc-to-region';
import { getAddCountyFn } from './loc-to-county';
import { getAddContinentFn } from './loc-to-continent';
import { pipe } from 'ramda';

/**
 * Returns a function that returns rich Location objects from ip addresses.
 */
export const getIpToLocationFn = async () => {
  const [ipToCityCountryLoc, addRegion, addCounty, addConti] = await Promise.all([
    getIpToCityCountryFn(), getAddRegionFn(), getAddCountyFn(), getAddContinentFn()
  ]);
  return pipe(
    ipToCityCountryLoc,
    addRegion,
    addCounty,
    addConti
  );
}
