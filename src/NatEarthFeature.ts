import { Polygon, MultiPolygon } from "@turf/helpers";

export { Polygon, MultiPolygon } from "@turf/helpers";

export interface FeatColl {
  type: 'FeatureCollection',
  features: Array<NatEarthFeature>
};

/** This captures a subset of useful properties encoded in the Natural Earth regions Shapefile. */
export interface NatEarthFeature {
  type: 'Feature',
  properties: {
    sov_a3?: string,
    adm0_a3?: string,
    admin?: string,
    iso_a2?: string,
    name?: string, // region name
    adm1_code?: string,
    iso_3166_2?: string,  // extract country and region code from this field.
    code_hasc?: string,
    postal?: string,
    type?: string,
    type_en?: string, // region type
    region?: string,
    wikipedia?: string,
    woe_id?: number,
    fips?: string,
    latitude?: number,
    longitude?: number
  },
  geometry: Polygon | MultiPolygon // | Point | MultiPoint | LineString | MultiLineString
  //  {
  //   type: 'Point' | 'MultiPoint' | 'Polygon' | 'MultiPolygon' | 'LineString' | 'MultiLineString',
  //   coordinates: [number, number] | Array< Array< [number, number] >> | Array< Array< Array< [number,number] >>>
  // }
};
