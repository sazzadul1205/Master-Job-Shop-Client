import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Assets
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Common Button
import CommonButton from "../CommonButton/CommonButton";

// Format budget display
const formatBudget = (min, max, currency, negotiable) => {
  if (!min && !max) return "Not specified";
  if (min && !max) return `${currency}${min}+`;
  if (!min && max) return `Up to ${currency}${max}`;
  if (min === max) return `${currency}${min}`;
  return (
    `${currency} ${min} - ${max}` +
    (negotiable ? " (Negotiable)" : "")
  );
};

// Days ago formatter
const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";
  const postedDate = new Date(isoString);
  const today = new Date();
  const diff = today - postedDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

const InternshipCard = ({ internship, setSelectedInternshipID }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm p-6 bg-gradient-to-bl from-white to-gray-100 hover:shadow-md transition duration-200 min-h-[250px]">
      {/* Poster Info */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={internship?.postedBy?.profileImage || DefaultUserLogo}
          alt="Poster"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm text-gray-700 font-medium">
          {internship?.postedBy?.name || "Client"}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-black mb-1">
        {internship.title}
      </h3>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-1">
        {internship.category} › {internship.subCategory}
      </p>

      {/* Location */}
      <p className="text-sm text-gray-600 mb-1">
        Location:{" "}
        <span className="text-gray-800">
          {internship?.location?.city
            ? `${internship.location.city}, ${internship.location.country}`
            : internship.isRemote
            ? "Remote"
            : "Not specified"}
        </span>
      </p>

      {/* Budget */}
      <p className="text-sm text-gray-600 mb-3">
        Budget:{" "}
        <span className="text-green-700 font-semibold">
          {formatBudget(
            internship.budget?.min,
            internship.budget?.max,
            internship.budget?.currency || "USD",
            internship.budget?.isNegotiable
          )}
        </span>
      </p>

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mb-3">
        Posted: {calculateDaysAgo(internship?.postedAt)}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Link to={`/Internships/${internship?._id}`}>
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
            document.getElementById("Internship_Details_Modal").showModal();
            setSelectedInternshipID(internship?._id);
          }}
          className="text-sm text-blue-700 hover:underline cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

InternshipCard.propTypes = {
  internship: PropTypes.object.isRequired,
  setSelectedInternshipID: PropTypes.func.isRequired,
};

export default InternshipCard;
