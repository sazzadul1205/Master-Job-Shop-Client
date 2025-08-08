import { useEffect, useState } from "react";

// Packages
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaRegClock,
  FaMapMarkerAlt,
  FaStickyNote,
  FaLaptop,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

// Helper to format datetime-local value
const toLocalDateTimeString = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const ViewInternshipApplicationModal = ({
  refetch,
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();
  // Edit Mode State
  const [editMode, setEditMode] = useState(false);

  // Error Message State
  const [errorMessage, setErrorMessage] = useState("");

  // RHF Control
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Fetching Application Data
  const {
    data: application = null,
    isLoading,
    error,
    refetch: applicationRefetch,
  } = useQuery({
    queryKey: ["SelectedInternshipApplicationsData", selectedApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/InternshipApplications?id=${selectedApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  // Reset form whenever application data changes
  useEffect(() => {
    if (application?.interview) {
      const interview = application.interview;
      reset({
        interviewTime: interview.interviewTime
          ? toLocalDateTimeString(new Date(interview.interviewTime))
          : "",
        mode: interview.mode || "",
        platform: interview.platform || "",
        notes: interview.notes || "",
      });
    }
  }, [application, reset]);

  // Loading / Error UI Handling
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  // iF no Id Provided Return Null
  if (!selectedApplicationID) return null;

  // Format Interview Time
  const { interview } = application || {};
  const interviewDate = interview?.interviewTime
    ? new Date(interview.interviewTime)
    : null;

  // Format Interview Time
  const formattedInterviewTime = interviewDate
    ? format(interviewDate, "EEEE, MMMM do yyyy, h:mm a")
    : "Not Scheduled";

  // Submit Form
  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      // Prepare Payload
      const payload = {
        interview: {
          interviewTime: data.interviewTime,
          mode: data.mode,
          platform: data.platform,
          notes: data.notes,
        },
      };

      // Update Interview API
      await axiosPublic.put(
        `/InternshipApplications/Accepted/${selectedApplicationID}`,
        payload
      );

      // Success Triggered Function
      applicationRefetch();
      setEditMode(false);
      refetch();
    } catch (err) {
      console.error("Error accepting applicant:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">
          Interview Details
        </h3>

        {/* Close Button */}
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            document.getElementById("View_Interview_Modal").close();
            setSelectedApplicationID(null);
          }}
        >
          <ImCross />
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-6 py-5 space-y-5 text-gray-800"
      >
        {/* Interview Time */}
        <div className="flex items-start gap-3">
          <FaRegClock className="text-blue-500 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500">Scheduled Time</p>
            {editMode ? (
              <input
                type="datetime-local"
                {...register("interviewTime")}
                className="w-full border px-3 py-2 rounded"
                min={new Date().toISOString().slice(0, 16)}
              />
            ) : (
              <p className="font-medium">{formattedInterviewTime}</p>
            )}
          </div>
        </div>

        {/* Mode */}
        <div className="flex items-start gap-3">
          <FaLaptop className="text-blue-500 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500">Mode</p>
            {editMode ? (
              <select
                id="mode"
                {...register("mode", { required: "Please select a mode" })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
              </select>
            ) : (
              <p className="font-medium">{interview?.mode || "N/A"}</p>
            )}
          </div>
        </div>

        {/* Platform */}
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-blue-500 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500">Platform / Location</p>
            {editMode ? (
              <input
                type="text"
                {...register("platform")}
                className="w-full border px-3 py-2 rounded"
              />
            ) : (
              <p className="font-medium">{interview?.platform || "N/A"}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex items-start gap-3">
          <FaStickyNote className="text-blue-500 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500">Additional Notes</p>
            {editMode ? (
              <textarea
                {...register("notes")}
                className="w-full border px-3 py-2 rounded min-h-[100px]"
              />
            ) : (
              <p className="font-medium whitespace-pre-wrap">
                {interview?.notes || "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-right space-x-2">
          {editMode ? (
            <>
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>

              {/* Close Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            // Edit Interview Button
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded cursor-pointer"
            >
              Edit Interview
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Prop Validation
ViewInternshipApplicationModal.propTypes = {
  refetch: PropTypes.func,
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func,
};

export default ViewInternshipApplicationModal;
