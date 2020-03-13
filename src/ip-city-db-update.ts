import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { delFileIfExists, fileSizeInBytes, msSinceLastUpdate, extractMatchingTarGz } from './file-utils';
import Debug from 'debug';
const debug = Debug('ip-to-geo-location');

const ipCityRootName = 'GeoLite2-City';
const finalIpCityFilePath = path.resolve(__dirname, '../data/', ipCityRootName + '.mmdb');
const tempIpCityFilePath = path.resolve(__dirname, '../data/', ipCityRootName + '.temp.mmdb');
//const ipCityUrl = 'https://geolite.maxmind.com/download/geoip/database/' + ipCityRootName + '.tar.gz';
const ipCityUrl = `https://download.maxmind.com/app/geoip_download?edition_id=${ipCityRootName}&license_key=${process.env.MAXMIND_LICENSE_KEY}&suffix=tar.gz`


const msPerDay = 1000*60*60*24;
const daysBetweenIpCityUpdates = 7;
const msBetweenIpCityDbUpdates = daysBetweenIpCityUpdates*msPerDay;  // 7 days between updates

/** Deletes final and temporary ip to city db files if they exist.  Returns void. */
export async function delIpCityFile(): Promise<void> {
  await delFileIfExists(tempIpCityFilePath);
  await delFileIfExists(finalIpCityFilePath);
}

/** Returns true if final city to ip db file exists and size > 0 bytes. */
export async function okIpCityFile(): Promise<boolean> {
  return await fileSizeInBytes(finalIpCityFilePath) > 0;
}

/** Returns true if the regions GeoJson db file exists, and is
 * greater than 0 bytes and is not older than 30 days old.
 */
export async function isIpCityFileCurrent(): Promise<boolean> {
  return (
    (await okIpCityFile()) &&
    ((await msSinceLastUpdate(finalIpCityFilePath)) < msBetweenIpCityDbUpdates)
  ); 
}

/** When the regions ip to city file does not exist, or when when it is
 * more than 7 days since last update, the city to ip file is
 * downloaded to a temporary file and is renamed to the final file
 * if success.  If not successful, the original file remains.
 * Returns true on success.
 */
export async function updateIpCityFile(): Promise<boolean> {
  if (await isIpCityFileCurrent()) {
    const daysOld = ((await msSinceLastUpdate(finalIpCityFilePath))/msPerDay).toFixed(1);
    debug(`Skipping download since ${finalIpCityFilePath} already exists ` +
      `and is ${daysOld} < ${daysBetweenIpCityUpdates} days old.`);
    return true;
  }

  debug(`Downloading\n  ${ipCityUrl}\n  to\n  ${tempIpCityFilePath}`);
  try {
    const status = await extractMatchingTarGz(ipCityUrl, /GeoLite2-City\.mmdb/, tempIpCityFilePath);
    debug(`Finished downloading ${tempIpCityFilePath} with status ${status}.`);
    await promisify(fs.rename)(tempIpCityFilePath, finalIpCityFilePath);
    debug(`Renamed to ${finalIpCityFilePath}`);
    return true;
  } catch (err) {
    debug(`Download to ${tempIpCityFilePath} failed: ${err.toString()}`);
    return false;
  }
}
