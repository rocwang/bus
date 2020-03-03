DOWNLOAD_URL="https://cdn01.at.govt.nz/data/gtfs.zip"
TXT=agency.txt calendar.txt calendar_dates.txt frequencies.txt routes.txt shapes.txt stop_times.txt stops.txt trips.txt
CSV=agency.csv calendar.csv calendar_dates.csv frequencies.csv routes.csv shapes.csv stop_times.csv stops.csv trips.csv

.PHONY: clean

gtfs.sqlite3.br: gtfs.sqlite3
	brotli --quality=11 --force --output=$@ $^

gtfs.sqlite3: tables.sql indices.sql $(CSV)
	rm -f $@
	sqlite3 $@ < $<

	# Import in parallel
	echo $(CSV) | xargs -P 0 -n 1 csvsql --no-create --no-inference --insert --db sqlite:///$@

	sqlite3 $@ < indices.sql

	# Vacuum for smaller database
	sqlite3 $@ 'VACUUM;'

$(TXT): gtfs.zip
	# Minimize the GTFS feed using patrickbr/gtfstidy
	gtfstidy -SCRmTcsOeD -o . gtfs.zip

$(CSV): $(TXT)
	# Transform the feed to smaller database size
	node ./transformCsv.js $(TXT)

	# Compress shapes.txt using @mapbox/polyline
	cp shapes.csv shapes.csv.bak
	node ./transformShapes.js < shapes.csv.bak > shapes.csv

gtfs.zip:
	aria2c --split 10 -k 2M -x 10 -o $@ $(DOWNLOAD_URL)

clean:
	rm -vf $(TXT) *.bak gtfs.sqlite3 gtfs.sqlite3.br
