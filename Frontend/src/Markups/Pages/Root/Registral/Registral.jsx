import { useEffect, useState } from "react";

import "../../Admin/Addfile/fileUpload.css";

import getAuth from "../../../../Utilities/AuthHeader";
import For4 from "../Fo4/For4";
import RegistrarPage from "../../../Components/Root/User/RegistrarPage";

function Registral() {
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

  return (
    <>
      {data && data.role === "REGISTRAR" ? (
        <>
          <RegistrarPage loinData={data} />
        </>
      ) : (
        <For4 />
      )}
    </>
  );
}

export default Registral;
