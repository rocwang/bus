import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm";
import initSqlJs from "sql.js";
// auckland.sqlite3.br will be decompressed by browser using brotli
import dbUrl from "./auckland.sqlite3.br";

async function loadDb(dbUrl) {
  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  const response = await fetch(dbUrl);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  return new SQL.Database(uint8Array);
}

const dbPromise = loadDb(dbUrl);

self.tileHandler = async ({ params }) => {
  const db = await dbPromise;
  const [z, x, y] = params;
  const flippedY = Math.pow(2, z) - 1 - y;

  const statement = db.prepare(
    "select * from tiles where zoom_level = :z and tile_column = :x and tile_row = :y;"
  );

  const row = statement.getAsObject({
    ":z": z,
    ":x": x,
    ":y": flippedY,
  });

  if (row.tile_data) {
    return new Response(row.tile_data, {
      headers: {
        "Content-type": "application/x-protobuf",
      },
    });
  } else {
    return new Response(null, {
      status: 204,
      statusText: "No Content",
    });
  }
};

self.fontHandler = async ({ params }) => {
  const db = await dbPromise;
  const [fontEncoded, range] = params;

  const font = decodeURIComponent(fontEncoded);
  const statement = db.prepare(
    "select data from fonts where font = :font and range = :range;"
  );

  const row = statement.getAsObject({
    ":font": font,
    ":range": range,
  });

  if (row.data) {
    return new Response(row.data, {
      headers: {
        "Content-type": "application/x-protobuf",
      },
    });
  } else {
    return new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
};
