import { useRef, useState } from "react";
import PropTypes from "prop-types";

// Icons
import { FaCamera } from "react-icons/fa";

// Cropper
import Cropper from "react-easy-crop";

const CompanyProfileLogoUpload = ({ preview, setPreview, setProfileImage }) => {
  const fileInputRef = useRef();

  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Triggered when a file is selected via file picker
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setShowCropper(true);
    }

    // Reset input so selecting the same file triggers onChange next time
    e.target.value = null;
  };

  // Triggered when an image is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setShowCropper(true);
    }
  };

  // Needed for drag-and-drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // When crop is complete, store the pixel area
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Helper: create cropped image blob
  const getCroppedImage = async () => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width, height } = croppedAreaPixels;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          width,
          height,
          0,
          0,
          width,
          height
        );

        canvas.toBlob((blob) => {
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);

          setPreview(imageUrl); // show cropped preview
          setProfileImage(file); // store file for upload
          setShowCropper(false);
          resolve();
        }, "image/jpeg");
      };
    });
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload area */}
      <div
        className="group w-28 h-28 rounded-full border-2 border-dashed border-gray-400 
             flex items-center justify-center mx-auto mt-3 cursor-pointer 
             transition-all duration-300 overflow-hidden bg-gray-50 
             hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <img
            src={preview}
            alt="Company Logo Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <FaCamera className="text-3xl text-gray-600 group-hover:text-blue-500 transition-colors duration-300" />
        )}
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowCropper(false)} // backdrop click closes
        >
          <div
            className="bg-gray-100 p-5 rounded-lg shadow-lg relative w-full max-w-4xl sm:w-[90%] md:w-[80%] lg:w-[60%] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // stop modal close on inner click
          >
            {/* Cropper Viewport */}
            <div className="relative w-full h-[500px] md:h-[350px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col justify-between items-center mt-6 gap-4">
              {/* Zoom Slider */}
              <div className="flex items-center">
                <label className="text-gray-700 text-sm">Zoom:</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="ml-2 w-28 sm:w-40 md:w-56"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCropper(false)}
                  className="bg-gray-500 text-white px-4 py-2 w-[100px] rounded-lg hover:bg-gray-600 cursor-pointer "
                >
                  Cancel
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    getCroppedImage();
                  }}
                  className="bg-red-500 text-white px-4 py-2 w-[100px] rounded-lg hover:bg-red-700 cursor-pointer "
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CompanyProfileLogoUpload.propTypes = {
  preview: PropTypes.string,
  setPreview: PropTypes.func.isRequired,
  setProfileImage: PropTypes.func.isRequired,
};

export default CompanyProfileLogoUpload;
