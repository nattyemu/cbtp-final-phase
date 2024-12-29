import React, { useContext, useEffect, useState } from "react";

import "../../../Pages/Root/Student/students.css";

import AddStudentTable from "../../Custom/Table/AddStudentTable";
import FileUpload from "../../../Pages/Admin/Addfile/FileUpload";
import AddStudent from "../../Admin/AddStudent";

const DefaultTabel = () => {
  const [showTable, setShowTable] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected
  //

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    if (showDropdown) {
      // setShowTable(false);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setShowTable(false);
  };

  const popup = () => {
    setShowTable(true);
    setShowDropdown(false);
    setSelectedOption("");
  };
  return (
    <>
      {" "}
      <div className="user row">
        <div className="dropdown">
          <button onClick={handleDropdownToggle} className="m-5 px-5 py-3">
            Add student
          </button>
          {showDropdown && (
            <div className="dropdown-content">
              <div className="options-row">
                <button
                  onClick={() => handleOptionClick("file")}
                  className="option-btn m-5 px-5 py-3"
                >
                  Add from CSV file
                </button>
                <button
                  onClick={() => handleOptionClick("form")}
                  className="option-btn m-5 px-5 py-3"
                >
                  Add by using form
                </button>
              </div>
            </div>
          )}
        </div>
        {selectedOption === "form" ? (
          <div className="form-container">
            <AddStudent popup={popup} />
          </div>
        ) : (
          selectedOption === "file" && (
            <div className="form-container">
              <FileUpload handleBackToTable={popup} />
            </div>
          )
        )}
        <div>
          {showTable && (
            <div className="mx-5  addS">
              <AddStudentTable />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default DefaultTabel;
