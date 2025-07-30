// Packages
import PropTypes from "prop-types";

// Icons
import {
  FaBriefcase,
  FaDollarSign,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Modals
import EditJobPreferenceModal from "./EditJobPreferenceModal/EditJobPreferenceModal";

const ProfileJobPreference = ({ user, refetch }) => {
  // Safely extract preferences or fallback to empty object
  const preferences = user?.preferences || {};

  // Build salary range display or fallback
  const salaryRange =
    preferences.salaryFrom && preferences.salaryTo
      ? `$${preferences.salaryFrom} - $${preferences.salaryTo}`
      : "-";

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <h2 className="text-xl font-semibold text-blue-700">Job Preferences</h2>

        {/* Edit Preferences Button */}
        <button
          onClick={() =>
            document.getElementById("Edit_Job_Preference_Modal").showModal()
          }
          className="text-sm bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Edit Preferences
        </button>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 px-4 ">
        {/* Desired Role */}
        <div className="flex items-start gap-3">
          <FaBriefcase className="text-blue-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Desired Role</p>
            <p className="font-medium">
              {preferences.desiredRole || "Not set"}
            </p>
          </div>
        </div>

        {/* Job Type */}
        <div className="flex items-start gap-3">
          <FaGlobe className="text-blue-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Expected Job Type</p>
            <p className="font-medium">{preferences.jobType || "Not set"}</p>
          </div>
        </div>

        {/* Preferred Location */}
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-blue-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Preferred Location</p>
            <p className="font-medium">
              {preferences.preferredLocation || "Not set"}
            </p>
          </div>
        </div>

        {/* Salary Range */}
        <div className="flex items-start gap-3">
          <FaDollarSign className="text-blue-600 w-5 h-5 mt-1" />
          <div>
            <p className="text-sm text-gray-500">Expected Salary Range</p>
            <p className="font-medium">{salaryRange}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="Edit_Job_Preference_Modal" className="modal">
        <EditJobPreferenceModal user={user} refetch={refetch} />
      </dialog>
    </div>
  );
};

// Prop Validation
ProfileJobPreference.propTypes = {
  user: PropTypes.shape({
    preferences: PropTypes.shape({
      desiredRole: PropTypes.string,
      jobType: PropTypes.string,
      preferredLocation: PropTypes.string,
      salaryFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      salaryTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
  refetch: PropTypes.func.isRequired,
};

export default ProfileJobPreference;
