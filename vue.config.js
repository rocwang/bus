const os = require("os");
const fs = require("fs");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const manifest = require("./src/manifest");

module.exports = {
  configureWebpack: {
    plugins: [
      new WebpackPwaManifest({
        ...manifest,
        filename: "manifest.[hash:8].webmanifest"
      })
    ]
  },
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = manifest.name;
      return args;
    });
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
