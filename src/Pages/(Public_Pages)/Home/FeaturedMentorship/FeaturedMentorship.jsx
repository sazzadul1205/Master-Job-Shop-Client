import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Icons
import { FaArrowRight } from "react-icons/fa";

const FeaturedMentorship = ({ MentorshipData }) => {
  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Mentorship Programs
            </h2>
            <p className="lg:text-xl">
              Join a mentorship program to advance your skills and career.
            </p>
          </div>

          {/* Go To Button */}
          <Link
            to="/Mentorship"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Mentorship Cards Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {MentorshipData.slice(0, 6).map((mentorship) => (
            <div
              key={index}
              className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl"
            >
              <div className="card-body">
                {/* Mentor mentorImage */}
                {mentor.mentorImage && (
                  <img
                    src={mentor.mentorImage}
                    alt={`${mentor.mentorName} mentorImage`}
                    className="w-full h-48 object-cover mb-4"
                  />
                )}

                {/* Mentor Name */}
                <p className="font-bold text-2xl">
                  {mentor.mentorName || "Mentor Name"}
                </p>

                {/* Expertise */}
                <p className="text-gray-500">
                  {mentor.expertise || "Expertise Area"}
                </p>

                {/* Duration */}
                <p className="text-blue-500 font-semibold">
                  Duration: {mentor.duration || "6 weeks"}
                </p>

                {/* Description */}
                <p className="text-black">
                  {mentor.description || "Mentorship Program Description"}
                </p>

                {/* Card Actions */}
                <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                  <Link to={`/Mentorship/${mentor._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                      Join Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
                    onClick={() => openModal(mentor)}
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Add this at the end of your component
FeaturedMentorship.propTypes = {
  MentorshipData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      mentorName: PropTypes.string.isRequired,
      mentorImage: PropTypes.string,
      expertise: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      contactEmail: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      mentorBio: PropTypes.string.isRequired,
      sessionFormat: PropTypes.string.isRequired,
      languages: PropTypes.arrayOf(PropTypes.string).isRequired,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default FeaturedMentorship;
