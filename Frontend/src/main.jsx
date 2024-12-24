import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UseProvider } from "./Context/Authcontext";
import { ToastProvider } from "./Context/ToastContext";
import AdminHome from "./Markups/Pages/Admin/AdminHome";
import Login from "./Markups/Pages/Root/Login/Login";
import ForgetPassword from "./Markups/Pages/Root/Login/ForgetPassword";
import ConfirmOtp from "./Markups/Components/Custom/Form/ConfirmOtp";
import Home from "./Markups/Pages/Root/Home/Home";
import Student from "./Markups/Pages/Root/Student/Student";
import Department from "./Markups/Pages/Root/Department/Department";
import CafeHead from "./Markups/Pages/Root/CafeHead/CafeHead";
import Gards from "./Markups/Pages/Root/Gards/Gards";
import Proctor_GB from "./Markups/Pages/Root/Proctor_GB/Proctor_GB";
import Registral from "./Markups/Pages/Root/Registral/Registral";
import Proctor from "./Markups/Pages/Root/ProctorHead/Proctor";
import ListOfRequest from "./Markups/Components/Root/User/ListOfRequest";
import AddUser from "./Markups/Components/Admin/AddUser";
import RequestDetail from "./Markups/Components/Root/User/RequestDetail";
import For4 from "./Markups/Pages/Root/Fo4/For4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Librirary from "./Markups/Pages/Root/Librirary/Librirary";
import Police from "./Markups/Pages/Root/Police/Police";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/admin",
      element: <AdminHome />,
    },
    {
      path: "/librirary",
      element: <Librirary />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgetPassword",
      element: <ForgetPassword />,
    },
    {
      path: "/confirmOtp",
      element: <ConfirmOtp />,
    },
    {
      path: "/student",
      element: <Student />,
    },
    {
      path: "/department",
      element: <Department />,
    },
    {
      path: "/cafeHead",
      element: <CafeHead />,
    },
    {
      path: "/gards",
      element: <Gards />,
    },
    {
      path: "/proctor_GB",
      element: <Proctor_GB />,
    },
    {
      path: "/proctorHead",
      element: <Proctor />,
    },
    {
      path: "/registral",
      element: <Registral />,
    },
    {
      path: "/police",
      element: <Police />,
    },
    {
      path: "/list",
      element: <ListOfRequest />,
    },
    {
      path: "/addUser",
      element: <AddUser />,
    },
    {
      path: "/requestDetail/:id",
      element: <RequestDetail />,
    },
    {
      path: "*",
      element: <For4 />,
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
      v7_partialHydration: true,
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <UseProvider>
    <ToastProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </ToastProvider>
  </UseProvider>
);
