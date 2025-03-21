import { apiRequest } from "./apiClient";

export const getLocationById = async (locationId) => {
  return await apiRequest(`/locations/${locationId}`);
};
