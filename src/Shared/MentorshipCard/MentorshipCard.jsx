import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Assets
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Common Button
import CommonButton from "../../Shared/CommonButton/CommonButton";

// Utility: Format Budget Display
const formatBudget = (amount, currency = "USD", isNegotiable = false) => {
  if (!amount) return "Free";
  return `${currency} ${amount}${isNegotiable ? " (Negotiable)" : ""}`;
};

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
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm p-6 bg-gradient-to-bl from-white to-gray-100 hover:shadow-md transition duration-200 min-h-[250px]">
      {/* Mentor Info */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={mentorship?.mentor?.profileImage || DefaultUserLogo}
          alt="Mentor"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm text-gray-700 font-medium">
          {mentorship?.mentor?.name || "Mentor"}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-black mb-1">
        {mentorship?.title}
      </h3>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-1">
        {mentorship?.category} › {mentorship?.subCategory}
      </p>

      {/* Location */}
      <p className="text-sm text-gray-600 mb-1">
        Location:{" "}
        <span className="text-gray-800">
          {mentorship?.location?.city
            ? `${mentorship?.location?.city}, ${mentorship?.location?.country}`
            : mentorship?.isRemote
            ? "Remote"
            : "Not specified"}
        </span>
      </p>

      {/* Fee */}
      <p className="text-sm text-gray-600 mb-3">
        Fee:{" "}
        <span className="text-green-700 font-semibold">
          {formatBudget(
            mentorship?.fee?.amount,
            mentorship?.fee?.currency,
            mentorship?.fee?.isNegotiable
          )}
        </span>
      </p>

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mb-3">
        Posted: {calculateDaysAgo(mentorship?.postedAt)}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Link to={`/Mentorship/${mentorship?._id}`}>
          <CommonButton
            text="Apply Now"
            textColor="text-white"
            bgColor="blue"
            px="px-4"
            py="py-2"
            width="auto"
            className="text-sm font-medium"
          />
        </Link>

        <button
          onClick={() => {
            document.getElementById("Mentorship_Details_Modal")?.showModal();
            setSelectedMentorshipID(mentorship?._id);
          }}
          className="text-sm text-blue-700 hover:underline cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Prop Validation
MentorshipCard.propTypes = {
  mentorship: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    subCategory: PropTypes.string,
    postedAt: PropTypes.string,
    isRemote: PropTypes.bool,
    location: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    fee: PropTypes.shape({
      amount: PropTypes.number,
      currency: PropTypes.string,
      isNegotiable: PropTypes.bool,
    }),
    mentor: PropTypes.shape({
      name: PropTypes.string,
      profileImage: PropTypes.string,
    }),
  }).isRequired,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default MentorshipCard;
