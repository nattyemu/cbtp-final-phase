import { useEffect, useState } from "react";
import AddUser from "../../../Components/Admin/AddUser";
import FileUpload from "../../Admin/Addfile/FileUpload";
import "../../Admin/Addfile/fileUpload.css";
import AddUserTable from "../../../Components/Custom/Table/AddUserTable";
import Header from "../../../Components/Common/Header";
import AddStudentTable from "../../../Components/Custom/Table/AddStudentTable";
import AddStudent from "../../../Components/Admin/AddStudent";
import UserPage from "../../../Components/Root/User/UserPage";
import getAuth from "../../../../Utilities/AuthHeader";
import For4 from "../Fo4/For4";
import RegistrarPage from "../../../Components/Root/User/RegistrarPage";

function Registral() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(""); // Initially no option is selected
  //
  const [data, setData] = useState();

  // Fetch data asynchronously
  const fetchData = async () => {
    try {
      const response = await getAuth();
      console.log("Fetched user data:", response);
      setData(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(data);
  }, []);
  //
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  return (
    <>
      {data && data.role === "REGISTRAR" ? (
        <>
          <RegistrarPage loinData={data} />
          <div className="user">
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
                <AddStudent />
              </div>
            ) : (
              selectedOption === "file" && (
                <div className="form-container">
                  <FileUpload />
                </div>
              )
            )}
          </div>
          <div>
            <div className="mx-5  addS">
              <AddStudentTable />
            </div>
          </div>
        </>
      ) : (
        <For4 />
      )}
    </>
  );
}

export default Registral;
