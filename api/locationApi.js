import { apiRequest } from "./apiClient";

export const getLocationById = async (locationId) => {
  const response = await apiRequest(`/locations/${locationId}`);
  return response[0]; // ✅ unwrap the single object
};

export const createLocation = async (locationData) => {
  const response = await apiRequest("/locations", "POST", locationData);
  console.log("Create Location Response:", response);
  return response; // This must include LocationID
};
export const getLocations = async () => {
  return await apiRequest("/locations");
};

/* export const getLocationById = async (id) => {
  return await apiRequest(`/locations/${id}`);

}; */
