drop table if exists agency;
create table agency
(
    agency_id       INTEGER primary key,
    agency_name     TEXT not null,
    agency_url      TEXT not null,
    agency_timezone TEXT not null,
    agency_lang     TEXT null,
    agency_phone    TEXT null,
    agency_fare_url TEXT null,
    agency_email    TEXT null
);

drop table if exists stops;
create table stops
(
    stop_id             INTEGER primary key,
    stop_code           TEXT    null,
    stop_name           TEXT    not null,
    stop_desc           TEXT    null,
    stop_lat            REAL    not null,
    stop_lon            REAL    not null,
    zone_id             INTEGER null,
    stop_url            TEXT    null,
    location_type       INTEGER null,
    parent_station      INTEGER null,
    stop_timezone       TEXT    null,
    wheelchair_boarding INTEGER null
);

drop table if exists routes;
create table routes
(
    route_id         INTEGER primary key,
    agency_id        INTEGER null,
    route_short_name TEXT    null,
    route_long_name  TEXT    null,
    route_desc       TEXT    null,
    route_type       INTEGER not null,
    route_url        TEXT    null,
    route_color      CHAR(6) null,
    route_text_color CHAR(6) null,

    foreign key (agency_id) references agency (agency_id) on delete cascade
);

drop table if exists calendar;
create table calendar
(
    service_id INTEGER primary key,
    monday     BOOLEAN not null,
    tuesday    BOOLEAN not null,
    wednesday  BOOLEAN not null,
    thursday   BOOLEAN not null,
    friday     BOOLEAN not null,
    saturday   BOOLEAN not null,
    sunday     BOOLEAN not null,
    start_date TEXT    not null,
    end_date   TEXT    not null
);

drop table if exists calendar_dates;
create table calendar_dates
(
    service_id     INTEGER not null,
    `date`         INTEGER not null,
    exception_type INTEGER not null,

    primary key (service_id, date),
    foreign key (service_id) references calendar (service_id) on delete cascade
) without rowid;

drop table if exists shapes;
create table shapes
(
    shape_id       INTEGER primary key,
    shape_polyline TEXT not null
);

drop table if exists trips;
create table trips
(
    trip_id               INTEGER primary key,
    route_id              INTEGER not null,
    service_id            INTEGER not null,
    trip_headsign         TEXT    null,
    trip_short_name       TEXT    null,
    direction_id          INTEGER null,
    block_id              INTEGER null,
    shape_id              INTEGER null,
    wheelchair_accessible INTEGER null,
    realtime_trip_id      TEXT    not null,

    foreign key (route_id) references routes (route_id) on delete cascade,
    foreign key (service_id) references calendar (service_id) on delete cascade,
    foreign key (shape_id) references shapes (shape_id) on delete cascade
);

drop table if exists stop_times;
create table stop_times
(
    trip_id             INTEGER not null,
    arrival_time        TEXT    null,
    departure_time      TEXT    not null,
    stop_id             INTEGER not null,
    stop_sequence       INTEGER not null,
    stop_headsign       TEXT    null,
    pickup_type         INTEGER null,
    drop_off_type       INTEGER null,
    shape_dist_traveled REAL    null,

    primary key (trip_id, stop_sequence),
    foreign key (trip_id) references trips (trip_id) on delete cascade,
    foreign key (stop_id) references stops (stop_id) on delete cascade
) without rowid;

/*
drop table if exists frequencies;
create table frequencies
(
    trip_id      INTEGER not null,
    start_time   TEXT    not null,
    end_time     TEXT    not null,
    headway_secs INTEGER not null,
    exact_times  BOOLEAN null,

    foreign key (trip_id) references trips (trip_id) on delete cascade
);
*/
