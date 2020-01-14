import { getStops } from "../../api/gtfs";
import { featureCollection, point } from "@turf/turf";

export async function getSourceStops(map) {
  const stops = await getStops();
  const geoJson = featureCollection(
    stops.map(stop =>
      point([stop.stop_lon, stop.stop_lat], {
        stopCode: stop.stop_code
      })
    )
  );

  map.addSource("stops", {
    type: "geojson",
    data: geoJson,
    attribution: "Auckland Transport"
    // cluster: true,
    // clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
    // clusterMaxZoom: 15, // Max zoom to cluster points on
  });

  return "stops";
}
