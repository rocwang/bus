export async function getVehiclePositions() {
  return {
    entity: [
      {
        id: "7302eb7f-8cd1-4f92-b572-d0b143721ab9",
        is_deleted: false,
        vehicle: {
          trip: {
            trip_id: "1234",
            route_id: "08204-20190522094814_v80.15",
            start_time: "16:25:00",
            schedule_relationship: 0,
          },
          vehicle: { id: "2CC7" },
          position: { latitude: -36.852667, longitude: 174.765633 },
          timestamp: 1560054213,
          occupancy_status: 0,
        },
      },
    ],
    header: {
      gtfs_realtime_version: "1.0",
      incrementality: 0,
      timestamp: 1560054289.161,
    },
  };
}
