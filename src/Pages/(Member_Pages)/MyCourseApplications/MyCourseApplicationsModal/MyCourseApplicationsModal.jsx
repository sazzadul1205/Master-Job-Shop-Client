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
  selectedCourseApplicationID,
  setSelectedCourseApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected application data
  const {
    data: application = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedCourseApplications", selectedCourseApplicationID],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications?id=${selectedCourseApplicationID}`)
        .then((res) => res.data),
    enabled: !!selectedCourseApplicationID,
  });

  // UI Loading / Error
  if (isLoading)
    return (
      <div className="modal-box bg-white rounded-xl shadow-md p-0 max-w-3xl">
        <Loading />
      </div>
    );
  if (error) return <Error />;

  return (
    <div className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800">
          Course Application Summary
        </h3>
        <button
          className="text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={() => {
            setSelectedCourseApplicationID(null);
            document.getElementById("View_Course_Application_Modal").close();
          }}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Applicant Name */}
          <div>
            <p className="text-gray-500 font-medium">Applicant Name</p>
            <p className="text-gray-800">{application?.applicantName}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-500 font-medium">Email</p>
            <p className="text-gray-800">{application?.email}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-500 font-medium">Application Status</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                application?.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : application?.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {application?.status}
            </span>
          </div>

          {/* Applied Date */}
          <div>
            <p className="text-gray-500 font-medium">Applied On</p>
            <p className="text-gray-800">
              {application?.appliedAt
                ? format(new Date(application.appliedAt), "dd MMM yyyy, h:mm a")
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Motivation */}
        <div>
          <p className="text-gray-500 font-medium">Motivation</p>
          <p className="text-gray-800 whitespace-pre-wrap text-justify leading-relaxed border rounded p-3 bg-gray-50">
            {application?.motivation}
          </p>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
MyCourseApplicationsModal.propTypes = {
  selectedCourseApplicationID: PropTypes.string,
  setSelectedCourseApplicationID: PropTypes.func.isRequired,
};

export default MyCourseApplicationsModal;
