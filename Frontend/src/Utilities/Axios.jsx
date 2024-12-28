import axios from "axios";
import getAuth from "./AuthHeader"; // Assuming getAuth retrieves user data with the token

const instance = axios.create({
  baseURL: "http://localhost:7777/api", // Your backend URL
  withCredentials: true, // Ensures credentials (cookies, etc.) are included with the request
});

// Request interceptor to add the authorization token to the request headers
instance.interceptors.request.use(
  async (config) => {
    try {
      // Get user data (assuming getAuth returns user data with the token)
      const data = await getAuth();

      // If there is user data, proceed to add token in the headers
      if (data && data.userToken) {
        const token = data.userToken;

        // Ensure the token is set correctly with the 'Bearer ' prefix
        config.headers = {
          Authorization: `Bearer ${token}`,
        };

        // If the request contains FormData (i.e., file upload), set the 'Content-Type' to 'multipart/form-data'
        if (config.data instanceof FormData) {
          config.headers["Content-Type"] = "multipart/form-data";
        }
      }

      return config;
    } catch (error) {
      console.error("Error in intercepting request:", error);
      return Promise.reject(error); // Make sure to reject in case of errors
    }
  },
  (error) => {
    // Handle any errors during the request interception (e.g., network issues, etc.)
    return Promise.reject(error);
  }
);

export default instance;
