import { useRef } from "react";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaCamera } from "react-icons/fa";

const CompanyProfileLogoUpload = ({ preview, setPreview, setProfileImage }) => {
  const fileInputRef = useRef();

  // Triggered when a file is selected via file picker
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    // Only accept images
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setPreview(imageUrl); // Set preview for UI
      setProfileImage(file); // Store file for upload
    }
  };

  // Triggered when an image is dropped into the upload area
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];

    // Only accept images
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setPreview(imageUrl); // Set preview for UI
      setProfileImage(file); // Store file for upload
    }
  };

  // Needed to allow drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Opens the file picker when the upload box is clicked
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden file input (triggered by clicking the div) */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload UI area — supports both click and drag-and-drop */}
      <div
        className="w-28 h-28 rounded-full border-2 border-dashed border-gray-500 hover:border-black flex items-center justify-center mx-auto mt-3 cursor-pointer transition-colors duration-300 overflow-hidden bg-gray-50"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Show preview if selected, else show placeholder icon */}
        {preview ? (
          <img
            src={preview}
            alt="Company Logo Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaCamera className="text-3xl text-gray-700" />
        )}
      </div>
    </>
  );
};

// Define expected props and types
CompanyProfileLogoUpload.propTypes = {
  preview: PropTypes.string,
  setPreview: PropTypes.func.isRequired,
  setProfileImage: PropTypes.func.isRequired,
};

export default CompanyProfileLogoUpload;
