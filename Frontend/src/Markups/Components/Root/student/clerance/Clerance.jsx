import { useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Importing the trigger
} from "@/components/ui/alert-dialog";
import AuthService from "../../../../../Service/AuthService";
import getAuth from "../../../../../Utilities/AuthHeader";
import moment from "moment";
// Dummy function simulating API call (replace with your actual API)

function Clerance() {
  const [userDataInContext, setUserDataInContext] = useState({});
  const [loading, setLoading] = useState(true);
  const [clearanceData, setClearanceData] = useState({
    checked: [],
    unchecked: [],
    rejectedColumns: [],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [role, setRole] = useState(""); // To hold the role value

  const getUserData = async () => {
    const findIdFromStorage = await getAuth();
    try {
      const info = await AuthService.getMy({ id: findIdFromStorage?.id });
      setUserDataInContext(info?.data);
      // console.log("first", info.data);
      const clearanceStatus = await fetchClearanceStatus();
      setClearanceData(clearanceStatus);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClearanceStatus = async () => {
    try {
      const response = await AuthService.sendTrueColumns();
      return (
        response.data || {
          checked: [],
          unchecked: [],
          rejectedColumns: [],
        }
      );
    } catch (error) {
      console.log("Error fetching clearance status:", error);
      return { checked: [], unchecked: [], rejectedColumns: [] };
    }
  };

  const openRejectionPopup = (role) => {
    // Pass the role in the form object when the "View" button is clicked
    const form = { role };
    AuthService.getClearanceRequestReason(form)
      .then((response) => {
        if (response.success) {
          setRejectionMessage(response.data.reason); // Set the rejection reason
          setShowPopup(true); // Show the popup when the rejection reason is fetched
        } else {
          setRejectionMessage("No rejection reason available.");
          setShowPopup(true);
        }
      })
      .catch((error) => {
        setRejectionMessage("Error fetching rejection reason.");
        setShowPopup(true);
      });
  };

  const closeRejectionPopup = () => {
    setShowPopup(false); // Close the popup
  };

  const PDFDocument = () => {
    const nowYear = new Date().getFullYear();
    return (
      <Document className="ml-60">
        <Page size="letter">
          <View>
            <Text className="slipHeader">JU student clearance slip</Text>
            <Text className="slipSubheader">Student Information</Text>
            <Text className="slipText">
              Name:{" "}
              {userDataInContext?.profile?.firstName +
                " " +
                userDataInContext?.profile?.lastName}
            </Text>
            <Text className="slipSubheader">
              Clearance Status: {userDataInContext?.request[0].status}
            </Text>
            {clearanceData?.checked?.map((item) => (
              <Text key={item} className="slipText">
                {item}: Cleared
              </Text>
            ))}
            {clearanceData?.unchecked?.map((item) => (
              <Text key={item} className="slipText">
                {item}: Uncleared
              </Text>
            ))}
            {clearanceData?.rejectedColumns?.map((item) => (
              <Text key={item} className="slipText">
                {item}: Rejected
              </Text>
            ))}
            <Text className="slipText">
              time :{" "}
              {moment(userDataInContext?.createdAt).format("MMM DD YYYY")}
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h3>Loading data, please wait...</h3>
      </div>
    );
  }

  if (!userDataInContext?.request?.length) {
    return (
      <div className="text-center w-full h-full flex justify-center items-center font-bold text-2xl">
        You don't have any clearance request
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 justify-center border p-6 shadow-md sm:w-[400px] md:w-[500px] lg:w-[600px] text-gray-600 mx-auto">
      <h1 className="text-2xl text-center font-bold m-3">Clearance</h1>

      {/* Student Information Section */}
      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold">Student Information</h2>
        <p>
          <strong>Name:</strong> {userDataInContext?.profile?.firstName}{" "}
          {userDataInContext?.profile?.lastName}
        </p>
        <p>
          <strong>Student ID:</strong>{" "}
          {userDataInContext?.studentProfile?.studentId}
        </p>
        <p>
          <strong>Department:</strong>{" "}
          {userDataInContext?.studentProfile?.department}
        </p>
        <p>
          <strong>Academic Year:</strong>{" "}
          {userDataInContext?.studentProfile?.academicYear}
        </p>
        {/* Add additional fields if needed */}
      </div>

      <div className="flex flex-col justify-center">
        <h4 className="text-lg font-semibold text-blue-900">
          Clearance Status
        </h4>
        <div className="flex flex-col gap-2">
          {clearanceData?.checked?.map((item) => (
            <div key={item} className="flex justify-between">
              <span>{item}:</span>
              <span className="text-green-500">Cleared</span>
            </div>
          ))}
          {clearanceData?.unchecked?.map((item) => (
            <div key={item} className="flex justify-between">
              <span>{item}:</span>
              <span className="text-gray-500">Uncleared</span>
            </div>
          ))}
          {clearanceData?.rejectedColumns?.map((item) => (
            <div key={item} className="flex justify-between items-center">
              <span>{item}:</span>
              <span className="text-red-500">Rejected</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-blue-500 border p-1 hover:scale-105 shadow-sm rounded-md cursor-pointer hover:bg-blue-100"
                    onClick={() => openRejectionPopup(item)}
                  >
                    View
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Rejection Reason</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription className="font-semibold text-lg text-gray-800">
                    {rejectionMessage}
                  </AlertDialogDescription>
                  <div className="flex gap-2 mt-4">
                    <AlertDialogCancel
                      onClick={closeRejectionPopup}
                      className="bg-gray-950 text-white p-2 rounded hover:bg-gray-800 hover:text-white justify-center  items-center"
                    >
                      Close
                    </AlertDialogCancel>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <PDFDownloadLink
            document={<PDFDocument />}
            fileName={`${userDataInContext?.profile?.firstName} ${userDataInContext?.profile?.lastName} Clearance Slip`}
          >
            {({ loading }) =>
              loading ? (
                <button className="bg-gray-200 p-2 rounded">
                  Loading PDF...
                </button>
              ) : (
                <button className="bg-[#141430] text-white p-2 rounded">
                  Download PDF
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}

export default Clerance;
