import * as fs from 'fs';
import * as zlib from 'zlib';
import * as tar from 'tar-stream';
import { promisify } from 'util';
import axios from 'axios';

/** Returns true if path exists.  Otherwise, returns false. */
export async function pathExists(thePath: string): Promise<boolean> {
  let stats: fs.Stats = null;
  try {
    stats = await promisify(fs.stat)(thePath);
    return true;
  } catch (err) { }
  return false;
}

export async function fileSizeInBytes(thePath: string): Promise<number> {
  let stats: fs.Stats = null;
  try {
    stats = await promisify(fs.stat)(thePath);
    return stats.size;
  } catch (err) { }
  return 0;
}

export async function delFileIfExists(thePath: string): Promise<void> {
  try {
    if (await pathExists(thePath)) {
      await promisify(fs.unlink)(thePath);
    }
  } catch (err) {
    throw err;
  }
}

/** Number of milliseconds since file or directory was last
 * updated.  If file does not exist, Infinity is returned.
 */
export async function msSinceLastUpdate(thePath: string): Promise<number> {
  let stats: fs.Stats = null;
  try {
    const { mtime } = await promisify(fs.stat)(thePath);
    return Date.now() - mtime.getTime();
  } catch (err) { }
  return Infinity;
}

/** Download url to target destination.  Returns the HTTP status */
export async function downloadFile(url: string, targetPath: string): Promise<number> {
  const resp = await axios({
    method: "get",
    url: url,
    responseType: "stream"
  });
  // Because responseType is stream, resp.data is actually a stream object
  const stream: fs.ReadStream = resp.data;
  const write = stream.pipe(fs.createWriteStream(targetPath));
  return new Promise(function (resolve, reject) {
    stream.on("end", () => resolve(resp.status));
    stream.on("error", (err: Error) => reject(err));
  });
}

/** Given a link to a tar.gz url file, return the directory contents */
export async function listTarGz(url: string): Promise<string[]> {
  const gunzip = zlib.createGunzip();
  const extract = tar.extract();
  const names = new Array<string>();

  extract.on('entry', function (header, stream, next) {
    if (header.type === 'file') names.push(header.name);
    stream.on('end', () => next() ); // ready for next
    stream.resume(); // just auto drain the stream
  });

  const resp = await axios({
    method: "get",
    url: url,
    responseType: "stream"
  });
  const readStream: fs.ReadStream = resp.data;
  readStream.pipe(gunzip).pipe(extract);

  return new Promise(function (resolve, reject) {
    extract.on('finish', () => resolve(names));
    extract.on('error', (err: Error) => reject(err));
  });
}

/** Given a link to a tar.gz url file, extract the first file matching
 * pattern provided.  Result is written to file at provided path.
 */
export async function extractMatchingTarGz(url: string, regexpMatch: RegExp, targetPath: string): Promise<number> {
  const gunzip = zlib.createGunzip();
  const extract = tar.extract();

  extract.on('entry', function (header, stream, next) {
    // header is the tar header
    // stream is the content body (might be an empty stream)
    // call next when you are done with this entry

    stream.on('end', () => next() ); // ready for next entry
    if (header.type === 'file' && regexpMatch.test(header.name)) {
      stream.pipe(fs.createWriteStream(targetPath));
    } else {
      stream.resume() // just auto drain the stream
    }
  });

  const resp = await axios({
    method: "get",
    url: url,
    responseType: "stream"
  });
  const readStream: fs.ReadStream = resp.data;
  readStream.pipe(gunzip).pipe(extract);

  return new Promise(function (resolve, reject) {
    extract.on('finish', () => resolve(resp.status));
    extract.on('error', (err: Error) => reject(err));
  });
}
