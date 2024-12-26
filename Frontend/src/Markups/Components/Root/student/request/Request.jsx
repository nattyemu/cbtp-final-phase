import { useContext, useState } from "react";
import "./request.css";
import AuthService from "../../../../../Service/AuthService";
import { toast } from "react-toastify";
function Request() {
  const [isError, setIsError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // const handleReasonChange = (event) => {
  //   const reason = event.target.value;
  //   setSelectedReason(reason);
  //   setShowDescription(reason === "other");
  // };

  const [form, setForm] = useState({
    semester: "",
    reason: "",
  });
  const [showDescription, setShowDescription] = useState(false);
  const handleRequest = async (e) => {
    e.preventDefault();
    console.log(form);

    try {
      const response = await AuthService.request(form);
      if (response?.success) {
        toast.success(response.message);
        // console.log(response);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error during request");
    }
  };

  return (
    <div className="flex justify-center my-20  mx-60 shadow-md rounded-lg  w-[500px] border-[#141430]">
      <div className=" w-full">
        <h2 className="flex justify-center text-lg mx-5 my-4 font-bold sm:text-[18px] md:text-[22px] lg:text-[25px]">
          Request Clearance Form
        </h2>
        <form onSubmit={handleSubmit} className="m-2 p-4 ">
          <div className="flex justify-center flex-col gap-0 p-3">
            <div className="p-3 flex flex-col gap-2">
              <label
                htmlFor="semester"
                className="sm:text-[16px] md:text-[18px] lg:text-[21px]"
              >
                Select Semester
              </label>
              <input
                type="text"
                name="semester"
                id="semester"
                maxLength={22}
                className="input-field p-4 rounded-md outline-none "
                placeholder="Enter semester"
                onChange={(e) => {
                  setForm({
                    ...form,
                    semester: e.target.value,
                  });
                }}
              />
            </div>
            <div
              className="p-3 flex flex-col gap-2
            "
            >
              <label
                htmlFor="reason"
                className="sm:text-[16px] md:text-[18px] lg:text-[21px]"
              >
                Select Reason
              </label>
              <input
                name="reason"
                id="reason"
                placeholder="Enter reason"
                onChange={(e) => {
                  setForm({
                    ...form,
                    reason: e.target.value,
                  });
                }}
                className="select-field my-2 p-4 rounded-md outline-none"
              />
            </div>
            <p id="error" className="error-message">
              {isError && "Please fill in all fields"}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="reset"
              value="Reset"
              onClick={() => {
                setIsError(false);
                setShowDescription(false);
              }}
              className="reset-button  rounded-md bg-red-700 hover:bg-red-600 text-white p-3"
            />
            <input
              onClick={handleRequest}
              type="submit"
              value="Request"
              className=" bg-[#141430] text-white  rounded-md"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Request;
