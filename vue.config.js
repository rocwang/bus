const os = require("os");
const fs = require("fs");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const manifest = require("./src/manifest");

module.exports = {
  configureWebpack: {
    plugins: [
      new WebpackPwaManifest({
        ...manifest,
        filename: "manifest.[hash:8].webmanifest"
      }),
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
    config.plugin("html").tap(args => {
      args[0].title = manifest.name;
      return args;
    });

    // Disable the manifest generation from  @vue/cli-plugin-pwa, just use the workbox part
    config.plugins.delete("pwa");
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
