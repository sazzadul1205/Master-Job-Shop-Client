// Packages
import { format, formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";

const MyEventApplicationModal = ({
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Application Data
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedEventApplication", selectedApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/EventApplications?id=${selectedApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  // Loading / Error UI Handling
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  // Check if application exists
  if (!application) return null;

  return (
    <div
      id="View_Event_Applications_Modal"
      className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">
          Application Summary
        </h3>

        {/* Close Button */}
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedApplicationID(null);
            document.getElementById("View_Event_Applications_Modal").close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Profile */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <img
            src={application.profileImage}
            alt={application.name}
            className="w-20 h-20 rounded-full border object-cover"
          />

          {/* Basic Data */}
          <div>
            {/* Name */}
            <h4 className="text-lg font-semibold text-gray-800">
              {application.name}
            </h4>
            {/* Email */}
            <p className="text-sm text-gray-600">{application.email}</p>

            {/* Phone */}
            <p className="text-sm text-gray-600">{application.phone}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Attendees */}
          <Detail label="Attendees" value={application.attendees} />

          {/* Payment Type */}
          <Detail label="Payment Type" value={application.paymentType} />

          {/* Recept Number */}
          <Detail label="Receipt Number" value={application.receiptNumber} />

          {/* Agreed To Terms */}
          <Detail
            label="Agreed to Terms"
            value={application.agreeToTerms ? "Yes" : "No"}
          />

          {/* Applied At */}
          <Detail
            label="Applied At"
            value={`${format(
              new Date(application.appliedAt),
              "PPpp"
            )} (${formatDistanceToNow(new Date(application.appliedAt), {
              addSuffix: true,
            })})`}
          />

          {/* Event Id */}
          <Detail label="Event ID" value={application.eventId} />
        </div>

        {/* Motivation */}
        {application.motivation && (
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-1">
              Motivation
            </h5>
            <p className="text-gray-800">{application.motivation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Detail Component
const Detail = ({ label, value }) => (
  <div>
    {/* Label */}
    <h5 className="text-sm font-medium text-gray-500">{label}</h5>

    {/* Value */}
    <p className="text-gray-800 break-all">{value || "—"}</p>
  </div>
);

// Prop Validation - Details
Detail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Prop Validation - My Event Application Modal
MyEventApplicationModal.propTypes = {
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default MyEventApplicationModal;
