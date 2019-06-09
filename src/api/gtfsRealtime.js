function callApi(request) {
  if (typeof request === "string") {
    request = `https://api.at.govt.nz/v2/${request}`;
  }

  return fetch(request, {
    headers: {
      "Ocp-Apim-Subscription-Key":
        process.env.VUE_APP_AUCKLAND_TRANSPORT_API_KEY
    }
  })
    .then(response => response.json())
    .then(json => json.response);
}

export async function getVehiclePositions(tripIds) {
  if (!tripIds || tripIds.length === 0) {
    return { entity: [] };
  }

  const tripid = tripIds.join(",");

  return callApi(`public/realtime/vehiclelocations?tripid=${tripid}`);
}
