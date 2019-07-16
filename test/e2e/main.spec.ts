import { ipToGeo, Location } from '../../src';
import 'mocha';
import { expect } from 'chai';

// test that both database files are downloaded automtically when then do not exist
// file names will be hard-coded
// we will assume we can use the /data directory
// need to test use of data directory when this is used as an npm package

describe('End-to-end', function() {

  describe('Basic ipToGeo lookup', function() {
    this.timeout(30000);
    it('When known Phoenix ip address is searched for, it finds location information', async function() {
      const ip = '148.167.2.30';
      const loc: Location = await ipToGeo(ip);
      expect(loc).to.not.be.null;
      expect(loc.city).to.equal('Phoenix');
      expect(loc.country).to.equal('United States');
      expect(loc.country_code).to.equal('US');
      expect(loc.region).to.equal('Arizona');
      expect(loc.region_code).to.equal('AZ');
      expect(loc.region_type).to.equal('State');
      expect(loc.lat).to.not.be.null;
      expect(loc.lon).to.not.be.null;
    });

    it('When an invalid ip address 0.0.0.0 is searched for, it returns null', async function() {
      const ip = '0.0.0.0';
      const loc: Location = await ipToGeo(ip);
      expect(loc).to.be.null;
    });

  });

});