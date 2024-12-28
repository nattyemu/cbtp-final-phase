import axios from "axios";
import getAuth from "./AuthHeader";

const instance = axios.create({
  baseURL: "http://localhost:7777/api",
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const data = await getAuth();

      if (data && data.userToken) {
        const token = data.userToken;

        // Ensure the token is set correctly with the 'Bearer ' prefix
        config.headers = {
          authorization: `${token}`,
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
