# Mila

[![pipeline status](https://gitlab.com/rocwang/bus/badges/master/pipeline.svg)](https://gitlab.com/rocwang/bus/commits/master)
[![coverage report](https://gitlab.com/rocwang/bus/badges/master/coverage.svg)](https://gitlab.com/rocwang/bus/commits/master)
[![Netlify Status](https://api.netlify.com/api/v1/badges/5d4a6825-e06a-4e34-ab06-6b344134bf97/deploy-status)](https://app.netlify.com/sites/busbus/deploys)

## Project setup

* Install dependencies: `npm install`
* Compiles and hot-reloads for development: `npm run serve`
* Compiles and minifies for production: `npm run build`
* Lints and fixes files: `npm run lint`
* Run your end-to-end tests: `npm run test:e2e`
* Run your unit tests: `npm run test:unit`
  
For customize configuration, see [Configuration Reference](https://cli.vuejs.org/config/).

Remember to [set up EditorConfig for your preferred editor](https://editorconfig.org/#download).

### Required Environment Variables

#### During Build

* VUE_APP_MAPBOX_ACCESS_TOKEN
* VUE_APP_AUCKLAND_TRANSPORT_API_KEY
* VUE_APP_GTFS_API

#### During Deployment

* NETLIFY_AUTH_TOKEN
* NETLIFY_SITE_ID

For local development, copy `.env.template` as `.env.local`
and add the environment variable values there.

## Typefaces to Consider

* [Inter UI font family](https://rsms.me/inter/)
* [Public Sans](https://public-sans.digital.gov/)

## Useful Links

* [ATLabs](http://www.atlabs.xyz/gettingstarted/)
* [Auckland GTFS Feed](https://at.govt.nz/about-us/at-data-sources/general-transit-feed-specification/)
* [Auckland Transport Developer Portal](https://dev-portal.at.govt.nz/)
* [GTFS Best Practices](https://docs.google.com/document/d/1FeAJNDs-1EdzcQq_daq8_uR0KIug6tzKDxdPxSdi8L4)
* [GTFS Examples](https://docs.google.com/document/d/16inL5BVcM1aU-_DcFJay_tC6Ni0wPa0nvQEstueG5k4)
* [GTFS Realtime Reference](https://developers.google.com/transit/gtfs-realtime/reference/)
* [GTFS Static Reference](https://developers.google.com/transit/gtfs/reference/)
* [Google Cloud Functions for the Project](https://console.cloud.google.com/functions/details/us-central1/gtfs?project=busbus-1543474170809&authuser=2&tab=general&duration=PT12H)
* [Mapbox GL JS API Reference](https://www.mapbox.com/mapbox-gl-js/api/)
* [TRAVIC - Transit Visualization Client](https://tracker.geops.ch/)
