import { useRef, useState } from "react";

// Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Icons
import { FaFileAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Assets
import AddDocument from "../../../../../assets/UserProfile/AddDocument.png";

const AddNewDocumentModal = ({ user }) => {
  const axiosPublic = useAxiosPublic();
  const fileInputRef = useRef(null);

  // Modal states
  const [error, setError] = useState(null);
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Clear states on modal close
  const handleClose = () => {
    setDocName("");
    setError(null);
    setUploading(false);
    setSelectedFile(null);
    document.getElementById("Add_New_Document_Modal")?.close();
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  // When dragging leaves the drop area, reset drag state
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  // When a file is dropped, grab the first file and set it as selected
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // When a file is selected via file input, set it as selected
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Submit document Handler
  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!docName.trim() || !selectedFile) {
      setError("Please provide both a document name and select a file.");
      return;
    }

    try {
      setUploading(true);

      // Prepare FormData
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload PDF to your backend (Cloudinary handling happens server-side)
      const res = await axiosPublic.post("/PDFUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      //
      if (!res.data?.url) throw new Error("Failed to upload document");

      // Prepare payload
      const payload = {
        name: docName.trim(),
        file: res.data.url,
        starred: false,
      };

      // Now send this payload to your AddDocument route
      await axiosPublic.put(`/Users/AddDocument/${user?._id}`, payload);

      // Success Swal alert
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Document added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Clear state & close modal after alert
      setDocName("");
      setError(null);
      setSelectedFile(null);
      document.getElementById("Add_New_Document_Modal")?.close();
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error.response?.data?.message || error.message || "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-xl shadow-lg w-full mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <div
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Modal Title */}
      <h3 className="font-bold text-2xl mb-2 text-center">Add New Document</h3>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 rounded p-2 mb-4 text-center">
          {error}
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        className={`border-4 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center p-10 mb-6 text-center transition-colors ${
          dragActive
            ? "border-blue-600 bg-blue-50"
            : "border-gray-300 hover:border-blue-300 bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Add Document Icon */}
        <div className="relative mb-4">
          <img src={AddDocument} alt="Add Document" className="w-20" />
        </div>

        {/* Drag & Drop Text */}
        <p className="text-gray-600 mb-2">Drag & drop your document here</p>
        <p className="text-gray-600 mb-4">
          or <span className="text-blue-600 underline">click to browse</span>
        </p>

        {/* File Input */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-4 w-full max-w-md bg-white border border-green-400 rounded-lg p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* File Icon */}
              <span className="text-green-600 text-xl">
                <FaFileAlt />
              </span>

              {/* File Details */}
              <div className="flex flex-col">
                {/* File Name */}
                <span className="text-sm font-medium text-gray-800">
                  {selectedFile.name}
                </span>

                {/* File Size */}
                <span className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="text-red-500 hover:text-red-700"
              title="Remove file"
            >
              <ImCross className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Document Name Input */}
      <label className="block mb-4">
        {/* Label */}
        <span className="text-gray-700 font-medium mb-1 block">
          Document Name
        </span>

        {/* Input */}
        <input
          type="text"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          placeholder="Enter document name"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        />
      </label>

      {/* Actions */}
      <div className="modal-action flex justify-end gap-4">
        <CommonButton
          clickEvent={handleSubmit}
          type="button"
          text="Submit Document"
          iconPosition="before"
          bgColor="blue"
          isLoading={uploading}
          loadingText="Submitting..."
          disabled={!docName.trim() || !selectedFile || uploading}
          width="auto"
          px="px-5"
          py="py-2"
          borderRadius="rounded-lg"
        />
      </div>
    </div>
  );
};

// Prop Validation
AddNewDocumentModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddNewDocumentModal;
