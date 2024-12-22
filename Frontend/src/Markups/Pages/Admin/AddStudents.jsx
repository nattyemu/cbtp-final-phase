import { useState } from "react";
import FileUpload from "./Addfile/FileUpload";
import "./Addfile/fileUpload.css";
import AddStudentTable from "../../Components/Custom/Table/AddStudentTable";
import AddStudent from "../../Components/Admin/AddStudent";
import { useNavigate } from "react-router-dom";
// import useAuth from "../../../Utilities/AuthHeader";

function AddStudents() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  return (
    <>
      <div className="user">
        <div className="dropdown">
          <button onClick={handleDropdownToggle} className="m-5 px-5 py-3">
            Add
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
        {selectedOption === "form" && (
          <div className="form-container">
            <AddStudent />
          </div>
        )}
        {selectedOption === "file" && (
          <div className="form-container">
            <FileUpload />
          </div>
        )}
      </div>
      <div>
        <AddStudentTable />
      </div>
    </>
  );
}

export default AddStudents;
