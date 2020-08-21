const os = require("os");
const fs = require("fs");
const manifest = require("./src/manifest");
const packageJson = require("./package");
const WebappWebpackPlugin = require("webapp-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
  configureWebpack: {
    entry: {
      "pbf-handler": "./src/tiles/pbf-handler.js",
    },
    output: {
      globalObject: "self",
    },
    plugins: [
      new WebappWebpackPlugin({
        logo: "./src/assets/icon.png",
        prefix: "favicons-[hash:8]",
        favicons: Object.assign(
          {
            appName: manifest.name,
            appShortName: manifest.short_name,
            appDescription: manifest.description,
            background: manifest.background_color,
            icons: {
              android: true,
              appleIcon: false,
              appleStartup: false,
              coast: false,
              favicons: true,
              firefox: false,
              windows: false,
              yandex: false,
            },
          },
          manifest
        ),
      }),
    ],
    // Turn off various NodeJS environment polyfills Webpack adds to bundles.
    // They're supposed to be added only when used, but the heuristic is loose
    // (eg: existence of a variable called setImmediate in any scope)
    node: {
      console: false,
      // Keep global, it's just an alias of window and used by many third party modules:
      global: true,
      // Turn off process to avoid bundling a nextTick implementation:
      process: false,
      // Inline __filename and __dirname values:
      __filename: "mock",
      __dirname: "mock",
      // Never embed a portable implementation of Node's Buffer module:
      Buffer: false,
      // Never embed a setImmediate implementation:
      setImmediate: false,
    },
  },
  chainWebpack: (webpackConfig) => {
    // Set the HTML meta tags
    webpackConfig.plugin("html").tap((args) => {
      const [options] = args;
      Object.assign(options, {
        title: manifest.name,
        meta: {
          description: packageJson.description,
        },
        author: packageJson.author,
        excludeChunks: ["pbf-handler"],
      });

      return args;
    });

    webpackConfig.plugin("workbox").use(WorkboxPlugin.GenerateSW, [
      {
        cacheId: packageJson.name,
        cleanupOutdatedCaches: true,
        exclude: [/\.map$/, /robots\.txt$/, /\.pbf$/],
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 52_428_800, // 10 MiB
        importScriptsViaChunks: ["chunk-vendors", "pbf-handler"],
        runtimeCaching: [
          {
            urlPattern: new RegExp("/map/tiles/(\\d+)/(\\d+)/(\\d+)\\.pbf"),
            handler: (context) => tileHandler(context),
          },
          {
            urlPattern: new RegExp("/map/fonts/([^/]+)/(\\d+-\\d+)\\.pbf"),
            handler: (context) => fontHandler(context),
          },
        ],
        // Add the shared "chunk-vendors" chunk back to the pre-cache list
        manifestTransforms: [
          (manifest, compilation) => {
            const chunkVendors = compilation.chunks.find(
              (chunk) => chunk.id === "chunk-vendors"
            );

            manifest.push({
              url: `${compilation.outputOptions.publicPath}${chunkVendors.files[0]}`,
              revision: chunkVendors.hash,
            });
            return { manifest, warnings: [] };
          },
        ],
      },
    ]);

    webpackConfig.plugin("preload").tap((args) => {
      const [option] = args;
      option.fileBlacklist = option.fileBlacklist || [];
      option.fileBlacklist.push(/pbf-handler/);

      return args;
    });

    // Load the wasm file required by sql.js without the default webpack
    // importing behaviors
    webpackConfig.module
      .rule("wasm")
      .test(/\.wasm$/)
      .type("javascript/auto")
      .use("file-loader")
      .loader("file-loader")
      .tap((options) => ({
        ...options,
        name: "wasm/[name].[hash:8].[ext]",
      }))
      .end();

    // Load the sqlite database file
    webpackConfig.module
      .rule("database")
      .test(/\.br$/)
      .use("file-loader")
      .loader("file-loader")
      .tap((options) => ({
        ...options,
        name: "database/[name].[hash:8].[ext]",
      }))
      .end();

    // Configure comlink-loader to bundle web workers
    webpackConfig.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("comlink-loader")
      .loader("comlink-loader")
      .tap((options) => ({
        ...options,
        name: "[name].[hash:8].[ext]",
        singleton: true,
      }))
      .end();
  },
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    port: "4430",
    before(app) {
      app.get("/database/*.br", (req, res, next) => {
        res.set("Content-Encoding", "br");
        res.set("Content-Type", "application/x-sqlite3");
        next();
      });

      app.get("/map/tiles/*.pbf", (req, res, next) => {
        res.set("Content-Encoding", "gzip");
        res.set("Content-type", "application/x-protobuf");
        next();
      });
    },
    https:
      process.env.NODE_ENV === "development"
        ? {
            key: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.key"),
            cert: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.crt"),
          }
        : false,
  },
};
