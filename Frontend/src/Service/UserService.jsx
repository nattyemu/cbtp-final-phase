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
    try {
      const response = await axios.post("/user/forget/password", form);
      // console.log(response);
      return response.data;
    } catch (error) {}
  },

  count: async (form) => {
    try {
      const response = await axios.post("/request/count", form);
      // console.log("count in userservice", response);
      return response.data;
    } catch (error) {}
  },
  changePassword: (form) => {},
};
