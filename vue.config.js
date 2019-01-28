const os = require("os");
const fs = require("fs");
const manifest = require("./src/manifest");
const workboxWebpackPlugin = require("workbox-webpack-plugin");
const packageJson = require("./package");
const WebappWebpackPlugin = require("webapp-webpack-plugin");

module.exports = {
  configureWebpack: {
    plugins: [
      new WebappWebpackPlugin({
        logo: "./src/assets/icon.png",
        prefix: "favicons-[hash:8]",
        inject: htmlPlugin => {
          console.log(htmlPlugin);
          return true;
        },
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
          exclude: [/\.map$/, /manifest\.json$/, /^iconstats/],
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
