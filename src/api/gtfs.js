export function queryGtfs(sql, bind) {
  const url = new URL(process.env.VUE_APP_GTFS_API);
  url.searchParams.set("sql", sql.trim());
  if (bind) {
    url.searchParams.set("bind", JSON.stringify(bind));
  }

  return fetch(url).then(response => response.json());
}

function getFormattedDate(date) {
  return `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${(
    "0" + date.getDate()
  ).slice(-2)}`;
}

function getDayOfWeek(date) {
  return date.toLocaleString("en-NZ", { weekday: "long" }).toLocaleLowerCase();
}

export function getTripsByStop(stopCode) {
  const now = new Date();
  const departureFrom = `${("0" + now.getHours()).slice(-2)}:00:00`;
  // Times like "25:00:00" is OK, see:
  // https://developers.google.com/transit/gtfs/reference/#stop_timestxt
  const departureTo = `${("0" + (now.getHours() + 2)).slice(-2)}:00:00`;
  const today = getFormattedDate(now);
  const dayOfWeek = getDayOfWeek(now);

  return queryGtfs(
    `
    SELECT trips.trip_id, trip_headsign, departure_time
    FROM trips
           INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
           INNER JOIN stops ON stops.stop_id = stop_times.stop_id
           INNER JOIN calendar ON trips.service_id = calendar.service_id
           LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
      AND date = :today
    WHERE stop_code = :stopCode
      AND start_date <= :today
      AND :today <= end_date
      AND (${dayOfWeek} = TRUE OR exception_type = 1)
      AND :departureFrom <= departure_time
      AND departure_time <= :departureTo;
    `,
    { stopCode, today, departureFrom, departureTo }
  );
}

export function getTripsByStopAndRoute(stopCode, routeShortName) {
  const now = new Date();
  const departureFrom = `${("0" + now.getHours()).slice(-2)}:00:00`;
  // Times like "25:00:00" is OK, see:
  // https://developers.google.com/transit/gtfs/reference/#stop_timestxt
  const today = getFormattedDate(now);
  const dayOfWeek = getDayOfWeek(now);

  return queryGtfs(
    `
    SELECT trips.trip_id, trip_headsign, departure_time
    FROM trips
           INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
           INNER JOIN stops ON stops.stop_id = stop_times.stop_id
           INNER JOIN routes ON trips.route_id = routes.route_id
           INNER JOIN calendar ON trips.service_id = calendar.service_id
           LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
      AND date = :today
    WHERE stop_code = :stopCode
      AND route_short_name = :routeShortName
      AND start_date <= :today
      AND :today <= end_date
      AND (${dayOfWeek} = TRUE OR exception_type = 1)
      AND departure_time >= :departureFrom
    ORDER BY departure_time ASC;
    `,
    { stopCode, routeShortName, departureFrom, today }
  );
}

export function getTripsByStopAndTrip(stopCode, tripId) {
  const now = new Date();
  // Times like "25:00:00" is OK, see:
  // https://developers.google.com/transit/gtfs/reference/#stop_timestxt
  const today = getFormattedDate(now);
  const dayOfWeek = getDayOfWeek(now);

  return queryGtfs(
    `
    SELECT trips.trip_id, trip_headsign, departure_time
    FROM trips
           INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
           INNER JOIN stops ON stops.stop_id = stop_times.stop_id
           INNER JOIN calendar ON trips.service_id = calendar.service_id
           LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
      AND date = :today
    WHERE stop_code = :stopCode
      AND trips.trip_id = :tripId
      AND start_date <= :today
      AND :today <= end_date
      AND (${dayOfWeek} = TRUE OR exception_type = 1)
    ORDER BY departure_time ASC;
    `,
    { tripId, stopCode, today }
  );
}

export function getRoutesByStop(stopCode) {
  const now = new Date();
  const today = getFormattedDate(now);
  const dayOfWeek = getDayOfWeek(now);

  return queryGtfs(
    `
    SELECT routes.route_id, route_short_name, stop_name
    FROM routes
           INNER JOIN trips ON trips.route_id = routes.route_id
           INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
           INNER JOIN stops ON stops.stop_id = stop_times.stop_id
           INNER JOIN calendar ON trips.service_id = calendar.service_id
           LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
      AND date = :today
    WHERE stop_code = :stopCode
      AND start_date <= :today
      AND :today <= end_date
      AND (${dayOfWeek} = TRUE OR exception_type = 1)
    ORDER BY route_long_name ASC;
    `,
    { stopCode, today }
  );
}

export function getRoutesByStopAndShortName(stopCode, routeShortName) {
  const now = new Date();
  const today = getFormattedDate(now);
  const dayOfWeek = getDayOfWeek(now);

  return queryGtfs(
    `
    SELECT routes.route_id, route_short_name, stop_name
    FROM routes
           INNER JOIN trips ON trips.route_id = routes.route_id
           INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
           INNER JOIN stops ON stops.stop_id = stop_times.stop_id
           INNER JOIN calendar ON trips.service_id = calendar.service_id
           LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
      AND date = :today
    WHERE stop_code = :stopCode
      AND route_short_name = :routeShortName
      AND start_date <= :today
      AND :today <= end_date
      AND (${dayOfWeek} = TRUE OR exception_type = 1)
    ORDER BY route_long_name ASC;
    `,
    { stopCode, routeShortName, today }
  );
}

export function getRoutesByStopAndTrip(stopCode, tripId) {
  const now = new Date();
  const today = getFormattedDate(now);
  const dayOfWeek = getDayOfWeek(now);

  return queryGtfs(
    `
    SELECT routes.route_id, route_short_name, stop_name
    FROM routes
           INNER JOIN trips ON trips.route_id = routes.route_id
           INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
           INNER JOIN stops ON stops.stop_id = stop_times.stop_id
           INNER JOIN calendar ON trips.service_id = calendar.service_id
           LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
      AND date = :today
    WHERE stop_code = :stopCode
      AND trips.trip_id = :tripId
      AND start_date <= :today
      AND :today <= end_date
      AND (${dayOfWeek} = TRUE OR exception_type = 1)
    ORDER BY route_long_name ASC;
    `,
    { stopCode, tripId, today }
  );
}
