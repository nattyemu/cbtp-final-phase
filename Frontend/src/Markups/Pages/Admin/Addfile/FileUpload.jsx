import React, { useState } from "react";
import { toast } from "react-toastify";
import Papa from "papaparse"; // Library for parsing CSV files
import "./fileUpload.css";
import AuthService from "../../../../Service/AuthService";
import ClearIcon from "@mui/icons-material/Clear";
function FileUpload({ handleBackToTable }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Tracks upload state

  // Handles file selection and shows a toast message
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.info(`Selected file: ${file.name}`);
    }
  };

  // Parses CSV and transforms it into the required JSON format
  const parseCSV = async (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const formattedData = results.data.map((row) => ({
            email: row.Email,
            password: row.Password,
            role: row.Role,
            studentId: row.StudentId || null,
            faculty: row.Faculty || null,
            department: row.Department || null,
            firstName: row["First Name"],
            middleName: row["Middle Name"],
            lastName: row["Last Name"],
            sex: row.Gender.toUpperCase(),
            academicYear: row["Academic Year"] || null,
            imageUrl: row.ImageUrl || "",
            activeStatus: row.ActiveStatus?.toLowerCase() === "true",
          }));
          resolve(formattedData);
        },
        error: (error) => reject(error),
      });
    });
  };

  // Handles the file upload process
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true); // Set uploading state
      const parsedData = await parseCSV(selectedFile);

      // Send data to API
      const response = await AuthService.register(parsedData);

      if (Array.isArray(response)) {
        // Bulk upload response handling
        const successCount = response.filter((res) => res.success).length;
        const errorCount = response.length - successCount;
        handlePopTheTable();
        toast.success(
          `${successCount} users successfully registered. ${errorCount} failed.`
        );

        // Optional: Log detailed results for debugging
        response.forEach((res, index) => {
          if (!res.success) {
            console.error(`Error for record ${index + 1}:`, res.message);
          }
        });
      } else if (response?.success) {
        // Single upload response handling
        toast.success(response.message || "User registered successfully!");
        handlePopTheTable();
      } else {
        toast.error(response?.message || "File upload failed.");
      }

      setSelectedFile(null); // Clear selected file after success
    } catch (error) {
      toast.dismiss();
      console.error("Error parsing or uploading the file:", error);
      toast.error(
        error.message || "An error occurred while uploading the file."
      );
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };
  const handlePopTheTable = () => {
    handleBackToTable();
  };

  return (
    <form className="file-upload-form relative" onSubmit={handleFileUpload}>
      <ClearIcon
        onClick={handlePopTheTable}
        className="absolute top-0 hover:text-red-400 right-0 ml-[-22px] text-[#141430]"
        style={{ cursor: "pointer" }}
      />
      <label htmlFor="file" className="file-upload-label">
        <div className={`file-upload-design ${isUploading ? "uploading" : ""}`}>
          <svg viewBox="0 0 640 512" height="1em">
            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
          </svg>
          <p>Drag and Drop</p>
          <p>or</p>
          <span className="browse-button">
            {isUploading ? "Uploading..." : "Browse CSV file"}
          </span>
        </div>
        <input
          type="file"
          id="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isUploading} // Disable file input during upload
        />
      </label>
      <button
        type="submit"
        className="upload-button"
        disabled={isUploading} // Disable button during upload
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
}

export default FileUpload;
