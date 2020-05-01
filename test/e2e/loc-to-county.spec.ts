import { Location } from '../../src';
import { getAddCountyFn } from '../../src/loc-to-county';
import 'mocha';
import { expect } from 'chai';

describe('loc-to-county', function() {

  const phxLatLon: Location = { lat: 33.5038, lon: -112.0253 };
  let addCounty: ((loc: Location) => Location);
  before(async function() {
    addCounty = await getAddCountyFn();
  })

  describe('addCounty', function() {

    it('Handles null locations', async function() {
      expect(addCounty(null)).to.be.null;
    });

    it('Skips locations with US country code', function() {
      const loc = {...phxLatLon, country_code: 'CA'};
      expect(addCounty(loc)).to.equal(loc);
    });

    it('Finds correct county for known lat lon and missing country_code', function() {
      const loc = addCounty(phxLatLon);
      expect(loc.county).to.equal('Maricopa');
      expect(loc.county_code).to.equal('04013');
    });

    it('Finds correct county for known lat lon with US country_code', function() {
      const loc = addCounty({...phxLatLon, country_code: 'us'});
      expect(loc.county).to.equal('Maricopa');
      expect(loc.county_code).to.equal('04013');
    });

  });

});