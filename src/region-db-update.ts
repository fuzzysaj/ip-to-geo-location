import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as shp2json from 'shp2json';
import { delFileIfExists, fileSizeInBytes, msSinceLastUpdate } from './file-utils';
import Debug from 'debug';
const debug = Debug('ip-to-geo-location');

const finalRegionFilePath = path.resolve(__dirname, '../data/ne_10m_admin_1_states_provinces.json');
const tempRegionFilePath = path.resolve(__dirname, '../data/ne_10m_admin_1_states_provinces.temp.json');
const regionDbUrl = "https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip";
const msPerDay = 1000*60*60*24;
const daysBetweenRegionUpdates = 30;
const msBetweenRegionUpdates = daysBetweenRegionUpdates*msPerDay;  // 30 days between updates

/** Deletes final and temporary GeoJson db files if they exist.  Returns void. */
export async function delRegionFile(): Promise<void> {
  await delFileIfExists(tempRegionFilePath);
  await delFileIfExists(finalRegionFilePath);
}

/** Returns true if final GeoJson db file exists and size > 0 bytes. */
export async function okRegionFile(): Promise<boolean> {
  return await fileSizeInBytes(finalRegionFilePath) > 0;
}

/** Returns true if the regions GeoJson db file exists, and is
 * greater than 0 bytes and is not older than 30 days old.
 */
export async function isRegionFileCurrent(): Promise<boolean> {
  return (
    (await okRegionFile()) &&
    ((await msSinceLastUpdate(finalRegionFilePath)) < msBetweenRegionUpdates)
  ); 
}

/** When the regions GeoJson file does not exist, or when when it is
 * more than 30 days since last update, the regions GeoJson file is
 * downloaded to a temporary file and is renamed to the final file
 * if success.  If not successful, the original file remains.
 * Returns true on success.
 */
export async function updateRegionFile(): Promise<boolean> {
  if (await isRegionFileCurrent()) {
    const daysOld = ((await msSinceLastUpdate(finalRegionFilePath))/msPerDay).toFixed(1);
    debug(`Skipping download since ${finalRegionFilePath} already exists ` +
      `and is ${daysOld} < ${daysBetweenRegionUpdates} days old.`);
    return true;
  }
 
  debug(`Downloading\n  ${regionDbUrl}\n  to\n  ${tempRegionFilePath}`);
  const resp = await axios({
    method: "get",
    url: regionDbUrl,
    responseType: "stream"
  });
  const ws = fs.createWriteStream(tempRegionFilePath);
  shp2json(resp.data).pipe(ws);
  return new Promise(function (resolve, reject) {
    ws.on('finish', async () => {
      debug(`Finished downloading ${tempRegionFilePath} with status ${resp.status}.`);
      await promisify(fs.rename)(tempRegionFilePath, finalRegionFilePath);
      debug(`Renamed to ${finalRegionFilePath}`);
      resolve(true);
    });
    ws.on('error', (err: Error) => {
      debug(`Download to ${tempRegionFilePath} failed: ${err.toString()}`);
      reject(err);
    });
  });
}
