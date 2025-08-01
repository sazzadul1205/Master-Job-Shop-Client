import { useState } from "react";

// Packages
import PropTypes from "prop-types";

const PublicUserProfileSkills = ({ user }) => {
  // State Management
  const [skills] = useState(user?.skills || []);

  return (
    <div>
      {/* Header */}
      <h3 className="text-black font-semibold text-lg flex items-center gap-2 pb-5">
        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
        <span className="text-blue-700">My Skill&apos;s</span>
      </h3>

      {/* Skill list */}
      {skills.length > 0 ? (
        // Display skills if any
        <div className="flex flex-wrap gap-3 mb-4">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm border border-blue-300 cursor-pointer"
            >
              <span className="font-medium hover:text-blue-500">{skill}</span>
            </div>
          ))}
        </div>
      ) : (
        // Fallback when no skills
        <div className="flex items-center gap-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 mb-4">
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75h4.5v4.5h-4.5z M4.5 4.5h15v15h-15z"
            />
          </svg>

          {/* Content */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">
              No skills available
            </p>
            <p className="text-sm text-gray-500">
              This user hasn&apos;t listed any skills publicly on their profile.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes Validation
PublicUserProfileSkills.propTypes = {
  user: PropTypes.shape({
    skills: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default PublicUserProfileSkills;
