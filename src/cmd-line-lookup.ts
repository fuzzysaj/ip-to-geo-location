import { getIpToLocationFn } from './';

(async ()=> {
  if (process.argv.length <= 2) {
    console.log('Must pass in ip address as first command line argument.');
    console.log('For example, to look up a well-known Phoenix IP address: ./lookup 148.167.2.30')
    return;
  }
  const ip = process.argv[2];
  if (!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    console.log(`Argument "${ip}" does not look like an IPv4 address.`);
    return;
  }
  const ipToLoc = await getIpToLocationFn();
  console.log('Looking up location details for ip address ' + ip);
  try {
    const loc = await ipToLoc(ip);
    console.log(`Location details for ip address ${ip}:\n${JSON.stringify(loc,null,2)}`);
  } catch (e) {
    console.log(`Error while calling ipToGeo("${ip}")`, e);
  }
})();