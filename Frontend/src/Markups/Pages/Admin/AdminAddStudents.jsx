import { useState } from "react";
import FileUpload from "./Addfile/FileUpload";
import "./Addfile/fileUpload.css";
import AddStudentTable from "../../Components/Custom/Table/AddStudentTable";
import AddStudent from "../../Components/Admin/AddStudent";
import { useNavigate } from "react-router-dom";
import AdminAddStudentTable from "../../Components/Custom/Table/AdminAddStudentTable";
// import useAuth from "../../../Utilities/AuthHeader";
import ClearIcon from "@mui/icons-material/Clear";

function AdminAddStudents() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected
  const [showTable, setShowTable] = useState(true); // Control table and search visibility

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    setShowTable(false);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  const handleBackToTable = () => {
    setSelectedOption(""); // Reset the selected option
    setShowTable(true); // Show the table and search again
  };

  return (
    <>
      <div className="user m-0  ">
        <div className="dropdown">
          <button onClick={handleDropdownToggle} className="m-5 px-10 py-3">
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
        {selectedOption === "form" && <AddStudent popup={handleBackToTable} />}
        {selectedOption === "file" && (
          <FileUpload handleBackToTable={handleBackToTable} />
        )}

        {!showTable && selectedOption === "" && (
          <div className="form-container">
            <ClearIcon
              onClick={handleBackToTable}
              className="px-5 py-3 m-5"
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </div>
      {showTable && (
        <div>
          <AdminAddStudentTable />
        </div>
      )}
    </>
  );
}

export default AdminAddStudents;
