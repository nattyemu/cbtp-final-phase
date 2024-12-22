import React, { useContext } from "react";
import img from "../../../../assets/images/StudentsWalking.jpeg";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import useAuth from "../../../../Utilities/AuthHeader";
import { userContext } from "../../../../Context/Authcontext";
function Home() {
  // const navigator = useNavigate();
  // const {
  //   setIsLogged,
  //   isLogged,
  //   isAdmin,
  //   setIsAdmin,
  //   isDepartment,
  //   setIsDepartment,
  //   isCafe,
  //   setIsCafe,
  //   isPolice,
  //   setIsPolice,
  //   isLibrary,
  //   setIsLibrary,
  //   isGard,
  //   setIsGard,
  //   isProctor,
  //   setIsProctor,
  //   isSuperProctor,
  //   setIsSuperProctor,
  //   isRegistrar,
  //   setIsRegistrar,
  //   isStudent,
  //   setIsStudent,
  //   userData,
  //   fetchData,
  //   setUserData,
  // } = useContext(userContext);
  // switch (){

  // }
  return (
    <>
      <div className="row home">
        <div className="leftPart col-md-6">
          <img src={img} alt="" />
        </div>
        <div className="rightPart col-md-6  text-md-center my-5">
          <h2 className="mt-5">
            Welcome to
            <br /> <span>Student Clerance System</span>
          </h2>
          <p className="ms-2 m-3 fs-5 fw-bold ">
            To step into the hassle-free student clearance, first log in.
          </p>
          <Link to="/login">
            <button className="p-2 m-5">login</button>
          </Link>
          {/* <Link to="/admin">
            <button className="p-2">Admin</button>
          </Link> */}
        </div>
      </div>
    </>
  );
}

export default Home;
