import { delIpCityFile, okIpCityFile, isIpCityFileCurrent,
  updateIpCityFile } from '../../src/ip-city-db-update';
import 'mocha';
import { expect } from 'chai';

describe('Ip to city database auto-caching', function() {

  it('When no cached file exist, file reported as not current', async function() {
    await delIpCityFile();
    const isCurrent = await isIpCityFileCurrent();
    expect(isCurrent).to.be.false;
  });

  it('When no cached file exist, file reported as not ok', async function () {
    await delIpCityFile();
    const isOk = await okIpCityFile();
    expect(isOk).to.be.false;
  });

  it('Updates are successful when no cached file exists initially.', async function() {
    this.timeout(30000); // allow 30 seconds just for this test
    await delIpCityFile();
    const updateSuccess = await updateIpCityFile();
    expect(updateSuccess).to.be.true;
    const isCurrent = await isIpCityFileCurrent();
    expect(isCurrent).to.be.true;
    const isOk = await okIpCityFile();
    expect(isOk).to.be.true;
    const updateSuccess2 = await updateIpCityFile();
    expect(updateSuccess2).to.be.true;
    const isCurrent2 = await isIpCityFileCurrent();
    expect(isCurrent2).to.be.true;
    const isOk2 = await okIpCityFile();
    expect(isOk2).to.be.true;
  });

});