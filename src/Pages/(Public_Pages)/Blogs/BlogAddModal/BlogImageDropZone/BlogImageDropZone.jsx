import { useState, useRef } from "react";

const BlogImageDropZone = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 300;

  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;

      img.onload = () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          setError(`Image must be at least ${MIN_WIDTH}x${MIN_HEIGHT}px.`);
          setPreviewImage(null);
        } else {
          setPreviewImage(e.target.result);
          setError("");
        }
      };
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
          <img
            src={previewImage}
            alt="Preview"
            className="h-[200px] object-contain"
          />
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
              Min Width: 400px X 300px
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

export default BlogImageDropZone;
