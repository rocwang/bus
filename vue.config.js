const os = require("os");
const fs = require("fs");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const manifest = require("./src/manifest");
const workboxWebpackPlugin = require("workbox-webpack-plugin");
const packageJson = require("./package");

module.exports = {
  configureWebpack: {
    plugins: [
      // generate web app manifest
      new WebpackPwaManifest({
        ...manifest,
        filename: "manifest.[hash:8].webmanifest"
      }),
      // generate favicons
      new FaviconsWebpackPlugin({
        logo: "./src/assets/icon.png",
        prefix: "img/[hash:8]-",
        persistentCache: false,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          favicons: true,
          firefox: false
        }
      })
    ]
  },
  chainWebpack: config => {
    // set the HTML title tag
    config.plugin("html").tap(args => {
      args[0].title = manifest.name;
      return args;
    });

    // generate /service-worker.js in production mode
    if (
      process.env.NODE_ENV === "production" &&
      process.env.VUE_CLI_MODERN_BUILD
    ) {
      config.plugin("workbox").use(workboxWebpackPlugin.GenerateSW, [
        {
          exclude: [/\.map$/, /^iconstats/],
          cacheId: packageJson.name
        }
      ]);
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
  }
};
