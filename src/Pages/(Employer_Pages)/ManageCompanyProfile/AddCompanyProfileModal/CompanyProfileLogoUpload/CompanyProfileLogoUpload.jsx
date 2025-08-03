import { useRef } from "react";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaCamera } from "react-icons/fa";

const CompanyProfileLogoUpload = ({ preview, setPreview }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="w-28 h-28 rounded-full border-2 border-dashed border-gray-500 hover:border-black flex items-center justify-center mx-auto mt-3 cursor-pointer transition-colors duration-300 overflow-hidden bg-gray-50"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
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

// Prop Validation
CompanyProfileLogoUpload.propTypes = {
  preview: PropTypes.string,
  setPreview: PropTypes.func.isRequired,
};

export default CompanyProfileLogoUpload;
