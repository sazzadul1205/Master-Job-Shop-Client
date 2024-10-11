import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import PropTypes from "prop-types";
import ModalInternship from "../../Shared/ModalInternship/ModalInternship";

const InternshipPrograms = ({ InternshipData }) => {
  const [selectedInternship, setSelectedInternship] = useState(null); // State for selected internship

  const openModal = (internship) => {
    setSelectedInternship(internship);
    const modal = document.getElementById("Internship_Programs_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Internship_Programs_view");
    modal.close();
    setSelectedInternship(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-300">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="flex items-center pt-20 px-5">
          <div className="">
            <p className="text-5xl font-bold italic text-blue-700">
              Internship Programs
            </p>
            <p className="text-xl">
              Explore internship opportunities to kickstart your career.
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Internship"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Internship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {InternshipData.slice(0, 3).map((internship, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
            >
              <div className="card-body">
                {/* Company Logo */}
                {internship.companyLogo && (
                  <img
                    src={internship.companyLogo}
                    alt={`${internship.companyName} logo`}
                    className="w-full h-48 object-cover mb-4"
                  />
                )}

                {/* Company Name */}
                <p className="font-bold text-2xl">
                  {internship.companyName || "Company Name"}
                </p>

                {/* Position */}
                <p className="text-gray-500">
                  {internship.position || "Internship Position"}
                </p>

                {/* Duration */}
                <p className="text-blue-500 font-semibold">
                  Duration: {internship.duration || "8 weeks"}
                </p>

                {/* Description */}
                <p className="text-black">
                  {internship.description || "Internship Program Description"}
                </p>

                {/* Card Actions */}
                <div className="card-actions justify-end mt-5">
                  <Link to={`/Internship/${internship._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                      Apply Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                    onClick={() => openModal(internship)}
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="Internship_Programs_view" className="modal">
        {selectedInternship && (
          <ModalInternship
            selectedInternship={selectedInternship}
            closeModal={closeModal}
          />
        )}
      </dialog>
    </div>
  );
};

InternshipPrograms.propTypes = {
  InternshipData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      companyName: PropTypes.string,
      companyLogo: PropTypes.string,
      position: PropTypes.string,
      duration: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.string,
      stipend: PropTypes.string,
      applicationDeadline: PropTypes.string,
      skillsRequired: PropTypes.arrayOf(PropTypes.string),
      responsibilities: PropTypes.arrayOf(PropTypes.string),
      qualifications: PropTypes.arrayOf(PropTypes.string),
      contact: PropTypes.shape({
        email: PropTypes.string.isRequired,
        website: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default InternshipPrograms;
