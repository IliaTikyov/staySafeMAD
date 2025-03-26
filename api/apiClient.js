//!!!!!!!!!!!!!!!!!!!!!!!!!!Warning!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!If http://localhost:5000/staysafe/v1/api is not working!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!Replace it with your ipv4 address!!!!!!!!!!!!!!!!!!!!!!!! muhammad's home ipv4 address '192.168.0.95' !!!
//const API_BASE_URL = "http://10.154.70.185:5000/staysafe/v1/api"; // Muhammad's home ipv4 address

//!!!!!!!!!!!!!!!!!!!!!Replace it with your ipv4 address!!!!!!!!!!!!!!!!!!!!!!!!

const API_BASE_URL = "http://192.168.1.233:5000/staysafe/v1/api"; // Ilia's home ipv4 address

//!!!!!!!!!!!!!!!!!!!!!Replace it with your ipv4 address!!!!!!!!!!!!!!!!!!!!!!!!

//const API_BASE_URL = "http://192.168.1.233:5000/staysafe/v1/api"; // no trailing slash

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const fullUrl = `${API_BASE_URL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

    console.log(`Making API Request: ${method} ${fullUrl}`);

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

    const response = await fetch(fullUrl, options);

    const responseText = await response.text();
    console.log("Raw response text:", responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (method === "DELETE" || response.status === 204) {
      return null;
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error(`Error in API call: ${error.message}`);
    throw error;
  }
};
