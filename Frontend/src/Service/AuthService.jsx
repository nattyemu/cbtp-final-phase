import axios from "../Utilities/Axios";
import getAuth from "../Utilities/AuthHeader";
const data = await getAuth();
export default {
  register: async (form) => {
    console.log(form);
    try {
      // Check if the form is an array or object
      if (Array.isArray(form)) {
        // If it's an array, handle multiple registrations
        const responses = [];
        for (const item of form) {
          const response = await axios.post("/user/register", item);
          responses.push(response.data);
        }
        return responses; // Return an array of responses
      } else {
        // If it's a single object, send it directly
        const response = await axios.post("/user/register", form);
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return error.response?.data || { message: "Error occurred" };
    }
  },

  getUsers: async (form) => {
    // console.log(form);
    try {
      const response = await axios.get("/user/users", form);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  searchCleared: async (form) => {
    console.log(form);
    try {
      const response = await axios.post("/request/searchCleared", form);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data;
    }
  },
  addToClearance: async (form) => {
    console.log(form);
    try {
      const response = await axios.post("/clerance/new", form);

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response.data;
    }
  },
  getUsersClearedOrNot: async () => {
    try {
      const response = await axios.get("/request/checkAllTrue");
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  },
  getAdmins: async () => {
    try {
      const response = await axios.get("/user/admin");
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  getStudentCount: async () => {
    try {
      const response = await axios.get("/user/student/count");
      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  getAllUsersCount: async () => {
    try {
      const response = await axios.get("/user/users/count");
      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  getClearanceRequestReason: async (form) => {
    try {
      console.log(form);
      const response = await axios.post(
        `/request/clearance/reason/${data?.id}`,
        form
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  },
  getStudent: async (form) => {
    // console.log(form);
    try {
      const response = await axios.get("/user/student", form);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  getReportAll: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/report/all", form);
      // console.log(response.data);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  update: async (form, id) => {
    // console.log(form);
    // console.log(id);
    try {
      const response = await axios.put(`/user/update/${id}`, form);
      // console.log(id);
      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  updateAdminUser: async (form, id) => {
    // console.log(form);
    // console.log(id);
    try {
      const response = await axios.put(`/user/admin/update/${id}`, form);
      // console.log(id);
      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  updateDebt: async (form, id) => {
    // console.log(form);
    // console.log(id);
    try {
      const response = await axios.put("/report/updatedebt", form);

      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(error.response.data);
      return error.response.data;
    }
  },
  request: async (form) => {
    const data = await getAuth();

    console.log(form);
    console.log(data);
    try {
      // const authToken = localStorage.getItem('authToken');
      const response = await axios.post(
        `/request/new/${data?.id}`,
        form
        // {
        //   headers: {
        //     Authorization: `${authToken}`, // Include the authentication token in the Authorization header
        //     'Content-Type': 'application/json', // Optionally specify the content type
        //   },
        // }
      );
      // console.log(response);
      return response?.data;
    } catch (error) {
      // console.log(error);
      return error.response.data;
    }
  },

  getMy: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/user/me/myInfo", form);
      return response.data;
    } catch (error) {
      // console.log(error);
      return error.response.data;
    }
  },
  // request/sendTrueColumns
  sendTrueColumns: async () => {
    // console.log(form);
    const data = await getAuth();
    try {
      const response = await axios.post("/request/sendTrueColumns", {
        id: data.id,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  },

  addNew: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/report/new", form);
      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(response);
      return error.response.data;
    }
  },
  getTheRequest: async (form) => {
    // console.log(form);
    try {
      const response = await axios.post("/request/all", form);
      // console.log(response?.data);
      return response.data;
    } catch (error) {
      // console.log(error);
      return error.response.data;
    }
  },
  getTheRequestApproved: async (form) => {
    console.log(form);
    try {
      const response = await axios.post("/request/allapprove", form);
      console.log(response?.data);
      return response.data;
    } catch (error) {
      console.log(response);
      return response.data;
    }
  },
  reject: async (form, id) => {
    try {
      const response = await axios.post(`/request/rejectReason/${id}`, form);
      // console.log(response);
      return response.data;
    } catch (error) {
      // console.log(error);
      return error.response.data;
    }
  },
  apporve: async (form, id) => {
    console.log(form, id);
    try {
      const response = await axios.put(`/request/${id}`, form);
      // console.log(response?.data);
      return response.data;
    } catch (error) {
      // console.log(error);
      return error.response.data;
    }
  },
};
