#!/usr/bin/env bash

TODAY=$(env TZ=Pacific/Auckland date +%Y%m%d)

cat <<SQL
pragma foreign_keys = on;

delete from calendar where '$TODAY' < start_date or '$TODAY' > end_date;
SQL
