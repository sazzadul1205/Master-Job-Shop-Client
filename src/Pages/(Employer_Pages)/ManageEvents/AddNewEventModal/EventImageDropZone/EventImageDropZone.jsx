import { useRef, useState } from "react";
import PropTypes from "prop-types";

const EventImageDropZone = ({ previewImage, setPreviewImage }) => {
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const MIN_WIDTH = 1200;
  const MIN_HEIGHT = 500;

  const handleImageUpload = (file) => {
    // Reset error state for new upload
    setError("");

    if (!file) {
      setError("No file selected.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Invalid file type. Only image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          setError(
            `Image too small. Required: ${MIN_WIDTH}x${MIN_HEIGHT}px. Provided: ${img.width}x${img.height}px.`
          );
          setPreviewImage(null);
        } else {
          setPreviewImage(e.target.result);
          setError("");
        }
      };
      img.onerror = () => {
        setError("Failed to load image. The file might be corrupted.");
        setPreviewImage(null);
      };
      img.src = e.target.result;
    };

    reader.onerror = () => {
      setError("File reading failed. Try another image.");
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleImageUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <label className="font-medium text-sm mb-1" htmlFor="title">
        Upload Banner Image:
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        className="h-[300px] w-full border-2 border-dashed border-gray-500 hover:border-black flex flex-col items-center justify-center cursor-pointer transition"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {previewImage ? (
          <div className="relative group w-full flex justify-center p-0 h-[300px] overflow-hidden">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gray-500/20 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
              <div className="bg-gray-200 p-4 border-2 border-dashed border-gray-500 rounded-full">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/126/126477.png"
                  alt="Overlay Icon"
                  className="w-[50px] opacity-80"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-200 p-5 border-2 border-dashed border-gray-500 hover:border-black rounded-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/126/126477.png"
                alt="Placeholder"
                className="w-[80px] object-contain opacity-70"
              />
            </div>
            <h3 className="pt-5 font-semibold text-gray-700">
              Min Width: {MIN_WIDTH}px X {MIN_HEIGHT}px
            </h3>
            <p className="text-sm text-gray-500">
              Click or drag & drop to upload
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </>
  );
};

EventImageDropZone.propTypes = {
  previewImage: PropTypes.string,
  setPreviewImage: PropTypes.func.isRequired,
};

export default EventImageDropZone;
