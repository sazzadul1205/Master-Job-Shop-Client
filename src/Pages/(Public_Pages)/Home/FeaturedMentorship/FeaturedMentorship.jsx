import { useState } from "react";
import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowRight } from "react-icons/fa";

// Shared
import MentorshipCard from "../../../../Shared/MentorshipCard/MentorshipCard";

// Modal
import MentorshipDetailsModal from "./MentorshipDetailsModal/MentorshipDetailsModal";

const FeaturedMentorship = ({ MentorshipData }) => {
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-20">
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
            <MentorshipCard
              key={mentorship._id}
              mentorship={mentorship}
              setSelectedMentorshipID={setSelectedMentorshipID}
            />
          ))}
        </div>
      </div>

      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
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
