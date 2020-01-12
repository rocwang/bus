DOWNLOAD_URL="https://cdn01.at.govt.nz/data/gtfs.zip"
TXT=agency.txt  calendar.txt  calendar_dates.txt  feed_info.txt  routes.txt  shapes.txt  stop_info.txt  stop_times.txt  stops.txt  trips.txt

.PHONY: clean

gtfs.sqlite3.br: gtfs.sqlite3
	brotli --quality=6 --force --output=$@ $^

gtfs.sqlite3: gtfs.sql $(TXT)
	rm -f $@
	sqlite3 $@ < $<

	# Import in parallel
	echo $(TXT) | xargs -P 0 -n 1 csvsql --no-create --no-inference --insert --db sqlite:///$@

	# Vacuum for smaller database
	sqlite3 $@ 'VACUUM;'

$(TXT): gtfs.zip
	unzip -q -o -DD $^ $@

gtfs.zip:
	curl -o $@ $(DOWNLOAD_URL)

clean:
	rm -vf $(TXT) gtfs.sqlite3 gtfs.sqlite3.br
