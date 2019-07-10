import { ipToGeo, Location } from '../../src';

async function main(): Promise<void> {
  const ip = '172.217.11.164';
  const loc: Location = await ipToGeo(ip);
  console.log(`${ip} => ${JSON.stringify(loc)}`)
}

main().catch(e => console.error(e));
