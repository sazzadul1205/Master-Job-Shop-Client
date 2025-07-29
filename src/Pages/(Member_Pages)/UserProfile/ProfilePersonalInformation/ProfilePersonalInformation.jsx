import PropTypes from "prop-types";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

const PersonalInformationSection = ({ user }) => {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-2">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-700">
        {/* Contact Info */}
        <div>
          <span className="font-medium text-gray-900">Email:</span>{" "}
          {user?.email || "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-900">Phone:</span>{" "}
          {user?.phone || "Not Provided"}
        </div>

        {/* Professional Details */}
        <div>
          <span className="font-medium text-gray-900">Experience Level:</span>{" "}
          {user?.experienceLevel || "Not Specified"}
        </div>
        <div>
          <span className="font-medium text-gray-900">Available From:</span>{" "}
          {user?.availability || "Not Set"}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          <FaLinkedin className="text-blue-600" />
          {user?.linkedin ? (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn Profile
            </a>
          ) : (
            <span className="text-gray-500">Not Provided</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaGithub className="text-gray-800" />
          {user?.github ? (
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub Profile
            </a>
          ) : (
            <span className="text-gray-500">Not Provided</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaGlobe className="text-green-600" />
          {user?.portfolio ? (
            <a
              href={user.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Portfolio Website
            </a>
          ) : (
            <span className="text-gray-500">Not Provided</span>
          )}
        </div>
      </div>
    </div>
  );
};

PersonalInformationSection.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    experienceLevel: PropTypes.string,
    availability: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
    portfolio: PropTypes.string,
  }).isRequired,
};

export default PersonalInformationSection;
