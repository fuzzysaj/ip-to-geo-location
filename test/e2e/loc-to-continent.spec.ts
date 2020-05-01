import { Location } from '../../src';
import { contiCodeToName, getAddContinentFn } from '../../src/loc-to-continent';
import 'mocha';
import { expect } from 'chai';

describe('loc-to-continent', function() {

  let addConti: ((loc: Location) => Location);
  before(async function() {
    addConti = await getAddContinentFn();
  });

  describe('contiCodeToName', function() {
    it('Returns full names from two character continent codes', function() {
      expect(contiCodeToName(null)).to.equal('Unknown');
      expect(contiCodeToName('NA')).to.equal('North America');
      expect(contiCodeToName('AU')).to.equal('Oceania');
      expect(contiCodeToName('OC')).to.equal('Oceania');
      expect(contiCodeToName('US')).to.equal('Unknown');
    });

  });

  describe('addConti', function() {

    it('Handles null locations', async function() {
      expect(addConti(null)).to.be.null;
    });

    it('Finds correct continent name and codes', function () {
      const locUS = addConti({ country_code: 'US', lat: 0, lon: 0 });
      expect(locUS.continent).to.equal('North America');
      expect(locUS.continent_code).to.equal('NA');
      const locBR = addConti({ country_code: 'BR', lat: 0, lon: 0 });
      expect(locBR.continent).to.equal('South America');
      expect(locBR.continent_code).to.equal('SA');
    });

    it('Returns unknown for unknown country codes', function () {
      const nowhere: Location = { lat: 0, lon: 0 };
      const loc = addConti({ country_code: 'ZZ', lat: 0, lon: 0 });
      expect(loc.continent).to.equal('Unknown');
      expect(loc.continent_code).to.equal('--');
    });

  });

});