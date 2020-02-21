const fs = require("fs");
const csv = require("csv");
const path = require("path");
const moment = require("moment-timezone");

const idMaps = {};

process.argv.slice(2).forEach(srcFile => {
  const targetFile = `${path.basename(srcFile, ".txt")}.csv`;

  fs.createReadStream(srcFile)
    .pipe(csv.parse({ columns: true }))
    .pipe(
      csv.transform(row =>
        Object.fromEntries(
          Object.entries(row)
            .map(transformId)
            .map(transformDate)
            .map(transformTime)
        )
      )
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

function transformDate([key, value]) {
  if (
    [
      "start_time",
      "end_date",
      "feed_start_date",
      "feed_end_date",
      "date"
    ].includes(key)
  ) {
    const unixEpoch = moment
      .tz(
        value.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3 00:00:00"),
        "Pacific/Auckland"
      )
      .unix();
    return [key, unixEpoch];
  } else {
    return [key, value];
  }
}

function transformTime([key, value]) {
  if (
    ["arrival_time", "departure_time", "start_time", "end_time"].includes(key)
  ) {
    const components = value.split(":").map(c => Number(c));
    const integerTime =
      components[0] * 3600 + components[1] * 60 + components[2];

    return [key, integerTime];
  } else {
    return [key, value];
  }
}
