import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const AcceptGigBidsModal = ({ refetch, selectedBidID, setSelectedBidID }) => {
  const axiosPublic = useAxiosPublic();

  // Error Message
  const [errorMessage, setErrorMessage] = useState("");
  const [confirming, setConfirming] = useState(false);

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
    setConfirming(false);

    // Prepare payload
    const payload = {
      status: "Accepted",
      interview: {
        interviewTime: data.interviewTime,
        platform: data.platform,
        notes: data.notes,
        mode: data.mode,
      },
    };

    try {
      // Accepted Applicant API
      const response = await axiosPublic.put(
        `/GigBids/Accepted/${selectedBidID}`,
        payload
      );

      // Handle Success
      if (response.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Bid Accepted",
          text: "The Bid has been notified with interview details.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset Form and Close Modal
        reset();
        refetch();
        setSelectedBidID("");
        document.getElementById("Accepted_Bid_Modal").close();
      } else {
        setErrorMessage("No changes were made to the Bid.");
      }
    } catch (err) {
      console.error("Error accepting Bid:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      id="Accepted_Bid_Modal"
      className="modal-box min-w-lg relative bg-white rounded-xl shadow-xl w-full mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          setSelectedBidID("");
          document.getElementById("Accepted_Bid_Modal").close();
        }}
        className="absolute top-3 right-3 z-50 p-2 rounded-full cursor-pointer hover:bg-gray-100"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-4">
        Accept Gig Bid
      </h2>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Confirming Messages */}
      {confirming && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 text-center">
          <p className="font-medium mb-2">
            Are you sure you want to accept this Bid and notify the
            applicant?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 w-[180px] rounded cursor-pointer"
            >
              Yes, Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 w-[180px] rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setErrorMessage("");
          setConfirming(true);
        }}
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
            min={new Date().toISOString().slice(0, 16)}
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
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Accept & Notify Applicant"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Prop Validation
AcceptGigBidsModal.propTypes = {
  refetch: PropTypes.func.isRequired,
  selectedBidID: PropTypes.string.isRequired,
  setSelectedBidID: PropTypes.func.isRequired,
};

export default AcceptGigBidsModal;
