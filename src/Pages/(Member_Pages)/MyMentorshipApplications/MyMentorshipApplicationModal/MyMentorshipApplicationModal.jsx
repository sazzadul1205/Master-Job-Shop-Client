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
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected Application Data
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedMentorshipApplicationsData", selectedApplicationID],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/MentorshipApplications?id=${selectedApplicationID}`
      );
      return Array.isArray(res.data) ? res.data[0] : res.data;
    },
    enabled: !!selectedApplicationID,
  });

  // Close Modal
  const handleClose = () => {
    setSelectedApplicationID("");
    document.getElementById("View_Mentorship_Application_Modal")?.close();
  };

  // If Loading
  if (isLoading) {
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  }

  // If Error
  if (error) {
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Error />
      </div>
    );
  }

  // If No Application Data
  if (
    !isLoading &&
    (!application || (Array.isArray(application) && application.length === 0))
  ) {
    return (
      <div
        id="View_Mentorship_Application_Modal"
        className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center text-center py-16">
          {/* Icon */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6 shadow-sm">
            <ImCross className="text-4xl text-gray-400" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Data Found
          </h3>

          {/* Subtitle */}
          <p className="text-gray-500 max-w-sm">
            We couldn’t find any mentorship details to display right now. Please
            check back later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="View_Mentorship_Application_Modal"
      className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full"
    >
      {/* Header with Profile Image */}
      <div className="flex items-center gap-4 border-b px-6 py-4 bg-gray-50">
        {/* Profile Image */}
        {application?.profileImage && (
          <img
            src={application.profileImage}
            alt={application?.name}
            className="w-14 h-14 rounded-full object-cover border"
          />
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">
          Application Summary
        </h3>

        {/* Close Button */}
        <button
          className="ml-auto text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => handleClose()}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-5 text-gray-800 space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Full Name */}
          <div>
            <span className="font-medium text-gray-600">Full Name:</span>
            <p className="text-gray-900">{application?.name || "N/A"}</p>
          </div>

          {/* Email */}
          <div>
            <span className="font-medium text-gray-600">Email Address:</span>
            <p className="text-gray-900">{application?.email || "N/A"}</p>
          </div>

          {/* Phone */}
          <div>
            <span className="font-medium text-gray-600">Phone Number:</span>
            <p className="text-gray-900">{application?.phone || "N/A"}</p>
          </div>

          {/* Applied At */}
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
          {/* Portfolio Link */}
          <div>
            <span className="font-medium text-gray-600">Portfolio:</span>
            {application?.portfolio ? (
              <a
                href={application.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Portfolio
              </a>
            ) : (
              <p className="text-gray-500">N/A</p>
            )}
          </div>

          {/* Resume */}
          <div>
            <span className="font-medium text-gray-600">Resume:</span>
            {application?.resumeUrl ? (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download Resume
              </a>
            ) : (
              <p className="text-gray-500">N/A</p>
            )}
          </div>
        </div>

        {/* Acknowledge */}
        {application?.acknowledge !== undefined && (
          <div className="text-sm">
            <span className="font-medium text-gray-600">
              Acknowledged Prerequisites:
            </span>
            <p className="text-gray-900">
              {application.acknowledge ? "Yes" : "No"}
            </p>
          </div>
        )}

        {/* Payment / Confirmation */}
        {(application?.receiptLink ||
          application?.transactionId ||
          application?.confirmation ||
          application?.referenceNumber) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Receipt Link */}
            {application?.receiptLink && (
              <div>
                <span className="font-medium text-gray-600">Receipt Link:</span>
                <a
                  href={application.receiptLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Receipt
                </a>
              </div>
            )}

            {/* Transaction ID */}
            {application?.transactionId && (
              <div>
                <span className="font-medium text-gray-600">
                  Transaction ID:
                </span>
                <p className="text-gray-900">{application.transactionId}</p>
              </div>
            )}

            {/* Confirmation */}
            {application?.confirmation && (
              <div>
                <span className="font-medium text-gray-600">
                  Payment Confirmation:
                </span>
                <div className="mt-2">
                  <img
                    src={application.confirmation}
                    alt="Payment Confirmation Screenshot"
                    className="w-full max-h-64 object-contain rounded-lg border"
                  />
                </div>
              </div>
            )}

            {/* Reference Number */}
            {application?.referenceNumber && (
              <div>
                <span className="font-medium text-gray-600">
                  Reference Number:
                </span>
                <p className="text-gray-900">{application.referenceNumber}</p>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {Array.isArray(application?.skills) &&
          application.skills.length > 0 && (
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
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default MyMentorshipApplicationModal;
