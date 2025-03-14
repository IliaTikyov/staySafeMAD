import { apiRequest } from "./apiClient";

export const registerUser = async (userData) => {
  return await apiRequest("/users", "POST", userData);
};

export const loginUser = async (username, password) => {
  try {
    const users = await apiRequest("/users");

    if (!users || users.length === 0) {
      throw new Error("No users found in the system.");
    }

    const user = users.find(
      (u) => u.UserUsername === username && u.UserPassword === password
    );

    if (user) {
      return user;
    } else {
      throw new Error("Invalid username or password.");
    }
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  return await apiRequest(`/users/${userId}`);
};

export const updateUserLocation = async (userId, latitude, longitude) => {
  return await apiRequest(`/users/${userId}`, "PUT", {
    UserLatitude: latitude,
    UserLongitude: longitude,
    UserTimestamp: Date.now(),
  });
};
