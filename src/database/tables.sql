-- gsed -E -i 's/([0-9]{2}):([0-9]{2}):([0-9]{2})/\1\2\3/g' stop_times.txt

DROP TABLE IF EXISTS agency;
CREATE TABLE agency
(
    agency_id       INTEGER PRIMARY KEY,
    agency_name     TEXT NOT NULL,
    agency_url      TEXT NOT NULL,
    agency_timezone TEXT NOT NULL,
    agency_lang     TEXT NULL,
    agency_phone    TEXT NULL,
    agency_fare_url TEXT NULL,
    agency_email    TEXT NULL
);

DROP TABLE IF EXISTS stops;
CREATE TABLE stops
(
    stop_id             INTEGER PRIMARY KEY,
    stop_code           TEXT    NULL,
    stop_name           TEXT    NOT NULL,
    stop_desc           TEXT    NULL,
    stop_lat            REAL    NOT NULL,
    stop_lon            REAL    NOT NULL,
    zone_id             INTEGER NULL,
    stop_url            TEXT    NULL,
    location_type       INTEGER NULL,
    parent_station      INTEGER NULL,
    stop_timezone       TEXT    NULL,
    wheelchair_boarding INTEGER NULL
);

DROP TABLE IF EXISTS routes;
CREATE TABLE routes
(
    route_id         INTEGER PRIMARY KEY,
    agency_id        INTEGER NULL,
    route_short_name TEXT    NULL,
    route_long_name  TEXT    NULL,
    route_desc       TEXT    NULL,
    route_type       INTEGER NOT NULL,
    route_url        TEXT    NULL,
    route_color      CHAR(6) NULL,
    route_text_color CHAR(6) NULL

    -- FOREIGN KEY (agency_id) REFERENCES agency (agency_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS calendar;
CREATE TABLE calendar
(
    service_id INTEGER PRIMARY KEY,
    monday     BOOLEAN NOT NULL,
    tuesday    BOOLEAN NOT NULL,
    wednesday  BOOLEAN NOT NULL,
    thursday   BOOLEAN NOT NULL,
    friday     BOOLEAN NOT NULL,
    saturday   BOOLEAN NOT NULL,
    sunday     BOOLEAN NOT NULL,
    start_date TEXT    NOT NULL,
    end_date   TEXT    NOT NULL
);

DROP TABLE IF EXISTS calendar_dates;
CREATE TABLE calendar_dates
(
    service_id     INTEGER NOT NULL,
    `date`         INTEGER NOT NULL,
    exception_type INTEGER NOT NULL,

    PRIMARY KEY (service_id, date)
    -- FOREIGN KEY (service_id) REFERENCES calendar (service_id) ON DELETE CASCADE
) WITHOUT ROWID;

DROP TABLE IF EXISTS shapes;
CREATE TABLE shapes
(
    shape_id       INTEGER PRIMARY KEY,
    shape_polyline TEXT NOT NULL
);

DROP TABLE IF EXISTS trips;
CREATE TABLE trips
(
    trip_id               INTEGER PRIMARY KEY,
    route_id              INTEGER NOT NULL,
    service_id            INTEGER NOT NULL,
    trip_headsign         TEXT    NULL,
    trip_short_name       TEXT    NULL,
    direction_id          INTEGER NULL,
    block_id              INTEGER NULL,
    shape_id              INTEGER NULL,
    wheelchair_accessible INTEGER NULL,
    realtime_trip_id      TEXT    NOT NULL

    -- FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
    -- FOREIGN KEY (service_id) REFERENCES calendar (service_id) ON DELETE CASCADE,
    -- FOREIGN KEY (shape_id) REFERENCES shapes (shape_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS stop_times;
CREATE TABLE stop_times
(
    trip_id             INTEGER NOT NULL,
    arrival_time        TEXT    NULL,
    departure_time      TEXT    NOT NULL,
    stop_id             INTEGER NOT NULL,
    stop_sequence       INTEGER NOT NULL,
    stop_headsign       TEXT    NULL,
    pickup_type         INTEGER NULL,
    drop_off_type       INTEGER NULL,
    shape_dist_traveled REAL    NULL,

    PRIMARY KEY (trip_id, stop_sequence)

    -- FOREIGN KEY (trip_id) REFERENCES trips (trip_id) ON DELETE CASCADE,
    -- FOREIGN KEY (stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE
) WITHOUT ROWID;

DROP TABLE IF EXISTS frequencies;
CREATE TABLE frequencies
(
    trip_id      INTEGER NOT NULL,
    start_time   TEXT    NOT NULL,
    end_time     TEXT    NOT NULL,
    headway_secs INTEGER NOT NULL,
    exact_times  BOOLEAN NULL

    -- FOREIGN KEY (trip_id) REFERENCES trips (trip_id) ON DELETE CASCADE
);
