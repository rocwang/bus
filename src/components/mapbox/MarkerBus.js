import mapboxgl from "mapbox-gl";
import bus from "../../assets/bus.svg";
import {
  along,
  distance,
  getCoord,
  lineSlice,
  lineString,
  point
} from "@turf/turf";
import { getShapeByTrip } from "../../api/gtfs";
import { uniqueId } from "lodash-es";

export default {
  name: "MarkerBus",
  inject: ["mapPromise", "colors"],
  props: {
    vehicle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      speed: 13.89, // unit: m/s. defaults to 50 km/s
      shape: [],
      id: uniqueId()
    };
  },
  computed: {
    shapeLeft() {
      if (this.shape.length === 0) {
        return null;
      }

      const startPoint = point([
        this.vehicle.position.longitude,
        this.vehicle.position.latitude
      ]);
      const endPoint = point(this.shape[this.shape.length - 1]);
      const line = lineString(this.shape);
      return lineSlice(startPoint, endPoint, line);
    }
  },
  watch: {
    async shape() {
      const map = await this.mapPromise;
      const geoJson = lineString(this.shape);
      const source = map.getSource(this.id);
      if (source) {
        source.setData(geoJson);
      } else {
        map.addSource(this.id, {
          type: "geojson",
          data: geoJson
        });

        map.addLayer(
          {
            id: this.id,
            type: "line",
            source: this.id,
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": this.colors.blue,
              "line-width": 4
            }
          },
          "road-label-small"
        );
      }
    },
    // update shape
    "vehicle.trip.trip_id": {
      immediate: true,
      async handler() {
        const shapeCoords = await getShapeByTrip(this.vehicle.trip.trip_id);
        this.shape = shapeCoords.map(({ shape_pt_lon, shape_pt_lat }) => [
          shape_pt_lon,
          shape_pt_lat
        ]);
      }
    },
    vehicle: [
      // // mark the history positions
      // {
      //   immediate: true,
      //   async handler(vehicle) {
      //     const map = await this.mapPromise;
      //     new mapboxgl.Marker()
      //       .setLngLat([vehicle.position.longitude, vehicle.position.latitude])
      //       .addTo(map);
      //   }
      // },

      // update vehicle speed
      {
        immediate: true,
        handler(newVehicle, oldVehicle) {
          if (!oldVehicle) {
            return;
          }
          // unit: second
          const deltaTime = newVehicle.timestamp - oldVehicle.timestamp;
          if (deltaTime === 0) {
            return;
          }

          const from = point([
            newVehicle.position.longitude,
            newVehicle.position.latitude
          ]);
          const to = point([
            oldVehicle.position.longitude,
            oldVehicle.position.latitude
          ]);

          // unit: meter
          const deltaDistance = distance(from, to) * 1000;

          // unit: meter / second. max speed: 100 km/h
          this.speed = Math.min(deltaDistance / deltaTime, 100 / 3.6);
        }
      }
    ]
  },
  methods: {
    animate() {
      const now = Date.now();

      if (!this.shapeLeft) {
        this.justNow = now;
        window.requestAnimationFrame(this.animate);
        return;
      }

      // unit: second
      const deltaTimeVehicle = now / 1000 - this.vehicle.timestamp;

      if (deltaTimeVehicle <= 0) {
        this.justNow = now;
        window.requestAnimationFrame(this.animate);
        return;
      }

      // unit: kilometer
      const distanceVehicleMoved = (this.speed * deltaTimeVehicle) / 1000;
      const vehiclePoint = along(this.shapeLeft, distanceVehicleMoved);
      const vehicleCoord = getCoord(vehiclePoint);

      const markerPosition = this.marker.getLngLat();
      const markerCoord = [markerPosition.lng, markerPosition.lat];

      // unit: kilometer
      const distanceBetween = distance(point(markerCoord), vehiclePoint);

      // unit: second
      const deltaTimeForMaker = (now - this.justNow) / 1000;
      // unit: m/s. 100 km/hour
      const markerSpeed = 100 / 3.6;
      // unit: kilometer
      const distanceMakerMoved = (markerSpeed * deltaTimeForMaker) / 1000;

      let newMarkerPosition;
      if (distanceMakerMoved > distanceBetween) {
        // chased up
        newMarkerPosition = vehicleCoord;
      } else {
        // chasing
        const markerRoute = lineString([markerCoord, vehicleCoord]);
        newMarkerPosition = getCoord(along(markerRoute, distanceMakerMoved));
      }

      this.marker.setLngLat(newMarkerPosition);
      this.justNow = now;
      this.animationId = window.requestAnimationFrame(this.animate);
    }
  },
  async created() {
    const el = document.createElement("div");
    const image = document.createElement("img");
    el.appendChild(image);
    image.src = bus;
    image.style.width = "25px";
    this.marker = new mapboxgl.Marker(el);
    this.marker.setLngLat([
      this.vehicle.position.longitude,
      this.vehicle.position.latitude
    ]);
    this.map = await this.mapPromise;
    this.marker.addTo(this.map);

    this.justNow = Date.now();
    this.animationId = window.requestAnimationFrame(this.animate);
  },
  destroyed() {
    this.marker.remove();
    window.cancelAnimationFrame(this.animationId);

    const layer = this.map.getLayer(this.id);
    if (layer) {
      this.map.removeLayer(this.id);
    }

    const source = this.map.getSource(this.id);
    if (source) {
      this.map.removeSource(this.id);
    }
  },
  render() {
    return null;
  }
};
