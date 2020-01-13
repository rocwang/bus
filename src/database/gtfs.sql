PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS agency;
CREATE TABLE agency
(
  agency_id       TEXT NULL,
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
  stop_id             TEXT    NOT NULL PRIMARY KEY,
  stop_code           TEXT    NULL,
  stop_name           TEXT    NOT NULL,
  stop_desc           TEXT    NULL,
  stop_lat            DOUBLE  NOT NULL,
  stop_lon            DOUBLE  NOT NULL,
  zone_id             TEXT    NULL,
  stop_url            TEXT    NULL,
  location_type       INTEGER NULL,
  parent_station      TEXT    NULL,
  stop_timezone       TEXT    NULL,
  wheelchair_boarding INTEGER NULL
);
CREATE INDEX index__stops__stop_code ON stops (stop_code);

DROP TABLE IF EXISTS routes;
CREATE TABLE routes
(
  route_id         TEXT    NOT NULL PRIMARY KEY,
  agency_id        TEXT    NULL,
  route_short_name TEXT    NULL,
  route_long_name  TEXT    NULL,
  route_desc       TEXT    NULL,
  route_type       INTEGER NOT NULL,
  route_url        TEXT    NULL,
  route_color      CHAR(6) NULL,
  route_text_color CHAR(6) NULL,

  FOREIGN KEY (agency_id) REFERENCES agency (agency_id) ON DELETE CASCADE
);
CREATE INDEX index__routes__route_short_name ON routes (route_short_name);
CREATE INDEX index__routes__agency_id ON routes (agency_id);

DROP TABLE IF EXISTS calendar;
CREATE TABLE calendar
(
  service_id TEXT    NOT NULL PRIMARY KEY,
  monday     BOOLEAN NOT NULL,
  tuesday    BOOLEAN NOT NULL,
  wednesday  BOOLEAN NOT NULL,
  thursday   BOOLEAN NOT NULL,
  friday     BOOLEAN NOT NULL,
  saturday   BOOLEAN NOT NULL,
  sunday     BOOLEAN NOT NULL,
  start_date DATE    NOT NULL,
  end_date   DATE    NOT NULL
);
CREATE INDEX index__calendar__monday ON calendar (monday);
CREATE INDEX index__calendar__tuesday ON calendar (tuesday);
CREATE INDEX index__calendar__wednesday ON calendar (wednesday);
CREATE INDEX index__calendar__thursday ON calendar (thursday);
CREATE INDEX index__calendar__friday ON calendar (friday);
CREATE INDEX index__calendar__saturday ON calendar (saturday);
CREATE INDEX index__calendar__sunday ON calendar (sunday);
CREATE INDEX index__calendar__start_date ON calendar (start_date);
CREATE INDEX index__calendar__end_date ON calendar (end_date);

DROP TABLE IF EXISTS calendar_dates;
CREATE TABLE calendar_dates
(
  service_id     TEXT    NOT NULL,
  `date`         DATE    NOT NULL,
  exception_type INTEGER NOT NULL,

  FOREIGN KEY (service_id) REFERENCES calendar (service_id) ON DELETE CASCADE
);
CREATE INDEX index__calendar_dates__service_id ON calendar_dates (service_id);
CREATE INDEX index__calendar_dates__date ON calendar_dates (date);
CREATE INDEX index__calendar_dates__exception_type ON calendar_dates (exception_type);

DROP TABLE IF EXISTS shapes;
CREATE TABLE shapes
(
  shape_id            TEXT    NOT NULL,
  shape_pt_lat        DOUBLE  NOT NULL,
  shape_pt_lon        DOUBLE  NOT NULL,
  shape_pt_sequence   INTEGER NOT NULL,
  shape_dist_traveled DOUBLE  NULL,

  PRIMARY KEY (shape_id, shape_pt_sequence)
);

DROP TABLE IF EXISTS trips;
CREATE TABLE trips
(
  route_id              TEXT    NOT NULL,
  service_id            TEXT    NOT NULL,
  trip_id               TEXT    NOT NULL PRIMARY KEY,
  trip_headsign         TEXT    NULL,
  trip_short_name       TEXT    NULL,
  direction_id          INTEGER NULL,
  block_id              TEXT    NULL,
  shape_id              TEXT    NULL,
  wheelchair_accessible INTEGER NULL,

  FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES calendar (service_id) ON DELETE CASCADE
--   FOREIGN KEY (shape_id) REFERENCES shapes (shape_id) ON DELETE CASCADE
);
CREATE INDEX index__trips_dates__route_id ON trips (route_id);
CREATE INDEX index__trips_dates__service_id ON trips (service_id);
CREATE INDEX index__trips_dates__shape_id ON trips (shape_id);

