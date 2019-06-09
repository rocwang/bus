import fetchMock from "fetch-mock";
import { getVehiclePositions } from "./gtfsRealtime";

describe("Function getVehiclePositions()", () => {
  it("returns no entity when no trip IDs passed in", async () => {
    fetchMock.once("*", 200);

    const expectedResult = { entity: [] };

    let vehiclePositions = await getVehiclePositions();
    expect(vehiclePositions).toEqual(expectedResult);

    vehiclePositions = await getVehiclePositions([]);
    expect(vehiclePositions).toEqual(expectedResult);

    expect(fetchMock.called()).toBe(false);

    fetchMock.reset();
  });

  it("returns vehicle positions by trip IDs", async () => {
    const expectedResult = {
      entity: [
        {
          id: "7302eb7f-8cd1-4f92-b572-d0b143721ab9",
          is_deleted: false,
          vehicle: {
            trip: {
              trip_id: "51439154687-20190522094814_v80.15",
              route_id: "08204-20190522094814_v80.15",
              start_time: "16:25:00",
              schedule_relationship: 0
            },
            vehicle: { id: "2CC7" },
            position: { latitude: -36.852667, longitude: 174.765633 },
            timestamp: 1560054213,
            occupancy_status: 0
          }
        }
      ],
      header: {
        gtfs_realtime_version: "1.0",
        incrementality: 0,
        timestamp: 1560054289.161
      }
    };
    const reponse = {
      status: "OK",
      response: expectedResult,
      error: null
    };

    fetchMock.once("*", reponse);

    const vehiclePositions = await getVehiclePositions([
      "51439154687-20190522094814_v80.15"
    ]);

    expect(fetchMock.called()).toBe(true);
    expect(vehiclePositions).toEqual(expectedResult);

    fetchMock.reset();
  });
});
