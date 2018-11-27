const os = require("os");
const fs = require("fs");

module.exports = {
  productionSourceMap: false,
  devServer: {
    host: "localhost",
    https: {
      key: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.key"),
      cert: fs.readFileSync(os.homedir() + "/.localhost_ssl/server.crt")
    }
  }
};
