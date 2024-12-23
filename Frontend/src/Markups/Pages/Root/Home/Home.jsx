import React from "react";
import img from "../../../../assets/images/StudentsWalking.jpeg";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="row home grid grid-cols-2">
      <div className="leftPart col-md-6 d-flex justify-content-center align-items-center">
        <img src={img} alt="" className="w-[50px]" />
      </div>
      <div className="rightPart col-md-6 text-center my-auto">
        <h2 className="mt-5">
          Welcome to
          <br /> <span>Student Clearance System</span>
        </h2>
        <p className="ms-2 m-3 fs-5 fw-bold">
          To step into the hassle-free student clearance, first log in.
        </p>
        <Link to="/login">
          <button className="p-2 m-5">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
