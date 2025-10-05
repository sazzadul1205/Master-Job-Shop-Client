import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const MentorSubmitTicketModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Variables
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Form Handling
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
    document.getElementById("Mentor_Submit_Ticket_Modal")?.close();
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Construct ticket payload
      const ticketData = {
        userEmail: user?.email,
        subject: data.subject,
        category: data.category,
        description: data.description,
        from: "Mentor",
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
      id="Mentor_Submit_Ticket_Modal"
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
      <h3 className="font-bold text-xl text-center mb-4">Submit a Ticket</h3>

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
            className="textarea w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide more details about your issue..."
          ></textarea>

          {/* Error */}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
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
