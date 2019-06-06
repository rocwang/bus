import mapboxgl from "mapbox-gl";
import bus from "../../assets/bus-colorful.svg";

export default {
  name: "MarkerBus",
  inject: ["mapPromise"],
  props: {
    vehicle: {
      type: Object,
      required: true
    }
  },
  computed: {
    position() {
      return {
        lat: this.vehicle.position.latitude,
        lng: this.vehicle.position.longitude
      };
    },
    bearing() {
      // "bearing" can be undefined.
      return this.vehicle.position.bearing || "90";
    }
  },
  beforeCreate() {
    const el = document.createElement("div");
    const image = document.createElement("img");
    el.appendChild(image);
    image.src = bus;
    image.style.width = "25px";
    this.marker = new mapboxgl.Marker(el);
  },
  async created() {
    this.map = await this.mapPromise;
    this.marker.addTo(this.map);
  },
  destroyed() {
    this.marker.remove();
  },
  render() {
    return null;
  },
  watch: {
    position: {
      immediate: true,
      handler(position) {
        this.marker.setLngLat(position);
      }
    },
    bearing: {
      immediate: true,
      handler(bearing) {
        let transforms = [];
        transforms.push(`rotate(${bearing}deg)`);
        if (bearing > 180) {
          transforms.push("scaleX(-1)");
        }

        this.marker
          .getElement()
          .querySelector("img").style.transform = transforms.join(" ");
      }
    }
  }
};
