import PropTypes from "prop-types";

const MentorshipCard = ({
  mentorName,
  expertise,
  duration,
  description,
  mentorImage,
}) => {
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Company mentorImage */}
        {mentorImage && (
          <img
            src={mentorImage}
            alt={`${mentorName} mentorImage`}
            className="w-full h-48 object-cover mb-4"
          />
        )}

        {/* Mentor Name */}
        <p className="font-bold text-2xl">{mentorName || "Mentor Name"}</p>

        {/* Expertise */}
        <p className="text-gray-500">{expertise || "Expertise Area"}</p>

        {/* Duration */}
        <p className="text-blue-500 font-semibold">
          Duration: {duration || "6 weeks"}
        </p>

        {/* Description */}
        <p className="text-black">
          {description || "Mentorship Program Description"}
        </p>

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Join Now
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

MentorshipCard.propTypes = {
  mentorImage: PropTypes.string.isRequired,
  mentorName: PropTypes.string.isRequired,
  expertise: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default MentorshipCard;
