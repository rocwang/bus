DOWNLOAD_URL="https://cdn01.at.govt.nz/data/gtfs.zip"
TXT=agency.txt calendar.txt calendar_dates.txt frequencies.txt routes.txt shapes.txt stop_times.txt stops.txt trips.txt

.PHONY: clean

gtfs.sqlite3.br: gtfs.sqlite3
	brotli --quality=11 --force --output=$@ $^

gtfs.sqlite3: tables.sql indices.sql $(TXT)
	rm -f $@
	sqlite3 $@ < $<

	# Import in parallel
	echo $(TXT) | xargs -P 0 -n 1 csvsql --no-create --no-inference --insert --db sqlite:///$@

	sqlite3 $@ < indices.sql

	# Vacuum for smaller database
	sqlite3 $@ 'VACUUM;'

$(TXT): gtfs.zip
	# Minimize the GTFS feed using patrickbr/gtfstidy
	gtfstidy -SCRmTcisOeD -o . gtfs.zip

	# Truncate the seconds on TIME and set arrival_time to be null for smaller database size
	sed -i.bak -E 's/([0-9]{2}):([0-9]{2}):[0-9]{2}/\1\2/g' frequencies.txt
	sed -i.bak -E 's/[0-9]{2}:[0-9]{2}:[0-9]{2},([0-9]{2}):([0-9]{2}):[0-9]{2}/,\1\2/g' stop_times.txt

	# Compress shapes.txt using @mapbox/polyline
	cp shapes.txt shapes.txt.bak
	node ./transformShapes.js < shapes.txt.bak > shapes.txt

gtfs.zip:
	aria2c --split 10 -k 2M -x 10 -o $@ $(DOWNLOAD_URL)

clean:
	rm -vf $(TXT) *.bak gtfs.sqlite3 gtfs.sqlite3.br
