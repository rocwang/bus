# The Docker image for building the GTFS database in Gitlab CI
FROM golang:1

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get -y install sqlite3 csvkit aria2 brotli build-essential

RUN go get github.com/patrickbr/gtfstidy

RUN make --version
RUN sqlite3 --version
RUN csvsql --version
RUN aria2c --version
RUN brotli --version
