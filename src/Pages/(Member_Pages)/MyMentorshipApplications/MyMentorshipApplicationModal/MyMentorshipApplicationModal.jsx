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

const MyMentorshipApplicationModal = ({
  selectedMentorshipApplicationID,
  setSelectedMentorshipApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected Application Data
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "SelectedMentorshipApplicationsData",
      selectedMentorshipApplicationID,
    ],
    queryFn: () =>
      axiosPublic
        .get(`/MentorshipApplications?id=${selectedMentorshipApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedMentorshipApplicationID,
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
    <div className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800">
          Application Summary
        </h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedMentorshipApplicationID(null);
            document
              .getElementById("View_Mentorship_Application_Modal")
              .close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-5 text-gray-800 space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Full Name:</span>
            <p className="text-gray-900">{application?.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email Address:</span>
            <p className="text-gray-900">{application?.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Phone Number:</span>
            <p className="text-gray-900">{application?.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Applied At:</span>
            <p className="text-gray-900">
              {application?.appliedAt
                ? format(new Date(application.appliedAt), "PPpp")
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Resource Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Portfolio:</span>
            <p>
              <a
                href={application?.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Portfolio
              </a>
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Resume:</span>
            <p>
              <a
                href={application?.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download Resume
              </a>
            </p>
          </div>
        </div>

        {/* Skills */}
        {application?.skills?.length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-gray-600 block mb-2">
              Skills:
            </span>
            <ul className="list-disc list-inside text-gray-900">
              {application.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Motivation */}
        <div className="text-sm">
          <span className="font-medium text-gray-600 block mb-2">
            Motivation:
          </span>
          <div className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed">
            {application?.motivation || "N/A"}
          </div>
        </div>

        {/* Goals */}
        <div className="text-sm">
          <span className="font-medium text-gray-600 block mb-2">Goals:</span>
          <div className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed">
            {application?.goals || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

MyMentorshipApplicationModal.propTypes = {
  selectedMentorshipApplicationID: PropTypes.string,
  setSelectedMentorshipApplicationID: PropTypes.func.isRequired,
};

export default MyMentorshipApplicationModal;
