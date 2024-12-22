import { useEffect, useState } from "react";
import AddUser from "../../Components/Admin/AddUser";
import FileUpload from "./Addfile/FileUpload";
import "./Addfile/fileUpload.css";
import AddUserTable from "../../Components/Custom/Table/AddUserTable";
import getAuth from "../../../Utilities/AuthHeader";
import AddAdminTable from "../../Components/Custom/Table/AddAdminTable";
import { toast } from "react-toastify";
import AuthService from "../../../Service/AuthService";

function AdminUser(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected
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
    console.log("losers", users);
  };

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
            <AddUser />
          </div>
        )}
        {selectedOption === "file" && (
          <div className="form-container">
            <FileUpload />
          </div>
        )}
      </div>
      <div>
        <AddAdminTable />
      </div>
    </>
  );
}

export default AdminUser;
