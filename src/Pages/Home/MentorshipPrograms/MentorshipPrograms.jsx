import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import PropTypes from "prop-types";
import ModalMentorShip from "../../Shared/ModalMentorShip/ModalMentorShip";

const MentorshipPrograms = ({ MentorshipData }) => {
  const [selectedMentor, setSelectedMentor] = useState(null); // State for selected mentor

  const openModal = (mentor) => {
    setSelectedMentor(mentor);
    const modal = document.getElementById("Mentor_Profiles_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Mentor_Profiles_view");
    modal.close();
    setSelectedMentor(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="flex items-center px-5">
          <div className="">
            <p className="text-5xl font-bold italic text-blue-700">
              Mentorship Programs
            </p>
            <p className="text-xl">
              Join a mentorship program to advance your skills and career.
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Mentorship"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Mentorship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {MentorshipData.slice(0, 6).map((mentor, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl"
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
                <div className="card-actions justify-end mt-5">
                  <Link to={`/Mentorship/${mentor._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                      Join Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
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

      {/* Modal */}
      <dialog id="Mentor_Profiles_view" className="modal">
        {selectedMentor && (
          <ModalMentorShip
            selectedMentor={selectedMentor}
            closeModal={closeModal}
          ></ModalMentorShip>
        )}
      </dialog>
    </div>
  );
};

// Add this at the end of your component
MentorshipPrograms.propTypes = {
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

export default MentorshipPrograms;
