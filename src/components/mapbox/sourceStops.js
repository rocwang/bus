import { getStopGeoJson } from "../../api/gtfs";

export async function getSourceStops(map) {
  map.addSource("stops", {
    type: "geojson",
    data: await getStopGeoJson(),
    attribution: "Auckland Transport"
    // cluster: true,
    // clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
    // clusterMaxZoom: 15, // Max zoom to cluster points on
  });

  return "stops";
}
