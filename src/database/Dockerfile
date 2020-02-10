# The Docker image for building the GTFS database in Gitlab CI
FROM ubuntu:18.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update

RUN apt-get -y install sqlite3 unzip csvkit aria2 brotli build-essential

RUN make --version
RUN unzip -v
RUN sqlite3 --version
RUN csvsql --version
RUN aria2c --version
RUN brotli --version
