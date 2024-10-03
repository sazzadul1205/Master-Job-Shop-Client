import PropTypes from "prop-types";

const InternshipCard = ({
  companyName,
  position,
  duration,
  description,
  companyLogo,
}) => {
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Company Logo */}
        {companyLogo && (
          <img
            src={companyLogo}
            alt={`${companyName} logo`}
            className="w-full h-48 object-cover mb-4"
          />
        )}

        {/* Company Name */}
        <p className="font-bold text-2xl">{companyName || "Company Name"}</p>

        {/* Position */}
        <p className="text-gray-500">{position || "Internship Position"}</p>

        {/* Duration */}
        <p className="text-blue-500 font-semibold">
          Duration: {duration || "8 weeks"}
        </p>

        {/* Description */}
        <p className="text-black">
          {description || "Internship Program Description"}
        </p>

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Apply Now
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

InternshipCard.propTypes = {
  companyLogo: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default InternshipCard;