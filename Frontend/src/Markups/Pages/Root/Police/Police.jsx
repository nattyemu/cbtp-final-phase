import React, { useEffect, useState } from "react";
import getAuth from "../../../../Utilities/AuthHeader";
import UserPage from "../../../Components/Root/User/UserPage";
import For4 from "../Fo4/For4";

function Police() {
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
  return (
    <>
      {data && data.role === "POLICE" ? <UserPage loinData={data} /> : <For4 />}
    </>
  );
}

export default Police;
