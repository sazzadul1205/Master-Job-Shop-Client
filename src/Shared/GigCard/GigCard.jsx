import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Common Button
import CommonButton from "../CommonButton/CommonButton";

// Assess
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Format budget display
const formatBudget = (min, max, currency) => {
  if (!min && !max) return "Not specified";
  if (min && !max) return `${currency}${min}+`;
  if (!min && max) return `Up to ${currency}${max}`;
  return `${currency} ${min} - ${max}`;
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

const GigCard = ({ gig, setSelectedGigID }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm p-6 bg-linear-to-bl from-white to-gray-100 hover:shadow-md transition duration-200 min-h-[250px]">
      {/* Poster Info */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={gig?.postedBy?.profileImage || DefaultUserLogo}
          alt="Client"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm text-gray-700 font-medium">
          {gig?.postedBy?.name || "Unknown Client"}
        </span>
      </div>

      {/* Gig Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{gig?.title}</h3>

      {/* Category Info */}
      <p className="text-sm text-gray-500 mb-1">
        {gig?.category} › {gig?.subCategory}
      </p>

      {/* Budget Info */}
      <p className="text-sm text-gray-600 mb-1 font-medium">
        Budget:{" "}
        <span className="text-green-700 font-semibold">
          {formatBudget(
            gig?.budget?.min,
            gig?.budget?.max,
            gig?.budget?.currency || "USD",
            gig?.budget?.isNegotiable
          )}
        </span>
      </p>

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mb-3">
        Posted: {calculateDaysAgo(gig?.postedAt)}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Link to={`/Gigs/Bidding/${gig?._id}`}>
          <CommonButton
            text="Bid Now"
            textColor="text-white"
            bgColor="blue"
            px="px-4"
            py="py-2"
            width="auto"
            className="text-sm font-medium"
          />
        </Link>

        {/* Details Button */}
        <button
          onClick={() => {
            document.getElementById("Gig_Details_Modal").showModal();
            setSelectedGigID(gig?._id);
          }}
          className="text-sm text-blue-700 hover:underline cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

GigCard.propTypes = {
  gig: PropTypes.object.isRequired,
  setSelectedGigID: PropTypes.func.isRequired,
};

export default GigCard;
