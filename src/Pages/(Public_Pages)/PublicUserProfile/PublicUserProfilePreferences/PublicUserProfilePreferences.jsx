// Packages
import PropTypes from "prop-types";

// Icons
import {
  FaBriefcase,
  FaDollarSign,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

const PublicUserProfilePreferences = ({ user }) => {
  // Safely extract preferences or fallback to empty object
  const preferences = user?.preferences || {};

  // Build salary range display or fallback
  const salaryRange =
    preferences.salaryFrom && preferences.salaryTo
      ? `$${preferences.salaryFrom} - $${preferences.salaryTo}`
      : "-";

  return (
    <div>
      {/* Header */}
      <h3 className="text-black font-semibold text-lg flex items-center gap-2 pb-5">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
        <span className="text-blue-700">My Preference&apos;s</span>
      </h3>

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
    </div>
  );
};

// PropTypes Validation
PublicUserProfilePreferences.propTypes = {
  user: PropTypes.shape({
    preferences: PropTypes.shape({
      desiredRole: PropTypes.string,
      jobType: PropTypes.string,
      preferredLocation: PropTypes.string,
      salaryFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      salaryTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

export default PublicUserProfilePreferences;
