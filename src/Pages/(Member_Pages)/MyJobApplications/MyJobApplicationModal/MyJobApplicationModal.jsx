// Packages
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

const MyJobApplicationModal = ({
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected application
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedJobApplicationsData", selectedApplicationID?._id],
    queryFn: () =>
      axiosPublic
        .get(`/JobApplications?id=${selectedApplicationID?._id}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  // UI Loading / Error State
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  return (
    <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">
          Job Application Details
        </h3>

        {/* Close Button */}
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedApplicationID(null);
            document.getElementById("View_Application_Modal").close();
          }}
        >
          <ImCross />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-5 text-sm text-gray-700 space-y-4">
        {/* Applicant Overview */}
        <div className="flex items-center gap-4">
          {/* Profile image */}
          <img
            src={application?.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h4 className="text-lg font-semibold">{application?.name}</h4>
            <p className="text-gray-500">{application?.email}</p>
            <p className="text-gray-500">
              {application?.phone?.startsWith("880")
                ? `+${application.phone}`
                : application?.phone}
            </p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">
              {application?.dob
                ? format(new Date(application?.dob), "MMMM dd, yyyy")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Applied On</p>
            <p className="font-medium">
              {application?.appliedAt
                ? format(
                    new Date(application?.appliedAt),
                    "MMMM dd, yyyy HH:mm a"
                  )
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Resume / Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-gray-500">Resume</p>
            <a
              href={application?.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 font-medium"
            >
              View Resume
            </a>
          </div>
          <div>
            <p className="text-gray-500">Portfolio</p>
            {application?.portfolio ? (
              <a
                href={application?.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 font-medium"
              >
                Visit Portfolio
              </a>
            ) : (
              <p className="text-gray-400 italic">Not Provided</p>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="mt-4">
          <p className="text-gray-500 mb-1">Cover Letter</p>
          {application?.coverLetter ? (
            <p className="whitespace-pre-line border p-3 rounded text-gray-800 bg-gray-50">
              {application?.coverLetter}
            </p>
          ) : (
            <p className="italic text-gray-400">No cover letter submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Prop Validation
MyJobApplicationModal.propTypes = {
  selectedApplicationID: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default MyJobApplicationModal;
