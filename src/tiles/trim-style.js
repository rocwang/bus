const style = require("./style.json");

style.layers = style.layers.filter((layer) => {
  const sourceLayer = layer["source-layer"];
  return (
    !sourceLayer ||
    [
      "place",
      "transportation",
      "transportation_name",
      "water",
      // "aeroway",
      // "boundary",
      // "building",
      // "housenumber",
      // "landcover",
      // "landuse",
      // "mountain_peak",
      // "park",
      // "poi",
      // "water_name",
      // "waterway",
    ].includes(sourceLayer)
  );
});

console.log(JSON.stringify(style));
