# @fuzzysaj/ip-to-geo-location

[![npm (scoped)](https://img.shields.io/npm/v/@fuzzysaj/ip-to-geo-location.svg)](https://www.npmjs.com/package/@fuzzysaj/ip-to-geo-location) [![Build Status](https://travis-ci.org/fuzzysaj/ip-to-geo-location.svg?branch=master)](https://travis-ci.org/fuzzysaj/ip-to-geo-location) [![dependencies Status](https://david-dm.org/fuzzysaj/ip-to-geo-location/status.svg)](https://david-dm.org/fuzzysaj/ip-to-geo-location) [![code coverage]( https://img.shields.io/codecov/c/github/fuzzysaj/ip-to-geo-location.svg)](https://codecov.io/gh/fuzzysaj/ip-to-geo-location)

A program to look up geo-location information from an IP address.  The program downloads freely available ip to location and map databases from MaxMind and Natural Earth on a regular schedule so that lookups can be done locally, very quickly.  For US locations, the county and county FIPS codes are also returned.

As of December 2020, [MaxMind now requires a free license key in order to download via their API](https://blog.maxmind.com/2019/12/18/significant-changes-to-accessing-and-using-geolite2-databases/). Once you have created a free account, you must create a license key for downloading the GeoLite2 databases.  This program uses [dotenv](https://www.npmjs.com/package/dotenv) to look for a environment variable MAXMIND_LICENSE_KEY.  This can be provided in a `.env` file in the format `MAXMIND_LICENSE_KEY=<your key>` or else set as an evironment variable.

As of March, 2020, this program indirectly depends on [gdal](https://www.npmjs.com/package/gdal), but `gdal` only compiles with node version <= 10x.  Therefore, any program using this program must also stick to node 10x.

## Install

$ npm install @fuzzysaj/ip-to-geo-location

## Usage

```js
import { getIpToLocationFn } from '@fuzzysaj/ip-to-geo-location'

(async ()=> {
  const ipToLoc = await getIpToLocationFn();
  const loc = ipToLoc('3.128.0.0');
  // -> { continent: "North America", continent_code: "NA",
  //      country: "United States", country_code: "US", country_geonameid: 6252001,
  //      region: "Ohio", region_code: "OH", region_type: "State",
  //      city: "Columbus", city_geonameid: 4509177,
  //      lat: 39.9653, lon: -83.0235, county: "Franklin", county_code: "39049" }
})();
```

## Geonameid

The `city_geonameid` and and `country_geonameid` fields correspond to feature `geonameid`
fields from [GeoNames](https://www.geonames.org/).  According to this
(http://forum.geonames.org/gforum/posts/list/36274.page)[FAQ], `geonameid`s do not change
over time and can therefore be used as primary keys in a database.