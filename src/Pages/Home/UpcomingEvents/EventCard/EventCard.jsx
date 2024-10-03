import PropTypes from "prop-types";

const EventCard = ({ eventTitle, date, time, location, description }) => {
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Event Title */}
        <p className="font-bold text-2xl">{eventTitle || "Event Title"}</p>

        {/* Date and Time */}
        <p className="text-gray-500">
          {date || "Date"} at {time || "Time"}
        </p>

        {/* Location */}
        <p className="text-gray-500">{location || "Location"}</p>

        {/* Description */}
        <p className="text-gray-700 mt-2">
          {description || "Event Description"}
        </p>

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-lg font-semibold text-white">
            RSVP Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes
EventCard.propTypes = {
  eventTitle: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default EventCard;
