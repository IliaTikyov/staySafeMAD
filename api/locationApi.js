import { apiRequest } from "./apiClient";

export const getLocationById = async (locationId) => {
  const response = await apiRequest(`/locations/${locationId}`);
  return response[0];
};

export const createLocation = async (locationData) => {
  const response = await apiRequest("/locations", "POST", locationData);
  console.log("Create Location Response:", response);
  return response;
};
export const getLocations = async () => {
  return await apiRequest("/locations");
};

/* export const getLocationById = async (id) => {
  return await apiRequest(`/locations/${id}`);

}; */

export const deleteLocation = async (locationID) => {
  return await apiRequest(`/locations/${locationID}`, "DELETE");
};
