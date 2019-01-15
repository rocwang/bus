const path = require("path");

module.exports = {
  name: "Bus",
  short_name: "Bus",
  icons: [
    {
      src: path.resolve("./src/", "./assets/icon.png"),
      sizes: [192, 512],
      destination: "img"
    }
  ],
  lang: "en",
  orientation: "portrait-primary",
  scope: "/",
  start_url: "/",
  display: "standalone",
  background_color: "#FFDB1B",
  theme_color: "#001120"
};
