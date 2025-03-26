import { apiRequest } from "./apiClient";

 Making-Location-Services-Work
export const getLocationById = async (locationId) => {
  return await apiRequest(`/locations/${locationId}`);
};

export const createLocation = async (locationData) => {
  const response = await apiRequest("/locations", "POST", locationData);
  console.log("Create Location Response:", response);
  return response; // This must include LocationID

export const getLocations = async () => {
  return await apiRequest("/locations");
};

export const getLocationById = async (id) => {
  return await apiRequest(`/locations/${id}`);

};
