import config from "../config";

export function queryGtfs(sql, bind) {
  const url = new URL(config.gtfsAPI);
  url.searchParams.set("sql", sql);
  if (bind) {
    url.searchParams.set("bind", JSON.stringify(bind));
  }

  return fetch(url).then(response => response.json());
}
