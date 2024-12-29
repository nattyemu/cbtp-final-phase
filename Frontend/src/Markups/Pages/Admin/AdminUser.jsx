import { useEffect, useState } from "react";
import AddUser from "../../Components/Admin/AddUser";
import FileUpload from "./Addfile/FileUpload";
import "./Addfile/fileUpload.css";
import AddUserTable from "../../Components/Custom/Table/AddUserTable";
import getAuth from "../../../Utilities/AuthHeader";
import AddAdminTable from "../../Components/Custom/Table/AddAdminTable";
import { toast } from "react-toastify";
import AuthService from "../../../Service/AuthService";
import ClearIcon from "@mui/icons-material/Clear";

function AdminUser(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected
  const [showTable, setShowTable] = useState(true); // Control table and search visibility
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAuth();
      const response = await AuthService.getAdmins({
        role: data?.role,
      });
      console.log(response?.data);
      setUsers(response?.data);
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    setShowTable(false); // Hide the table and search when the dropdown is toggled
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
      <div className="user">
        <div className="dropdown">
          <button onClick={handleDropdownToggle} className="mt-5 px-10 py-3">
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
          <div className="form-container relative">
            <ClearIcon
              onClick={handleBackToTable}
              className="absolute top-0 right-[25%] m-5 hover:text-red-400 text-[#141430]"
              style={{ cursor: "pointer" }}
            />
            <AddUser />
          </div>
        )}

        {selectedOption === "file" && (
          <FileUpload handleBackToTable={handleBackToTable} />
        )}

        {!showTable && selectedOption === "" && (
          <div className="form-container">
            <ClearIcon
              onClick={handleBackToTable}
              className="px-5 py-3 m-5 hover:text-red-400"
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
      </div>

      {showTable && !selectedOption && (
        <div>
          {/* AddAdminTable includes both the table and search */}
          <AddAdminTable />
        </div>
      )}
    </>
  );
}

export default AdminUser;
