import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const MentorSuggestImprovementModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Variables
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Close modal
  const handleClose = () => {
    reset();
    setPreview(null);
    setServerError("");
    document.getElementById("Mentor_Suggest_Improvement_Modal")?.close();
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let imageUrl = null;

      // Upload image if provided
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        const res = await fetch(Image_Hosting_API, {
          method: "POST",
          body: formData,
        });
        const imgData = await res.json();
        if (imgData.success) imageUrl = imgData.data.display_url;
      }

      // Build payload
      const suggestionData = {
        userEmail: user?.email,
        title: data.title,
        category: data.category,
        description: data.description,
        image: imageUrl,
        from: "Mentor",
        type: "Improvement Suggestion",
        date: new Date().toISOString(),
      };

      // Send to backend
      await axiosPublic.post("/ImprovementSuggestions", suggestionData);

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Suggestion Submitted!",
        text: "Thank you for your feedback! Our team will review your suggestion soon.",
        showConfirmButton: false,
        timer: 2500,
      });

      handleClose();
    } catch (error) {
      // Error Alert
      console.error("Suggestion submission failed:", error);
      // Instead of Swal, show error in form
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
      id="Mentor_Suggest_Improvement_Modal"
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
      <h3 className="font-bold text-xl text-center mb-4">
        Suggest an Improvement
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-green-600 mb-6" />

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
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suggestion Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Add Dark Mode or Improve Dashboard UI"
            {...register("title", { required: "Title is required" })}
            className="input input-bordered bg-white border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="select select-bordered bg-white border border-gray-300  w-full rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>
              Select a category
            </option>
            <option>Feature Suggestion</option>
            <option>UI/UX Enhancement</option>
            <option>Performance Improvement</option>
            <option>Accessibility Improvement</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows="5"
            placeholder="Describe your suggestion or improvement idea in detail..."
            className="textarea textarea-bordered bg-white border border-gray-300  w-full rounded-lg focus:ring-2 focus:ring-green-500"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Supporting Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImageChange}
            className="file-input file-input-bordered bg-white border border-gray-300  w-full rounded-lg cursor-pointer"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 rounded-lg shadow-md w-40 h-40 object-cover mx-auto border"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer "
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-70 cursor-pointer "
          >
            {uploading ? "Submitting..." : "Submit Suggestion"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorSuggestImprovementModal;
