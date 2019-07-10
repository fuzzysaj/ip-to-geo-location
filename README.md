# @fuzzysaj/ip-to-geo-location

[![npm (scoped)](https://img.shields.io/npm/v/@fuzzysaj/ip-to-geo-location.svg)](https://www.npmjs.com/package/@fuzzysaj/ip-to-geo-location)

A program to look up geo-location information from an IP address.  The program downloads freely available ip to location and map databases from MaxMind and Natural Earth on a regular schedule so that lookups can be done locally, very quickly.

## Install

$ npm install @fuzzysaj/ip-to-geo-location

## Usage

With JavaScript:

```js
const ipToGeo = require('@fuzzysaj/ip-to-geo-location');

async function main() {
  const loc = await ipToGeo('172.217.11.164');  // www.googole.com
  // => { city: 'San Hose', region: 'California', country: 'United States of America', ... }
}
```

With TypeScript:

```ts
import { ipToGeo, Location } from '@fuzzysaj/ip-to-geo-location'

async function main() {
  const loc: Location = await ipToGeo('172.217.11.164');  // www.googole.com
  // => { city: 'San Hose', region: 'California', country: 'United States of America', ... }
}
```
