export function queryGtfs(sql, bind) {
  const url = new URL(process.env.VUE_APP_GTFS_API);
  url.searchParams.set("sql", sql);
  if (bind) {
    url.searchParams.set("bind", JSON.stringify(bind));
  }

  return fetch(url).then(response => response.json());
}
