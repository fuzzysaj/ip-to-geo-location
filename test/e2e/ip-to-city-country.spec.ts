import { Location } from '../../src/Location';
import { getIpToCityCountryFn } from '../../src/ip-to-city-country';
import 'mocha';
import * as chai from 'chai';
const chaiAlmost = require('chai-almost');
chai.use(chaiAlmost(0.01)); // specify number equality tolerance
const expect = chai.expect;

describe('ip-to-city-country', function() {

  const phxLatLon: Location = { lat: 33.5038, lon: -112.0253 };
  let ipToCityCountryLoc: ((ip: string) => Location);
  before(async function() {
    this.timeout(30000); // allow 30 seconds timeout
    ipToCityCountryLoc = await getIpToCityCountryFn();
  })

  describe('ipToCityCountryLoc', function() {

    it('Handles null ip', async function() {
      expect(() => ipToCityCountryLoc(null)).to.throw('Not a string.');
    });

    it('Finds correct city, country, lat/long for known ip', function () {
      const phxIp = '148.167.2.30';
      const loc = ipToCityCountryLoc(phxIp);
      expect(loc).to.exist;
      expect(loc.city_geonameid).to.exist;
      expect(loc.lat).to.exist;
      expect(loc.lon).to.exist;
      expect(loc.lat).to.almost.equal(33.5);
      expect(loc.lon).to.almost.equal(-112.1);
      expect(loc.city).to.exist;
      expect(loc.country_geonameid).to.exist;
      expect(loc.country_geonameid).to.equal(6252001);
      expect(loc.city).to.equal('Phoenix');
      expect(loc.country).to.equal('United States');
      expect(loc.country_code).to.equal('US');
    });

    it('Returns null for unknown ip', function () {
      const nowhere = '0.0.0.0';
      const loc = ipToCityCountryLoc(nowhere);
      expect(loc).to.be.null;
    });

  });

});