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

  // Fetch selected application data
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

  // UI Loading / Error
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

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
            We couldn’t find any Course Application details to display right
            now. Please check back later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  console.log(application);

  return (
    <div
      id="View_Course_Application_Modal"
      className="modal-box bg-white rounded-2xl shadow-xl p-0 max-w-4xl w-full"
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-2xl font-semibold text-gray-800">
          Course Application Summary
        </h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedApplicationID(null);
            document.getElementById("View_Course_Application_Modal").close();
          }}
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
                ? format(new Date(application.appliedAt), "dd MMM yyyy, h:mm a")
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
};

// Prop Validation
MyCourseApplicationsModal.propTypes = {
  selectedApplicationID: PropTypes.string,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default MyCourseApplicationsModal;
