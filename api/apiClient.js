//!!!!!!!!!!!!!!!!!!!!!!!!!!Warning!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!If http://localhost:5000/staysafe/v1/api is not working!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!Replace it with your ipv4 address!!!!!!!!!!!!!!!!!!!!!!!! muhammad's home ipv4 address '192.168.0.95' !!!
//const API_BASE_URL = "http://192.168.0.95:5000/staysafe/v1/api"; // Muhammad's home ipv4 address

//!!!!!!!!!!!!!!!!!!!!!Replace it with your ipv4 address!!!!!!!!!!!!!!!!!!!!!!!!

const API_BASE_URL = "http://192.168.1.233:5000/staysafe/v1/api"; // Ilia's home ipv4 address

//!!!!!!!!!!!!!!!!!!!!!Replace it with your ipv4 address!!!!!!!!!!!!!!!!!!!!!!!!

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    console.log(`Making API Request: ${method} ${API_BASE_URL}${endpoint}`);

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (method === "DELETE" || response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in API call: ${error.message}`);
    throw error;
  }
};
