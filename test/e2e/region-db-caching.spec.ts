import { delRegionFile, okRegionFile, isRegionFileCurrent,
  updateRegionFile } from '../../src/region-db-update';
import 'mocha';
import { expect } from 'chai';

describe ('Region geo database auto-caching', function() {

  it('When no cached regions file exist, region file reported as not current', async function() {
    await delRegionFile();
    const isCurrent = await isRegionFileCurrent();
    expect(isCurrent).to.be.false;
  });

  it('When no cached regions file exist, region file reported as not ok', async function () {
    await delRegionFile();
    const isOk = await okRegionFile();
    expect(isOk).to.be.false;
  });

  it('Updates are successful when no cached file exists initially.', async function() {
    this.timeout(30000); // allow 30 seconds just for this test
    await delRegionFile();
    const updateSuccess = await updateRegionFile();
    expect(updateSuccess).to.be.true;
    const isCurrent = await isRegionFileCurrent();
    expect(isCurrent).to.be.true;
    const isOk = await okRegionFile();
    expect(isOk).to.be.true;
    const updateSuccess2 = await updateRegionFile();
    expect(updateSuccess2).to.be.true;
    const isCurrent2 = await isRegionFileCurrent();
    expect(isCurrent2).to.be.true;
    const isOk2 = await okRegionFile();
    expect(isOk2).to.be.true;
  });

});