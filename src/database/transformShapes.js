const fs = require("fs");
const csv = require("csv");
const path = require("path");
const polyline = require("@mapbox/polyline");

const shapes = {};

const parser = process.stdin.pipe(csv.parse({ columns: true }));

parser
  .on("readable", () => {
    let record;
    while ((record = parser.read())) {
      const {
        shape_id,
        shape_pt_sequence,
        shape_pt_lat,
        shape_pt_lon
      } = record;

      if (!shapes[shape_id]) {
        shapes[shape_id] = [];
      }

      shapes[shape_id][Number(shape_pt_sequence)] = [
        shape_pt_lat,
        shape_pt_lon
      ];
    }
  })
  .on("error", e => console.error(e.message))
  .on("end", () => {
    output(shapes);
  });

function output(shapes) {
  const outputArray = Object.entries(shapes).map(([shape_id, points]) => ({
    shape_id,
    shape_polyline: polyline.encode(points.filter(p => Boolean(p)))
  }));

  csv
    .stringify(outputArray, {
      header: true
    })
    .pipe(process.stdout)
    .on("error", e => console.error(e.message));
}
