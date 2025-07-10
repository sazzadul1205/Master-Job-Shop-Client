import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Common Button
import CommonButton from "../CommonButton/CommonButton";

// Default Company Logo
import DefaultCompanyLogo from "../../assets/DefaultCompanyLogo.jpg";

// Utility: format date (basic)
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Utility: calculate how long ago published
const calculateDaysAgo = (isoDate) => {
  const posted = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
};

const EventCard = ({ event, setSelectedEventID }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm p-6 bg-gradient-to-bl from-white to-gray-100 hover:shadow-md transition duration-200 min-h-[250px]">
      {/* Organizer Info */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={event?.organizer?.logo || DefaultCompanyLogo}
          alt="Organizer"
          className="w-12 h-12 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DefaultCompanyLogo;
          }}
        />
        <span className="text-sm text-gray-700 font-medium">
          {event?.organizer?.name || "Event Host"}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-black mb-1">
        {event?.title || "Event Title"}
      </h3>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-1">
        {event?.category} › {event?.subCategory}
      </p>

      {/* Location */}
      <p className="text-sm text-gray-600 mb-1">
        Location:{" "}
        <span className="text-gray-800">
          {event?.location?.city && event?.location?.country
            ? `${event.location.city}, ${event.location.country}`
            : "Not specified"}
        </span>
      </p>

      {/* Price */}
      <p className="text-sm text-gray-600 mb-1">
        Entry Fee:{" "}
        <span className="text-green-700 font-semibold">
          {event?.price?.isFree
            ? "Free"
            : `${event.price.currency} ${event.price.standard}`}
        </span>
      </p>

      {/* Start Date */}
      <p className="text-sm text-gray-600 mb-1">
        Starts:{" "}
        <span className="text-gray-800">
          {event?.startDate ? formatDate(event.startDate) : "TBD"}
        </span>
      </p>

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mb-3">
        Published: {calculateDaysAgo(event?.publishedAt)}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Link to={`/events/${event?._id}`}>
          <CommonButton
            text="Register"
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
            document.getElementById("Event_Details_Modal").showModal();
            setSelectedEventID(event?._id);
            console.log(event?._id);
            
          }}
          className="text-sm text-blue-700 hover:underline cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Type checking
EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  setSelectedEventID: PropTypes.func.isRequired,
};

export default EventCard;
