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

const MentorSubmitTicketModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Variables
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    document.getElementById("Mentor_Submit_Ticket_Modal")?.close();
    reset();
    setImagePreview(null);
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

      // Construct ticket payload
      const ticketData = {
        userEmail: user?.email,
        subject: data.subject,
        category: data.category,
        description: data.description,
        from: "Mentor",
        image: imageUrl,
        status: "Pending",
        date: new Date().toISOString(),
      };

      // Post to backend
      await axiosPublic.post("/Tickets", ticketData);

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Ticket Submitted!",
        text: "Your support ticket has been submitted successfully. Our team will get back to you soon.",
        showConfirmButton: false,
        timer: 2500,
      });

      handleClose();
    } catch (error) {
      console.error("Ticket submission failed:", error);

      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong while submitting your ticket. Please try again later.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative">
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">Submit a Ticket</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Subject */}
        <div>
          {/* Label */}
          <label className="block text-gray-700 font-semibold mb-1">
            Subject <span className="text-red-500">*</span>
          </label>

          {/* Input */}
          <input
            type="text"
            {...register("subject", { required: "Subject is required" })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Briefly describe your issue"
          />

          {/* Error */}
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          {/* Label */}
          <label className="block text-gray-700 font-semibold mb-1">
            Category <span className="text-red-500">*</span>
          </label>

          {/* Select */}
          <select
            {...register("category", {
              required: "Please select a category",
            })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Payment Issue">Payment Issue</option>
            <option value="Account Problem">Account Problem</option>
            <option value="Other">Other</option>
          </select>

          {/* Error */}
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          {/* Label */}
          <label className="block text-gray-700 font-semibold mb-1">
            Description <span className="text-red-500">*</span>
          </label>

          {/* Textarea */}
          <textarea
            rows="4"
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Provide more details about your issue..."
          ></textarea>

          {/* Error */}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
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
            {uploading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorSubmitTicketModal;
