import axios from "axios";
// import { useAuth } from "../Context/Authcontext";
import  getAuth from './AuthHeader'
// const {userData} = useAuth();

// const serverURL = import.meta.env.VITE_API_BASE_URL;
const instance = axios.create({
  baseURL:"http://localhost:7777/api",
  withCredentials: true,
});

// Set the token in the request headers
instance.interceptors.request.use(async (config) => {
  const data=await getAuth();
  if(data){
    const token =data.userToken; 
    if (token) {
      config.headers = {
        "authorization": token,
      };
    }
  }  
  return config;
});

export default instance;
