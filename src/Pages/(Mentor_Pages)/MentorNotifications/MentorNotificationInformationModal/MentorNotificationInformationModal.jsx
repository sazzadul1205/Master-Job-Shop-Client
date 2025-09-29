import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import PropTypes from "prop-types";

const MentorNotificationInformationModal = ({
  selectedNotification,
  setSelectedNotification,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected Application Data from notification
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedApplicationData", selectedNotification?.applicationId],
    queryFn: async () => {
      if (!selectedNotification?.applicationId) return null;

      // Pick correct API endpoint
      let endpoint = "";
      if (selectedNotification?.type === "course_application") {
        endpoint = `/CourseApplications?id=${selectedNotification.applicationId}`;
      } else if (selectedNotification?.type === "mentorship_application") {
        endpoint = `/MentorshipApplications?id=${selectedNotification.applicationId}`;
      } else {
        throw new Error("Unknown notification type");
      }

      const res = await axiosPublic.get(endpoint);
      return Array.isArray(res.data) ? res.data[0] : res.data;
    },
    enabled: !!selectedNotification?.applicationId,
  });

  // UI Loading / Error
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  // Close Modal
  const handleClose = () => {
    setSelectedNotification("");
    document.getElementById("Mentor_Notification_Information_Modal")?.close();
  };

  // UI Loading / Error
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  if (selectedNotification?.type === "course_application") {
    return (
      <div
        id="Mentor_Notification_Information_Modal"
        className="modal-box bg-white rounded-2xl shadow-xl p-0 max-w-4xl w-full"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
          <h3 className="text-2xl font-semibold text-gray-800">
            Course Application Summary
          </h3>
          <button
            className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
            onClick={() => handleClose()}
          >
            <ImCross className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-6 space-y-6 text-gray-700">
          {/* Applicant Profile */}
          <div className="flex items-center gap-6 border-b pb-4">
            <img
              src={application?.profileImage}
              alt={application?.name}
              className="w-20 h-20 rounded-full border shadow-sm object-cover"
            />
            <div>
              <p className="text-gray-500 font-medium">Applicant Name</p>
              <p className="text-2xl font-bold text-gray-900">
                {application?.name}
              </p>
              <p className="text-sm text-gray-600">{application?.email}</p>
            </div>
            <div className="ml-auto">
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  application?.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : application?.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {application?.status.charAt(0).toUpperCase() +
                  application?.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 font-medium">Phone</p>
              <p className="text-gray-800">{application?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Portfolio</p>
              {application?.portfolio ? (
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {application.portfolio}
                </a>
              ) : (
                <p className="text-gray-800">N/A</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 font-medium">Applied On</p>
              <p className="text-gray-800">
                {application?.appliedAt
                  ? format(
                      new Date(application.appliedAt),
                      "dd MMM yyyy, h:mm a"
                    )
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Goals & Motivation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
              <p className="text-gray-500 font-medium mb-1">Goals</p>
              <p className="text-gray-800 whitespace-pre-wrap text-justify leading-relaxed">
                {application?.goals || "N/A"}
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
              <p className="text-gray-500 font-medium mb-1">Motivation</p>
              <p className="text-gray-800 whitespace-pre-wrap text-justify leading-relaxed">
                {application?.motivation || "N/A"}
              </p>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <p className="text-gray-500 font-medium mb-2">Payment Proof</p>
            {application?.paymentProof &&
            Object.keys(application.paymentProof).length > 0 ? (
              <pre className="text-gray-800 bg-white border rounded p-3 overflow-auto text-xs">
                {JSON.stringify(application.paymentProof, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-800">Not provided</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedNotification?.type === "mentorship_application") {
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
                  <span className="font-medium text-gray-600">
                    Receipt Link:
                  </span>
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
  }

  // If No Application Data
  if (
    !isLoading &&
    (!application || (Array.isArray(application) && application.length === 0))
  ) {
    return (
      <div
        id="Mentor_Notification_Information_Modal"
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
            We couldn’t find any Course Application details to display right
            now. Please check back later or refresh the page.
          </p>
        </div>
      </div>
    );
  }
};

// Prop Validation
MentorNotificationInformationModal.propTypes = {
  selectedNotification: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    userEmail: PropTypes.string,
    mentorId: PropTypes.string,
    type: PropTypes.oneOf(["course_application", "mentorship_application"])
      .isRequired,
    AppliedToId: PropTypes.string,
    applicationId: PropTypes.string,
    createdAt: PropTypes.string,
    read: PropTypes.bool,
  }),
  setSelectedNotification: PropTypes.func.isRequired,
};

export default MentorNotificationInformationModal;
