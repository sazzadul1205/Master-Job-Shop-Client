import PropTypes from "prop-types";

const GigCard = ({
  gigTitle,
  clientName,
  location,
  paymentRate,
  duration,
  responsibilities,
  postedDate,
}) => {
  // Function to calculate how many days ago the job was posted
  const calculateDaysAgo = (isoString) => {
    const postedDate = new Date(isoString);
    const today = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = today - postedDate;

    // Convert the time difference to days
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // If the job was posted today, return "Today"
    if (daysDiff === 0) {
      return "Today";
    }

    // Otherwise, return "X days ago"
    return `${daysDiff} days ago`;
  };
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Gig Title */}
        <p className="font-bold text-2xl">{gigTitle || "Gig Title"}</p>

        {/* Client Name */}
        <p className="text-gray-500">{clientName || "Client/Company Name"}</p>

        {/* Location */}
        <p className="text-gray-500">{location || "Location or Remote"}</p>

        {/* Payment Rate */}
        {paymentRate && (
          <p className="text-green-500">Payment Rate: {paymentRate}</p>
        )}

        {/* Gig Duration */}
        {duration && <p className="text-blue-500">Duration: {duration}</p>}

        {/* Responsibilities */}
        {responsibilities && (
          <p className="text-black">Responsibilities: {responsibilities}</p>
        )}

        {/* Posted Date */}
        {postedDate && (
          <p className="text-black">Posted: {calculateDaysAgo(postedDate)}</p>
        )}

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Apply Now
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes
GigCard.propTypes = {
  gigTitle: PropTypes.string.isRequired,
  clientName: PropTypes.string.isRequired,
  location: PropTypes.string,
  paymentRate: PropTypes.string.isRequired,
  duration: PropTypes.string,
  responsibilities: PropTypes.string,
  postedDate: PropTypes.string,
};

export default GigCard;
