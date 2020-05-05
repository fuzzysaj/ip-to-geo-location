import { Location } from '../../src';
import { getIpToLocationFn } from '../../src/ip-to-location';
import 'mocha';
import * as chai from 'chai';
const chaiAlmost = require('chai-almost');
chai.use(chaiAlmost(0.1)); // specify number equality tolerance
const expect = chai.expect;

describe('ip-to-location', function() {

  let ipToLocation: ((ip: string) => Location);
  before(async function() {
    this.timeout(30000); // allow 30 seconds timeout
    ipToLocation = await getIpToLocationFn();
  })


  describe('ip-to-location', function() {

    it('Handles unknown ips', async function() {
      expect(ipToLocation('0.0.0.0')).to.be.null;
    });

    it('Finds correct location for well-known Phoenix IP', function () {
      const phxLatLon: Location = { lat: 33.5038, lon: -112.0253 };
      const phxIp = '148.167.2.30';
      const loc = ipToLocation(phxIp);

      expect(loc).to.exist;
      expect(loc.lat).to.exist;
      expect(loc.lon).to.exist;
      expect(loc.lat).to.almost.equal(33.5);
      expect(loc.lon).to.almost.equal(-112.1);
      expect(loc.city_geonameid).to.exist;
      expect(loc.city_geonameid).to.equal(5308655);
      expect(loc.city).to.exist;
      expect(loc.city).to.equal('Phoenix');
      expect(loc.country).to.equal('United States');
      expect(loc.country_code).to.equal('US');
      expect(loc.country_geonameid).to.exist;
      expect(loc.country_geonameid).to.equal(6252001);

      expect(loc.continent).to.equal('North America');
      expect(loc.continent_code).to.equal('NA');

      expect(loc.region).to.equal('Arizona');
      expect(loc.region_code).to.equal('AZ');
      expect(loc.region_type).to.equal('State');

      expect(loc.county).to.equal('Maricopa');
      expect(loc.county_code).to.equal('04013');
    });

  });

});