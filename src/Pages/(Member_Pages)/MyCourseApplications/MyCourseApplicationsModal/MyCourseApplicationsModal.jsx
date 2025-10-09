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

const MyCourseApplicationsModal = ({
  selectedApplicationID,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // -------- Get Selected Course Application API --------
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedCourseApplications", selectedApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications?id=${selectedApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedApplicationID,
  });

  // Close Modal
  const handleClose = () => {
    setSelectedApplicationID("");
    document.getElementById("View_Course_Application_Modal")?.close();
  };

  // Loading states
  if (isLoading)
    return (
      <div
        id="Edit_Mentorship_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (error)
    return (
      <div
        id="Edit_Mentorship_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => handleClose()}
          className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>

        {/* Error Component inside modal */}

        <Error height="min-h-[60vh]" />
      </div>
    );

  // If No Application Data
  if (
    !isLoading &&
    (!application || (Array.isArray(application) && application.length === 0))
  ) {
    return (
      <div
        id="View_Course_Application_Modal"
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
            We couldn’t find any Mentorship details to display right now. Please
            check back later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="View_Course_Application_Modal"
      className="modal-box bg-white rounded-xl shadow-lg h-[80vh] p-0 max-w-3xl w-full"
    >
      {/* Header with Profile Image */}
      <div className="flex items-center gap-4 border-b px-6 py-4 bg-gray-50">
        {/* Profile Image */}
        <img
          src={application?.profileImage || "https://via.placeholder.com/56"}
          alt={application?.name || "Profile"}
          className="w-14 h-14 rounded-full object-cover border"
        />

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

          {/* Phone Number */}
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

        {/* Portfolio and Resume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Portfolio */}
          <div className="flex items-center text-sm gap-5">
            <span className="font-medium text-gray-600">Portfolio:</span>
            <div>
              {application?.portfolio ? (
                <a
                  href={application.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Portfolio
                </a>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
          </div>

          {/* Resume */}
          <div className="flex items-center text-sm gap-5">
            <span className="font-medium text-gray-600">Resume:</span>
            <div>
              {application?.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Download Resume
                </a>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <p className="h-[3px] w-full bg-gray-200" />

        {/* Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Receipt Link */}
          {application?.receiptLink && (
            <div className="flex items-center text-sm gap-5">
              <span className="font-medium text-gray-600">Receipt Link:</span>
              <a
                href={application.receiptLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Receipt
              </a>
            </div>
          )}

          {/* Transaction ID */}
          {application?.transactionId && (
            <div>
              <span className="font-medium text-gray-600">Transaction ID:</span>
              <p className="text-gray-900">{application.transactionId}</p>
            </div>
          )}

          {/* Payment Confirmation Screenshot */}
          {application?.confirmationScreenshot && (
            <div>
              <span className="font-medium text-gray-600">
                Payment Confirmation Screenshot:
              </span>
              <img
                src={application.confirmationScreenshot}
                alt="Payment Confirmation"
                className="w-full max-h-64 object-contain rounded-lg border mt-2"
              />
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

          {/* Payment Link */}
          {application?.paymentLink && (
            <div className="flex items-center text-sm gap-5">
              <span className="font-medium text-gray-600">Payment Link:</span>
              <a
                href={application.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Go to Payment
              </a>
            </div>
          )}
        </div>

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

// Prop Validation
MyCourseApplicationsModal.propTypes = {
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default MyCourseApplicationsModal;
