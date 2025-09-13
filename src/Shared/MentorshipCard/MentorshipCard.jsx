import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
// Assets
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Utility: Posted Time
const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";
  const postedDate = new Date(isoString);
  const today = new Date();
  const diff = today - postedDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

const MentorshipCard = ({ mentorship, setSelectedMentorshipID }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm p-6 bg-gradient-to-bl from-white to-gray-100 hover:shadow-md transition duration-200 min-h-[280px]">
      {/* Mentor Info */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <img
          src={mentorship?.Mentor?.profileImage || DefaultUserLogo}
          alt={mentorship?.Mentor?.name || "Mentor"}
          className="w-12 h-12 rounded-full object-cover border"
        />

        {/* Name & Position */}
        <div>
          {/* Name */}
          <p className="text-sm text-gray-800 font-semibold">
            {mentorship?.Mentor?.name || "Mentor"}
          </p>
          {/* Position */}
          <p className="text-xs text-gray-500">
            {mentorship?.Mentor?.position}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-black mb-1">{mentorship?.title}</h3>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-1 capitalize">
        {mentorship?.category} › {mentorship?.subCategory}
      </p>

      {/* Duration & Sessions */}
      <p className="text-sm text-gray-600 mb-1">
        Duration:{" "}
        <span className="font-medium text-gray-800">
          {mentorship?.durationWeeks} weeks
        </span>{" "}
        | Sessions:{" "}
        <span className="font-medium text-gray-800">
          {mentorship?.sessionsPerWeek}× per week ({mentorship?.sessionLength})
        </span>
      </p>

      {/* Location */}
      <p className="text-sm text-gray-600 mb-1">
        Location:{" "}
        <span className="text-gray-800">
          {mentorship?.location?.city && mentorship?.location?.country
            ? `${mentorship.location.city}, ${mentorship.location.country}`
            : mentorship?.modeToggle
            ? "Remote"
            : "Not specified"}
        </span>
      </p>

      {/* Fee */}
      <p className="text-sm text-gray-600 mb-3">
        Fee:{" "}
        {mentorship?.fee?.isFree ? (
          <span className="text-green-600 font-semibold">Free</span>
        ) : (
          <span className="text-green-700 font-semibold">
            {mentorship?.fee?.amount} {mentorship?.fee?.currency}{" "}
            {mentorship?.fee?.negotiable ? "(Negotiable)" : ""}
          </span>
        )}
      </p>

      {/* Posted Date */}
      <p className="text-xs text-gray-400 mb-3">
        Posted: {calculateDaysAgo(mentorship?.postedAt)}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Link to={`/Mentorship/Apply/${mentorship?._id}`}>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
            data-tooltip-id={`applyTip-${mentorship?._id}`}
            data-tooltip-content="Apply To This Mentorship Program"
          >
            Apply Now
          </button>
        </Link>

        {/* Tooltip component */}
        <Tooltip
          id={`applyTip-${mentorship?._id}`}
          place="top"
          effect="solid"
        />

        <button
          onClick={() => {
            document.getElementById("Mentorship_Details_Modal")?.showModal();
            setSelectedMentorshipID(mentorship?._id);
          }}
          className="text-sm text-blue-700 hover:underline cursor-pointer"
          data-tooltip-id={`viewTip-${mentorship?._id}`}
          data-tooltip-content="View Full Mentorship Details"
        >
          View Details
        </button>

        {/* Tooltip for View Details */}
        <Tooltip id={`viewTip-${mentorship?._id}`} place="top" effect="solid" />
      </div>
    </div>
  );
};

// Prop Validation
MentorshipCard.propTypes = {
  mentorship: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    durationWeeks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sessionsPerWeek: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sessionLength: PropTypes.string,
    modeToggle: PropTypes.bool,
    postedAt: PropTypes.string,
    location: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    fee: PropTypes.shape({
      isFree: PropTypes.bool,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      currency: PropTypes.string,
      negotiable: PropTypes.bool,
    }),
    Mentor: PropTypes.shape({
      name: PropTypes.string,
      position: PropTypes.string,
      profileImage: PropTypes.string,
    }),
  }).isRequired,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default MentorshipCard;
