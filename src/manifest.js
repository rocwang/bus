const packageJson = require("../package");

module.exports = {
  name: "Bus",
  short_name: "Bus",
  description: packageJson.description,
  lang: "en",
  orientation: "portrait-primary",
  scope: "/",
  start_url: "/",
  display: "standalone",
  dir: "ltr",
  background_color: "#FFDB1B",
  theme_color: "#001120",
};
