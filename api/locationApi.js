import { apiRequest } from "./apiClient";

export const getLocations = async () => {
  return await apiRequest("/locations");
};

export const getLocationById = async (id) => {
  return await apiRequest(`/locations/${id}`);
};
