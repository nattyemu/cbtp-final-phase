import { useState } from "react";
import FileUpload from "./Addfile/FileUpload";
import "./Addfile/fileUpload.css";
import AddStudentTable from "../../Components/Custom/Table/AddStudentTable";
import AddStudent from "../../Components/Admin/AddStudent";
import ClearIcon from "@mui/icons-material/Clear";

function AddStudents() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected
  const [showTable, setShowTable] = useState(true); // Control table visibility

  const handleAddButtonClick = () => {
    setShowDropdown(true); // Show the dropdown
    setShowTable(false); // Hide the table and search section
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Set the selected option
    setShowDropdown(false);
    setShowTable(false) // Hide the dropdown after selecting an option
  };

  const handleBackToTable = () => {
    setSelectedOption(""); // Reset the selected option
    setShowTable(true); // Show the table again
  };

  return (
    <div className="add-students-container p-5">
      {/* Add Button */}
      {showTable && (
        <div className="add-button-container mb-6">
          <button
            onClick={handleAddButtonClick}
            className="m-5 px-5 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Dropdown for Add Options */}
      {showDropdown && (
        <div className="dropdown-content mt-2 bg-white border rounded shadow-lg">
          <div className="options-row">
            <button
              onClick={() => handleOptionClick("file")}
              className="block px-5 py-3 w-full text-left hover:bg-gray-200"
            >
              Add from CSV file
            </button>
            <button
              onClick={() => handleOptionClick("form")}
              className="block px-5 py-3 w-full text-left hover:bg-gray-200"
            >
              Add by using form
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      {selectedOption === "form" && (
        <div className="form-container relative p-5 bg-white rounded shadow-lg">
          <ClearIcon
            onClick={handleBackToTable}
            className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
          />
          <AddStudent />
        </div>
      )}

      {/* File Upload Section */}
      {selectedOption === "file" && (
        <div className="form-container relative p-5 bg-white rounded shadow-lg">
          <ClearIcon
            onClick={handleBackToTable}
            className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
          />
          <FileUpload />
        </div>
      )}

      {/* Table Section */}
      {showTable && (
        <div className="student-table-container">
          <AddStudentTable />
        </div>
      )}
    </div>
  );
}

export default AddStudents;
