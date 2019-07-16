# @fuzzysaj/ip-to-geo-location

[![npm (scoped)](https://img.shields.io/npm/v/@fuzzysaj/ip-to-geo-location.svg)](https://www.npmjs.com/package/@fuzzysaj/ip-to-geo-location) [![Build Status](https://travis-ci.org/fuzzysaj/ip-to-geo-location.svg?branch=master)](https://travis-ci.org/fuzzysaj/ip-to-geo-location) [![dependencies Status](https://david-dm.org/fuzzysaj/ip-to-geo-location/status.svg)](https://david-dm.org/fuzzysaj/ip-to-geo-location) [![code coverage]( https://img.shields.io/codecov/c/github/fuzzysaj/ip-to-geo-location.svg)](https://codecov.io/gh/fuzzysaj/ip-to-geo-location)

A program to look up geo-location information from an IP address.  The program downloads freely available ip to location and map databases from MaxMind and Natural Earth on a regular schedule so that lookups can be done locally, very quickly.

## Install

$ npm install @fuzzysaj/ip-to-geo-location

## Usage

With JavaScript:

```js
const ipToGeo = require('@fuzzysaj/ip-to-geo-location').ipToGeo;

(async ()=> {
  const loc = await ipToGeo('1.72.0.0');
  // -> { country: "Japan", country_code: "JP", region: "Tokyo", region_code: "13",
  //      region_type: "Metropolis", city: "Setagaya-ku", lat: 35.6422, lon: 139.6475 }
})();
```

With TypeScript:

```ts
import { ipToGeo, Location } from '@fuzzysaj/ip-to-geo-location'

(async ()=> {
  const loc: Location = await ipToGeo('1.72.0.0');
  // -> { country: "Japan", country_code: "JP", region: "Tokyo", region_code: "13",
  //      region_type: "Metropolis", city: "Setagaya-ku", lat: 35.6422, lon: 139.6475 }
})();
```
