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

// Shared
import FormInput from "../../../../../Shared/FormInput/FormInput";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const MentorSuggestImprovementModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Variables
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

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
    setServerError("");
    setImagePreview(null);
    document.getElementById("Mentor_Suggest_Improvement_Modal")?.close();
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      setUploading(true);
      setServerError("");

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
        <FormInput
          label="Suggestion Title"
          required
          placeholder="e.g. Add Dark Mode or Improve Dashboard UI"
          register={register("title", { required: "Title is required" })}
          error={errors.title}
        />

        {/* Category */}
        <FormInput
          label="Category"
          required
          as="select"
          placeholder="Select a category"
          register={register("category", { required: "Category is required" })}
          error={errors.category}
          options={[
            { value: "Feature Suggestion", label: "Feature Suggestion" },
            { value: "UI/UX Enhancement", label: "UI/UX Enhancement" },
            {
              value: "Performance Improvement",
              label: "Performance Improvement",
            },
            {
              value: "Accessibility Improvement",
              label: "Accessibility Improvement",
            },
          ]}
        />

        {/* Description */}
        <FormInput
          label="Detailed Description"
          required
          as="textarea"
          rows={5}
          placeholder="Describe your suggestion or improvement idea in detail..."
          register={register("description", {
            required: "Description is required",
          })}
          error={errors.description}
        />

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

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                <ImCross />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <FaCloudUploadAlt className="text-4xl mb-2 text-blue-500" />
              <p>
                <span className="text-blue-600 font-semibold">
                  Click to upload
                </span>{" "}
                or drag and drop an image
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer "
          >
            Cancel
          </button>

          {/* Submit Button */}
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
