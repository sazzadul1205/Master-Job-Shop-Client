import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";
import { FaCloudUploadAlt } from "react-icons/fa";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const MentorReportIssueModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Variables
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Form Handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Close modal
  const handleClose = () => {
    document.getElementById("Mentor_Report_Issue_Modal")?.close();
    setImagePreview(null);
    setServerError("");
    reset();
  };

  // Image Drag & Drop or Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setUploading(true);
      setServerError(""); // Reset error

      let imageUrl = null;

      // Upload image if provided
      if (data.image) {
        const formData = new FormData();
        formData.append("image", data.image);

        const uploadRes = await fetch(Image_Hosting_API, {
          method: "POST",
          body: formData,
        });

        const imgData = await uploadRes.json();
        if (imgData.success) {
          imageUrl = imgData.data.display_url;
        }
      }

      // Construct ticket payload matching server requirements
      const ticketData = {
        userEmail: user?.email,
        errorType: data.errorType,
        errorDescription: data.errorDescription,
        from: "Mentor",
        image: imageUrl,
        date: new Date().toISOString(),
      };

      // Post to backend
      await axiosPublic.post("/BugReport", ticketData);

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Report Submitted!",
        text: "Your issue or bug report has been sent successfully. Our technical team will review it and respond soon.",
        showConfirmButton: false,
        timer: 2500,
      });

      handleClose();
    } catch (error) {
      console.error("Bug report submission failed:", error);

      // Show server error in form instead of Swal
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again later.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      id="Mentor_Report_Issue_Modal"
      className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">Report Issues</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Server Error Message */}
      {serverError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-red-500 font-semibold mb-3 text-center">
            {serverError}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Error Type */}
        <div>
          {/* Label */}
          <label className="block text-gray-700 font-semibold mb-1">
            Error Type <span className="text-red-500">*</span>
          </label>

          {/* Input */}
          <input
            type="text"
            {...register("errorType", { required: "Error Type is required" })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Briefly describe your issue"
          />

          {/* Error */}
          {errors.errorType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.errorType.message}
            </p>
          )}
        </div>

        {/* Error Description */}
        <div>
          {/* Label */}
          <label className="block text-gray-700 font-semibold mb-1">
            Error Description <span className="text-red-500">*</span>
          </label>

          {/* Textarea */}
          <textarea
            rows="4"
            {...register("errorDescription", {
              required: "Error Description is required",
            })}
            className="textarea w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide more details about your issue..."
          ></textarea>

          {/* Error */}
          {errors.errorDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.errorDescription.message}
            </p>
          )}
        </div>

        {/* Drag & Drop Image Upload */}
        <div
          className="border-2 border-dashed rounded-lg p-5 text-center hover:bg-gray-50 cursor-pointer"
          onClick={() => document.getElementById("ticketImageInput")?.click()}
        >
          {/* Hidden Input */}
          <input
            id="ticketImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />

          {/* Image Preview */}
          {imagePreview ? (
            <div className="relative inline-block">
              {/* Preview */}
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 mx-auto rounded-lg object-cover"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                <ImCross />
              </button>
            </div>
          ) : (
            // Placeholder
            <div className="flex flex-col items-center text-gray-500">
              {/* Icons */}
              <FaCloudUploadAlt className="text-4xl mb-2 text-blue-500" />

              {/* Text */}
              <p>
                <span className="text-blue-600 font-semibold">
                  Click to upload
                </span>{" "}
                or drag and drop an image
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-3">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 font-semibold cursor-pointer"
          >
            Cancel
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`px-5 py-2 rounded-lg font-semibold text-white cursor-pointer ${
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Submitting..." : "Submit Issue / Bug"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorReportIssueModal;
