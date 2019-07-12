import { ipToGeo, Location } from '../../src';
import 'mocha';
import { expect } from 'chai';

// test that both database files are downloaded automtically when then do not exist
// file names will be hard-coded
// we will assume we can use the /data directory
// need to test use of data directory when this is used as an npm package

describe.skip('End-to-end', function() {

  describe('Basic ipToGeo lookup', function() {
    it('When google.com ip address is searched for, it finds location information', async function() {
      const ip = '172.217.11.164';
      const loc: Location = await ipToGeo(ip);
      expect(loc).to.not.be.null;
    });

    it('When an invalid ip address 0.0.0.0 is searched for, it returns null', async function() {
      const ip = '0.0.0.0';
      const loc: Location = await ipToGeo(ip);
      expect(loc).to.be.null;
    });

  });

});