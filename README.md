# Busbus

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
