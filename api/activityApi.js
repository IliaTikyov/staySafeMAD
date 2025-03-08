import { apiRequest } from "./apiClient";

export const getActivities = async () => {
  return await apiRequest("/activities");
};

export const getActivityById = async (activityId) => {
  return await apiRequest(`/activities/${activityId}`);
};

export const createActivity = async (activityData) => {
  const requestData = { ActivityID: null, ...activityData };
  return await apiRequest("/activities", "POST", requestData);
};

export const updateActivity = async (activityId, updatedData) => {
  return await apiRequest(`/activities/${activityId}`, "PUT", updatedData);
};

export const deleteActivity = async (activityID) => {
  return await apiRequest(`/activities/${activityID}`, "DELETE");
};
