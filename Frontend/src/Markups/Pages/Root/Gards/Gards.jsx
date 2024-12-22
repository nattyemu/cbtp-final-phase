import React, { useEffect, useState } from "react";
import ApproveTableGard from "../../../Components/Custom/Table/ApproveTableGard";
import Header from "../../../Components/Common/Header";
import getAuth from "../../../../Utilities/AuthHeader";
import For4 from "../Fo4/For4";

function Gards() {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState(""); // Single state to store the search term
  const [sendSearch, setSendSearch] = useState();

  // Fetch data asynchronously (for initial load)
  const fetchData = async () => {
    try {
      const response = await getAuth();
      setData(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
    handleSearch();
  };

  // Handle search button click with pattern check
  const handleSearch = () => {
    const isStudentIdPattern =
      /^[a-zA-Z\d]*\/\d+$/.test(searchTerm) ||
      /^\d+\/\d+$/.test(searchTerm) ||
      /^\d+$/.test(searchTerm);

    if (isStudentIdPattern) {
      // Search by studentId if it matches the refined pattern
      setSendSearch({ studentId: searchTerm });
    } else {
      // Otherwise, treat it as a name search
      setSendSearch({ firstName: searchTerm });
    }
  };

  // Handle pressing the Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {data && data.role === "GARD" ? (
        <div className="">
          <Header />
          <div className="p-3 w-full flex flex-col justify-center items-center">
            <div className="m-3 text-center flex justify-center items-center w-[50%]">
              <input
                type="text"
                id="search"
                placeholder="Search by first name or student ID"
                className="p-2 rounded-md "
                value={searchTerm}
                onChange={handleSearchInputChange} // Update the search term
                maxLength={23}
                onKeyDown={handleKeyPress} // Trigger search on Enter key
              />
              <button
                className="border p-2 cursor-pointer text-white ml-3 bg-blue-800 rounded-md hover:bg-blue-600 items-center"
                onClick={handleSearch} // Trigger search
              >
                Search
              </button>
            </div>
            {/* Pass the search criteria as a prop to ApproveTable */}
            <ApproveTableGard searchTerm={sendSearch} />
          </div>
        </div>
      ) : (
        <For4 />
      )}
    </>
  );
}

export default Gards;
