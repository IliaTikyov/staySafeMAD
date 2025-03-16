import { apiRequest } from "./apiClient";

export const getActivities = async () => {
  return await apiRequest("/activities");
};

export const getActivityById = async (activityId) => {
  return await apiRequest(`/activities/${activityId}`);
};

export const createActivity = async (activityData) => {
  return await apiRequest("/activities", "POST", activityData);
};

export const updateActivity = async (activityData) => {
  const { ActivityID, ...updatedFields } = activityData;
  return await apiRequest(`/activities/${ActivityID}`, "PUT", updatedFields);
};

export const deleteActivity = async (activityID) => {
  return await apiRequest(`/activities/${activityID}`, "DELETE");
};
