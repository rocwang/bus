const Database = require("better-sqlite3");
const { gunzip } = require("zlib");
const { promisify } = require("util");

const db = new Database("./auckland.min.sqlite3");
const loadGzipData = db.prepare("select * from tiles_full");
const replace = db.prepare(
  "replace into tiles values (:zoom_level, :tile_column, :tile_row, :tile_data)"
);
const doGunzip = promisify(gunzip);

for (const {
  zoom_level,
  tile_column,
  tile_row,
  tile_data,
} of loadGzipData.iterate()) {
  doGunzip(tile_data)
    .then((decodedData) => {
      replace.run({
        zoom_level,
        tile_column,
        tile_row,
        tile_data: decodedData,
      });
    })
    .catch((err) => {
      console.error("An error occurred:", err);
      process.exitCode = 1;
    });
}
