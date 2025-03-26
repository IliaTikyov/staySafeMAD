import { apiRequest } from "./apiClient";

export const getLocationById = async (locationId) => {
  return await apiRequest(`/locations/${locationId}`);
};

export const createLocation = async (locationData) => {
  const response = await apiRequest("/locations", "POST", locationData);
  console.log("Create Location Response:", response);
  return response;
};

export const getLocations = async () => {
  return await apiRequest("/locations");
};
