import { Location, ipToGeo } from './';

(async ()=> {
  if (process.argv.length <= 2) {
    console.log('Must pass in ip address as first command line argument.');
    return;
  }
  const ip = process.argv[2];
  if (!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    console.log(`Argument "${ip}" does not look like an IPv4 address.`);
    return;
  }
  console.log('Looking up location details for ip address ' + ip);
  try {
    const loc = await ipToGeo(ip);
    console.log(`Location details for ip address ${ip}:\n${JSON.stringify(loc,null,2)}`);
  } catch (e) {
    console.log(`Error while calling ipToGeo("${ip}")`, e);
  }
})();