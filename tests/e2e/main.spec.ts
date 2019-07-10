import { ipToGeo, Location } from '../../src';
import 'mocha';
import { expect } from 'chai';

// test that both database files are downloaded automtically when then do not exist
// file names will be hard-coded
// we will assume we can use the /data directory
// need to test use of data directory when this is used as an npm package

describe ('End-to-end', function() {

  describe('ipToGeo', function() {
    it('correctly looks up ip address for Google', async function() {
      const ip = '172.217.11.164';
      const loc: Location = await ipToGeo(ip);
      expect(loc).to.not.be.null;
    });

  });

});