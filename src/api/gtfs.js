import format from "date-fns/format";
import startOfMinute from "date-fns/startOfMinute";
import query from "../database/database.worker";

function getDayOfWeek(date) {
  return date.toLocaleString("en-NZ", { weekday: "long" }).toLocaleLowerCase();
}

export async function getStopGeoJson() {
  const stops = await query(
    "SELECT DISTINCT stop_code, stop_lon, stop_lat FROM stops;"
  );

  return {
    type: "FeatureCollection",
    features: stops.map(stop => ({
      type: "Feature",
      properties: {
        stopCode: stop.stop_code
      },
      geometry: {
        type: "Point",
        coordinates: [stop.stop_lon, stop.stop_lat]
      }
    }))
  };
}

export async function getStopNameById(stopCode) {
  if (!stopCode) {
    return [{ stop_name: "" }];
  }

  const now = new Date();
  const today = format(now, "yyyyMMdd");

  return query(
    "SELECT stop_name FROM stops WHERE stop_code=:stopCode LIMIT 1",
    {
      ":stopCode": stopCode,
      ":today": today
    }
  );
}

export async function getTripsByStop(stopCode) {
  if (!stopCode) {
    return [];
  }

  const now = startOfMinute(new Date());
  const departureFrom = format(now, "HH:mm:ss");
  // 1 hours later. Times like "25:00:00" is OK, see:
  // https://developers.google.com/transit/gtfs/reference/#stop_timestxt
  const departureTo = `${("0" + (now.getHours() + 1)).slice(
    -2
  )}:${now.getMinutes()}:00`;
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  return query(
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
    {
      ":stopCode": stopCode,
      ":today": today,
      ":departureFrom": departureFrom,
      ":departureTo": departureTo
    }
  );
}

export async function getNexTripsByStopRouteItems(stopRouteItems) {
  if (!stopRouteItems || stopRouteItems.length === 0) {
    return [];
  }

  const now = new Date();
  const departureFrom = format(startOfMinute(now), "HH:mm:ss");
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  const bindPlaceholders = stopRouteItems
    .map(
      (item, index) =>
        `(stop_code = :stopCode${index} AND route_short_name = :routeShortName${index})`
    )
    .join(" OR ");
  const bindValues = stopRouteItems.reduce(
    (values, item, index) =>
      Object.assign(values, {
        [`:stopCode${index}`]: item.stopCode,
        [`:routeShortName${index}`]: item.routeShortName
      }),
    {}
  );

  // TODO: add stop_code, route_short_name to other query results for trips as well?
  return query(
    `
      SELECT trips.trip_id, trip_headsign, min(departure_time) AS departure_time, stop_code, route_short_name
      FROM trips
             INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
             INNER JOIN stops ON stops.stop_id = stop_times.stop_id
             INNER JOIN routes ON trips.route_id = routes.route_id
             INNER JOIN calendar ON trips.service_id = calendar.service_id
             LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
        AND date = :today
      WHERE start_date <= :today
        AND :today <= end_date
        AND (${dayOfWeek} = TRUE OR exception_type = 1)
        AND departure_time >= :departureFrom
        AND (${bindPlaceholders})
      GROUP BY stop_code, route_short_name;
    `,
    { ":departureFrom": departureFrom, ":today": today, ...bindValues }
  );
}

export async function getTripsByStopAndRoute(stopCode, routeShortName) {
  if (!stopCode || !routeShortName) {
    return [];
  }

  const now = new Date();
  const departureFrom = format(startOfMinute(now), "HH:mm:ss");
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  return query(
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
    ORDER BY departure_time;
    `,
    {
      ":stopCode": stopCode,
      ":routeShortName": routeShortName,
      ":departureFrom": departureFrom,
      ":today": today
    }
  );
}

export async function getTripsByStopAndTrip(stopCode, tripId) {
  if (!stopCode || !tripId) {
    return [];
  }

  const now = new Date();
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  return query(
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
    ORDER BY departure_time;
    `,
    { ":tripId": tripId, ":stopCode": stopCode, ":today": today }
  );
}

export async function getRoutesByStopRouteItems(stopRouteItems) {
  if (!stopRouteItems || stopRouteItems.length === 0) {
    return [];
  }

  const now = new Date();
  const departureFrom = format(startOfMinute(now), "HH:mm:ss");
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  const bindPlaceholders = stopRouteItems
    .map(
      (item, index) =>
        `(stop_code = :stopCode${index} AND route_short_name = :routeShortName${index})`
    )
    .join(" OR ");
  const bindValues = stopRouteItems.reduce(
    (values, item, index) =>
      Object.assign(values, {
        [`:stopCode${index}`]: item.stopCode,
        [`:routeShortName${index}`]: item.routeShortName
      }),
    {}
  );

  return query(
    `
      SELECT routes.route_id, route_short_name
      FROM routes
             INNER JOIN trips ON trips.route_id = routes.route_id
             INNER JOIN stop_times ON stop_times.trip_id = trips.trip_id
             INNER JOIN stops ON stops.stop_id = stop_times.stop_id
             INNER JOIN calendar ON trips.service_id = calendar.service_id
             LEFT JOIN calendar_dates ON calendar.service_id = calendar_dates.service_id
        AND date = :today
      WHERE start_date <= :today
        AND :today <= end_date
        AND (${dayOfWeek} = TRUE OR exception_type = 1)
        AND departure_time >= :departureFrom
        AND (${bindPlaceholders})
      GROUP BY stop_code, route_short_name;
    `,
    { ":departureFrom": departureFrom, ":today": today, ...bindValues }
  );
}

export async function getRoutesByStop(stopCode) {
  if (!stopCode) {
    return [];
  }

  const now = new Date();
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  return query(
    `
    SELECT routes.route_id, route_short_name
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
    ORDER BY route_short_name;
    `,
    { ":stopCode": stopCode, ":today": today }
  );
}

export async function getRoutesByStopAndShortName(stopCode, routeShortName) {
  if (!stopCode || !routeShortName) {
    return [];
  }

  const now = new Date();
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  return query(
    `
    SELECT routes.route_id, route_short_name
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
    ORDER BY route_short_name;
    `,
    {
      ":stopCode": stopCode,
      ":routeShortName": routeShortName,
      ":today": today
    }
  );
}

export async function getRoutesByStopAndTrip(stopCode, tripId) {
  if (!stopCode || !tripId) {
    return [];
  }

  const now = new Date();
  const today = format(now, "yyyyMMdd");
  const dayOfWeek = getDayOfWeek(now);

  return query(
    `
    SELECT routes.route_id, route_short_name
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
    ORDER BY route_short_name;
    `,
    { ":stopCode": stopCode, ":tripId": tripId, ":today": today }
  );
}

export async function getShapeByTrip(tripId) {
  return query(
    `
      SELECT shape_pt_lat, shape_pt_lon
      FROM shapes
             INNER JOIN trips ON trips.shape_id = shapes.shape_id
      WHERE trip_id = :tripId
      ORDER BY shape_pt_sequence;
    `,
    { ":tripId": tripId }
  );
}