DROP TABLE IF EXISTS stop_times;
CREATE TABLE stop_times
(
  trip_id             TEXT    NOT NULL,
  arrival_time        TIME    NOT NULL,
  departure_time      TIME    NOT NULL,
  stop_id             TEXT    NOT NULL,
  stop_sequence       INTEGER NOT NULL,
  stop_headsign       TEXT    NULL,
  pickup_type         INTEGER NULL,
  drop_off_type       INTEGER NULL,
  shape_dist_traveled DOUBLE  NULL,

  PRIMARY KEY (trip_id, stop_sequence),

  FOREIGN KEY (trip_id) REFERENCES trips (trip_id) ON DELETE CASCADE,
  FOREIGN KEY (stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE
);
CREATE INDEX index__stop_times__trip_id ON stop_times (trip_id);
CREATE INDEX index__stop_times__stop_id ON stop_times (stop_id);
CREATE INDEX index__stop_times__arrival_time ON stop_times (arrival_time);
CREATE INDEX index__stop_times__departure_time ON stop_times (departure_time);

DROP TABLE IF EXISTS fare_attributes;
CREATE TABLE fare_attributes
(
  fare_id           TEXT          NOT NULL PRIMARY KEY,
  price             DECIMAL(3, 2) NOT NULL,
  currency_type     TEXT          NOT NULL,
  payment_method    INTEGER       NOT NULL,
  transfers         INTEGER       NULL,
  transfer_duration INTEGER       NULL
);

DROP TABLE IF EXISTS fare_rules;
CREATE TABLE fare_rules
(
  fare_id        TEXT NOT NULL,
  route_id       TEXT NULL,
  origin_id      TEXT NULL,
  destination_id TEXT NULL,
  contains_id    TEXT NULL,

  FOREIGN KEY (fare_id) REFERENCES fare_attributes (fare_id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE
);
CREATE INDEX index__fare_rules__fare_id ON fare_rules (fare_id);
CREATE INDEX index__fare_rules__route_id ON fare_rules (route_id);

DROP TABLE IF EXISTS frequencies;
CREATE TABLE frequencies
(
  trip_id      TEXT    NOT NULL,
  start_time   INT     NOT NULL,
  end_time     INT     NOT NULL,
  headway_secs INTEGER NOT NULL,
  exact_times  BOOLEAN NULL,

  FOREIGN KEY (trip_id) REFERENCES trips (trip_id) ON DELETE CASCADE
);
CREATE INDEX index__frequencies_trip_id ON trips (trip_id);

DROP TABLE IF EXISTS transfers;
CREATE TABLE transfers
(
  from_stop_id      TEXT    NOT NULL,
  to_stop_id        TEXT    NOT NULL,
  transfer_type     INTEGER NOT NULL,
  min_transfer_time INTEGER NULL,

  FOREIGN KEY (from_stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE,
  FOREIGN KEY (to_stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE
);
CREATE INDEX index__transfers_dates__from_stop_id ON transfers (from_stop_id);
CREATE INDEX index__transfers_dates__to_stop_id ON transfers (to_stop_id);

DROP TABLE IF EXISTS feed_info;
CREATE TABLE feed_info
(
  feed_publisher_name TEXT NOT NULL,
  feed_publisher_url  TEXT NOT NULL,
  feed_lang           TEXT NOT NULL,
  feed_start_date     DATE NULL,
  feed_end_date       DATE NULL,
  feed_version        TEXT NULL
);

DROP TABLE IF EXISTS stop_patterns;
CREATE TABLE stop_patterns
(
  pattern_id             INT    NOT NULL,
  pattern_sequence       INT    NOT NULL,
  stop_id                TEXT   NOT NULL,
  arrival_time_offset    INT    NOT NULL,
  departure_time_offset  INT    NOT NULL,
  stop_headsign          TEXT   NULL,
  pickup_type            INT    NULL,
  drop_off_type          INT    NULL,
  shape_dist_traveled    DOUBLE NULL,
  original_stop_sequence INT    NOT NULL,

  PRIMARY KEY (pattern_id, pattern_sequence),
  FOREIGN KEY (stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE
);
CREATE INDEX index__stop_patterns_stop_id ON stop_patterns (stop_id);

DROP TABLE IF EXISTS trips_to_patterns;
CREATE TABLE trips_to_patterns
(
  trip_id         TEXT PRIMARY KEY NOT NULL,
  pattern_id      INT              NOT NULL,
  scheduled_start INT              NULL,

  FOREIGN KEY (trip_id) REFERENCES trips (trip_id) ON DELETE CASCADE
);
CREATE INDEX index__trips_to_patterns_trip_id ON trips_to_patterns (trip_id);

DROP TABLE IF EXISTS stop_info;
CREATE TABLE stop_info
(
  main_stop BOOLEAN             NOT NULL,
  stop_id   VARCHAR PRIMARY KEY NOT NULL,

  FOREIGN KEY (stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE
);
CREATE INDEX index__stop_info__stop_id ON stop_info (stop_id);
