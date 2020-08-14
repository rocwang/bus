const readline = require("readline");
const Database = require("better-sqlite3");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
const db = new Database(process.argv[2]);
const replace = db.prepare("replace into fonts values (:font, :range, :data)");

rl.on("line", (path) => {
  console.log(path);
  const matches = path.match(/\/([\w ]+)\/(\d+-\d+)\.pbf$/);
  if (matches) {
    const font = matches[1];
    const range = matches[2];
    const data = fs.readFileSync(path);

    replace.run({ font, range, data });
  }
});
