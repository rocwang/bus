const EventEmitter = require("events");

class Map extends EventEmitter {
  constructor() {
    super();

    this.remove = jest.fn();
    this.addControl = jest.fn();
    this.removeControl = jest.fn();
    this.loadImage = jest.fn((url, cb) =>
      cb(undefined, { width: 100, height: 100, data: new Uint8Array(0) })
    );
    this.addImage = jest.fn();
    this.removeImage = jest.fn();
    this.addLayer = jest.fn();
    this.removeLayer = jest.fn();
    this.queryRenderedFeatures = jest.fn(() => [
      {
        properties: {
          cluster_id: "1234"
        },
        geometry: {
          coordinates: {
            lng: 0,
            lat: 0
          }
        }
      }
    ]);
    this.getSource = jest.fn(() => ({
      getClusterExpansionZoom: jest.fn((clusterId, cb) => cb(undefined, 0))
    }));
    this.easeTo = jest.fn();

    this.originalOn = this.on;
    this.on = jest.fn((event, layerId_listener, listener) => {
      switch (typeof layerId_listener) {
        case "string":
          this.originalOn(`${event}-${layerId_listener}`, listener);
          break;
        case "function":
        default:
          this.originalOn(event, layerId_listener);
          break;
      }

      return this;
    });

    this.getLayer = jest.fn(() => "layerId");
    this.setFilter = jest.fn();
    this.setLayerZoomRange = jest.fn();
    this.getCanvas = jest.fn(() => ({
      style: {}
    }));
    this.easeTo = jest.fn();
    this.addSource = jest.fn();
    this.removeSource = jest.fn();

    setTimeout(() => this.emit("load"), 0);
  }
}

class Marker extends EventEmitter {
  constructor(el) {
    super();

    this.element = el;

    this.addTo = jest.fn();
    this.remove = jest.fn();
    this.setLngLat = jest.fn();
    this.getElement = jest.fn(() => el);
  }
}

class GeolocateControl {}

module.exports = {
  Map,
  GeolocateControl,
  Marker
};
