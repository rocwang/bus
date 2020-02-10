import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm";
// gtfs.sqlite3.br will be decompressed by browser using brotli
import dbUrl from "../database/gtfs.sqlite3.br";

async function loadDb(dbUrl) {
  // TODO: Remove me when Safari >=13.2 is released
  // Safari < 13.2 has WASM bugs, works in 13.2 though.
  // See https://github.com/kripken/sql.js/issues/299
  const { default: initSqlJs } = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent
  )
    ? await import(/* webpackChunkName: "sql-asm" */ "sql.js/dist/sql-asm")
    : await import(/* webpackChunkName: "sql-wasm" */ "sql.js");

  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  const response = await fetch(dbUrl);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  return new SQL.Database(uint8Array);
}

const dbPromise = loadDb(dbUrl);

export default async function query(sql, bind) {
  const db = await dbPromise;
  const result = [];
  db.each(sql, bind, row => result.push(row));

  return result;
}
