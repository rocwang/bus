const fs = require("fs");
const csv = require("csv");
const path = require("path");

const idMaps = {};

process.argv.slice(2).forEach(srcFile => {
  const targetFile = `${path.basename(srcFile, ".txt")}.csv`;

  fs.createReadStream(srcFile)
    .pipe(csv.parse({ columns: true }))
    .pipe(
      csv.transform(row => {
        const entries = Object.entries(row)
          .map(transformId)
          .map(transformTime);

        // Keep the original trip_id to query the GTFS realtime API
        if (srcFile === "trips.txt") {
          entries.push(["realtime_trip_id", row["trip_id"]]);
        }

        return Object.fromEntries(entries);
      })
    )
    .pipe(
      csv.stringify({
        header: true
      })
    )
    .pipe(fs.createWriteStream(targetFile))
    .on("close", () => console.log(targetFile))
    .on("error", e => console.error(e.message));
});

function transformId([key, value]) {
  if (/^(?:.*_id|parent_station)$/.test(key)) {
    let lookupKey = key;

    if (key === "parent_station") {
      lookupKey = "stop_id";
    }

    if (!idMaps[lookupKey]) {
      idMaps[lookupKey] = {};
    }

    if (!idMaps[lookupKey][value]) {
      idMaps[lookupKey][value] = Object.keys(idMaps[lookupKey]).length + 1;
    }

    return [key, idMaps[lookupKey][value]];
  } else {
    return [key, value];
  }
}

function transformTime([key, value]) {
  if (
    ["arrival_time", "departure_time", "start_time", "end_time"].includes(key)
  ) {
    if (key === "arrival_time") {
      return [key, null];
    }

    const components = value.split(":").map(c => Number(c));
    const integerTime =
      components[0] * 3600 + components[1] * 60 + components[2];

    return [key, value.replace(/^(\d\d):(\d\d):\d\d$/, "$1$2")];
  } else {
    return [key, value];
  }
}
