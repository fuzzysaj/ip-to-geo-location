import { Location } from '../../src';
import { getAddRegionFn, iso3116_2_toRegionCode } from '../../src/loc-to-region';
import 'mocha';
import { expect } from 'chai';

describe('ip-to-region', function() {

  const phxLatLon: Location = { lat: 33.5038, lon: -112.0253 };
  let addRegion: ((loc: Location) => Location);
  before(async function() {
    addRegion = await getAddRegionFn();
  });

  describe('iso3116_2_toRegionCode', function() {
    it('Handles null and non-conforming ISO 3166-2 codes', function() {
      expect(iso3116_2_toRegionCode(null)).to.equal('');
      expect(iso3116_2_toRegionCode(' US-AZ')).to.equal('');
      expect(iso3116_2_toRegionCode('US-~AZ')).to.equal('');
      expect(iso3116_2_toRegionCode('U-AZ')).to.equal('');
    });

    it('Handles conforming ISO 3166-2 codes and conforming codes with extra characters on end', function() {
      expect(iso3116_2_toRegionCode('US-AZ~')).to.equal('AZ');
      expect(iso3116_2_toRegionCode('uS-aZ1')).to.equal('AZ1');
      expect(iso3116_2_toRegionCode('uS-aZ12')).to.equal('AZ1');
    });

  });

  describe('addRegion', function() {

    it('Handles null locations', async function() {
      expect(addRegion(null)).to.be.null;
    });

    it('Finds correct region for known lat lon', function () {
      const loc = addRegion(phxLatLon);
      expect({lat: loc.lat, lon: loc.lon}).to.deep.equal(phxLatLon);
      expect(loc.region).to.equal('Arizona');
      expect(loc.region_code).to.equal('AZ');
      expect(loc.region_type).to.equal('State');
    });

    it('Does not add region for unknown lat lon', function () {
      const nowhere: Location = { lat: 0, lon: 0 };
      const loc = addRegion(nowhere);
      expect({lat: 0, lon: 0}).to.deep.equal(nowhere);
    });

  });

});