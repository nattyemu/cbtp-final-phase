import { useState } from "react";
import "./request.css";
import AuthService from "../../../../../Service/AuthService";
import { toast } from "react-toastify";

function Request() {
  const [isError, setIsError] = useState(false);
  const [form, setForm] = useState({
    semester: "",
    reason: "",
  });

  const handleRequest = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.semester || !form.reason) {
      setIsError(true);
      return;
    }

    setIsError(false); // Clear error if inputs are valid
    console.log(form);

    try {
      const response = await AuthService.request(form);
      if (response?.success) {
        toast.success(response.message);
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
        <form onSubmit={handleRequest} className="m-2 p-4">
          <div className="flex justify-center flex-col gap-0 p-3">
            {/* Select Semester */}
            <div className="p-3 flex flex-col gap-2">
              <label
                htmlFor="semester"
                className="sm:text-[16px] md:text-[18px] lg:text-[21px]"
              >
                Select Semester
              </label>
              <select
                name="semester"
                id="semester"
                className="input-field p-4 rounded-md outline-none"
                onChange={(e) =>
                  setForm({
                    ...form,
                    semester: e.target.value,
                  })
                }
                value={form.semester}
              >
                <option value="" disabled>
                  Select Semester
                </option>
                <option value="1st semester">1st Semester</option>
                <option value="2nd semester">2nd Semester</option>
              </select>
            </div>

            {/* Select Reason */}
            <div className="p-3 flex flex-col gap-2">
              <label
                htmlFor="reason"
                className="sm:text-[16px] md:text-[18px] lg:text-[21px]"
              >
                Select Reason
              </label>
              <select
                name="reason"
                id="reason"
                className="select-field my-2 p-4 rounded-md outline-none"
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                value={form.reason}
              >
                <option value="" disabled>
                  Select Reason
                </option>
                <option value="semester breaks">Semester Breaks</option>
                <option value="withdrawals">Withdrawals</option>
                <option value="emergency situations">
                  Emergency Situations
                </option>
              </select>
            </div>

            {/* Error Message */}
            <p id="error" className="error-message text-red-600">
              {isError && "Please fill in both fields before submitting."}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="reset"
              value="Reset"
              onClick={() => {
                setForm({ semester: "", reason: "" });
                setIsError(false);
              }}
              className="reset-button rounded-md bg-red-700 hover:bg-red-600 text-white p-3"
            />
            <input
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
