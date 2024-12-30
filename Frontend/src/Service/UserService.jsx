import axios from "../Utilities/Axios";

export default {
  login: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/user/login", form);
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  },

  forgetPassword: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/user/forget/password", form);
      // console.log(response);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  count: async (form) => {
    try {
      const response = await axios.post("/request/count", form);
      // console.log("count in userservice", response);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  confirmOtp: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/user/confirm/otp", form);
      // console.log(response);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
  resetPassword: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/user/new/password", form);
      // console.log(response);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
