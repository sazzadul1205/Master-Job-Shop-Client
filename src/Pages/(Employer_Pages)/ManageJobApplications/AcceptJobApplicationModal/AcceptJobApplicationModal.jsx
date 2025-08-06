import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const AcceptJobApplicationModal = ({
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Error Message
  const [errorMessage, setErrorMessage] = useState("");

  // Form Control
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Submit Form
  const onSubmit = async (data) => {
    setErrorMessage("");

    // Confirm action before submitting
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to accept this application and notify the applicant.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Accept",
      cancelButtonText: "Cancel",
    });

    // If user cancels, return early
    if (!isConfirmed) return;

    // Prepare payload
    const payload = {
      status: "Accepted",
      interview: {},
    };

    // Input Data Entry
    if (data.interviewTime)
      payload.interview.interviewTime = data.interviewTime;
    if (data.mode) payload.interview.mode = data.mode;
    if (data.platform) payload.interview.platform = data.platform;
    if (data.notes) payload.interview.notes = data.notes;

    try {
      // Accepted Applicant API
      const response = await axiosPublic.put(
        `/JobApplications/Accepted/${selectedApplicationID}`,
        payload
      );

      // Handle Success
      if (response.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Application Accepted",
          text: "The applicant has been notified with interview details.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset Form
        reset();
        setSelectedApplicationID("");
        document.getElementById("Accepted_Application_Modal").close();
      } else {
        setErrorMessage("No changes were made to the application.");
      }
    } catch (err) {
      console.error("Error accepting applicant:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      id="Accepted_Application_Modal"
      className="modal-box min-w-lg relative bg-white rounded-xl shadow-xl w-full mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          setSelectedApplicationID("");
          document.getElementById("Accepted_Application_Modal").close();
        }}
        className="absolute top-3 right-3 z-50 p-2 rounded-full cursor-pointer hover:bg-gray-100"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-4">
        Accept Job Application
      </h2>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 w-full max-w-md mx-auto"
      >
        {/* Interview Date & Time */}
        <div className="flex flex-col">
          <label htmlFor="interviewTime" className="font-medium mb-1">
            Interview Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="interviewTime"
            {...register("interviewTime", {
              required: "This field is required",
            })}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.interviewTime && (
            <span className="text-red-500 text-sm mt-1">
              {errors.interviewTime.message}
            </span>
          )}
        </div>

        {/* Interview Mode */}
        <div className="flex flex-col">
          <label htmlFor="mode" className="font-medium mb-1">
            Interview Mode <span className="text-red-500">*</span>
          </label>
          <select
            id="mode"
            {...register("mode", { required: "Please select a mode" })}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Mode</option>
            <option value="Online">Online</option>
            <option value="Onsite">Onsite</option>
          </select>
          {errors.mode && (
            <span className="text-red-500 text-sm mt-1">
              {errors.mode.message}
            </span>
          )}
        </div>

        {/* Platform / Location */}
        <div className="flex flex-col">
          <label htmlFor="platform" className="font-medium mb-1">
            Interview Platform / Location{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="platform"
            placeholder="Zoom / Google Meet link or Office address"
            {...register("platform", { required: "This field is required" })}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.platform && (
            <span className="text-red-500 text-sm mt-1">
              {errors.platform.message}
            </span>
          )}
        </div>

        {/* Additional Notes */}
        <div className="flex flex-col">
          <label htmlFor="notes" className="font-medium mb-1">
            Additional Notes (optional)
          </label>
          <textarea
            id="notes"
            rows="3"
            placeholder="Any special instructions for the applicant..."
            {...register("notes")}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Accept & Notify Applicant"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Prop Vallation
AcceptJobApplicationModal.propTypes = {
  selectedApplicationID: PropTypes.string.isRequired,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default AcceptJobApplicationModal;
