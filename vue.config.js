const os = require("os");
const fs = require("fs");
const manifest = require("./src/manifest");
const packageJson = require("./package");
const WebappWebpackPlugin = require("webapp-webpack-plugin");

module.exports = {
  configureWebpack: {
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
              yandex: false
            }
          },
          manifest
        )
      })
    ],
    // Turn off various NodeJS environment polyfills Webpack adds to bundles.
    // They're supposed to be added only when used, but the heuristic is loose
    // (eg: existence of a variable called setImmedaite in any scope)
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
      setImmediate: false
    }
  },
  chainWebpack: config => {
    // set the HTML title tag
    config.plugin("html").tap(args => {
      args[0].title = manifest.name;
      args[0].meta = {
        description: packageJson.description
      };
      return args;
    });

    // disable the manifest generation from  @vue/cli-plugin-pwa, just use the workbox part
    config.plugins.delete("pwa");

    // disable workbox in legacy build, so we only get 1 precache manifest
    if (
      process.env.NODE_ENV === "production" &&
      process.env.VUE_CLI_MODERN_MODE &&
      !process.env.VUE_CLI_MODERN_BUILD
    ) {
      config.plugins.delete("workbox");
    }
  },
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    https:
      process.env.NODE_ENV === "development"
        ? {
            key: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.key"),
            cert: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.crt")
          }
        : false
  },
  pwa: {
    workboxOptions: {
      exclude: [/\.map$/, /manifest\.json$/, /^iconstats/]
    }
  }
};
