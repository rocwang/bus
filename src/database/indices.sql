create index index__calendar__end_date on calendar (end_date);
create index index__calendar__friday on calendar (friday);
create index index__calendar__monday on calendar (monday);
create index index__calendar__saturday on calendar (saturday);
create index index__calendar__start_date on calendar (start_date);
create index index__calendar__sunday on calendar (sunday);
create index index__calendar__thursday on calendar (thursday);
create index index__calendar__tuesday on calendar (tuesday);
create index index__calendar__wednesday on calendar (wednesday);
create index index__calendar_dates__date on calendar_dates (date);
create index index__calendar_dates__exception_type on calendar_dates (exception_type);
create index index__calendar_dates__service_id on calendar_dates (service_id);
create index index__frequencies_trip_id on trips (trip_id);
create index index__routes__agency_id on routes (agency_id);
create index index__routes__route_short_name on routes (route_short_name);
create index index__stop_times__departure_time on stop_times (departure_time);
create index index__stop_times__stop_id on stop_times (stop_id);
create index index__stop_times__trip_id on stop_times (trip_id);
create index index__stops__stop_code on stops (stop_code);
create index index__trips__route_id on trips (route_id);
create index index__trips__service_id on trips (service_id);
create index index__trips__shape_id on trips (shape_id);
