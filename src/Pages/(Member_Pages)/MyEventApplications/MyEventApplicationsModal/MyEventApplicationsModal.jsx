// Packages
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { format } from "date-fns";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";

const MyEventApplicationsModal = ({
  selectedEventApplicationID,
  setSelectedEventApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected application data
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedEventApplications", selectedEventApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/EventApplications?id=${selectedEventApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedEventApplicationID,
  });

  // UI Loading / Error
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  const formattedDate = application?.appliedAt
    ? format(new Date(application?.appliedAt), "dd MMM yyyy, hh:mm a")
    : "N/A";

  return (
    <div className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800">
          Event Application Summary
        </h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedEventApplicationID(null);
            document.getElementById("View_Event_Application_Modal").close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-6 space-y-4 text-sm text-gray-700">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Full Name:</span>
            <p>{application?.name}</p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p>{application?.email}</p>
          </div>
          <div>
            <span className="font-medium">Phone:</span>
            <p>{application?.phone}</p>
          </div>
          <div>
            <span className="font-medium">Attendance Type:</span>
            <p className="capitalize">{application?.attendanceType}</p>
          </div>
          <div>
            <span className="font-medium">Number of Attendees:</span>
            <p>{application?.attendees}</p>
          </div>
          <div>
            <span className="font-medium">Application Time:</span>
            <p>{formattedDate}</p>
          </div>
          <div>
            <span className="font-medium">Agreed to Terms:</span>
            <p>{application?.agreeTerms ? "✅ Yes" : "❌ No"}</p>
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <span className="font-medium block mb-1">Special Requirements:</span>
          <div className="bg-gray-100 rounded p-3 max-h-40 overflow-y-auto border border-gray-200 whitespace-pre-wrap">
            {application?.specialRequirements || "None provided."}
          </div>
        </div>
      </div>
    </div>
  );
};

MyEventApplicationsModal.propTypes = {
  selectedEventApplicationID: PropTypes.string,
  setSelectedEventApplicationID: PropTypes.func.isRequired,
};

export default MyEventApplicationsModal;
