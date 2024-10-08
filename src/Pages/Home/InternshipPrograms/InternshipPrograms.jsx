import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

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
          <div className="modal-box bg-emerald-50 text-black max-w-[800px]">
            {/* Modal Content */}
            <div className="py-1">
              <div className="flex justify-between">
                {/* Internship Details */}
                <div>
                  {/* Company Name */}
                  <p className="font-bold text-2xl">
                    {selectedInternship.companyName}
                  </p>

                  {/* Position */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Position:</span>
                    {selectedInternship.position}
                  </p>

                  {/* Duration */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Duration:</span>
                    {selectedInternship.duration}
                  </p>

                  {/* Location */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Location:</span>
                    {selectedInternship.location}
                  </p>

                  {/* Stipend */}
                  <p className="text-lg py-2 leading-5">
                    <span className="font-bold pr-3">Stipend:</span>
                    {selectedInternship.stipend}
                  </p>

                  {/* Application Deadline */}
                  <p className="text-lg py-2 leading-5">
                    <span className="font-bold pr-3">
                      Application Deadline:
                    </span>
                    {selectedInternship.applicationDeadline}
                  </p>
                </div>

                {/* Company Logo */}
                {selectedInternship.companyLogo && (
                  <img
                    src={selectedInternship.companyLogo}
                    alt={`${selectedInternship.companyName} Image`}
                    className="w-60 h-60 object-cover mb-4"
                  />
                )}
              </div>

              {/* Description */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Description:</span>
                {selectedInternship.description}
              </p>

              {/* Skills Required */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Skills Required:</span>
                {selectedInternship.skillsRequired.join(", ")}
              </p>

              {/* Responsibilities */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Responsibilities:</span>
              </p>
              <ul className="list-disc list-inside">
                {selectedInternship.responsibilities.map(
                  (responsibility, i) => (
                    <li key={i}>{responsibility}</li>
                  )
                )}
              </ul>

              {/* Qualifications */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Qualifications:</span>
              </p>
              <ul className="list-disc list-inside">
                {selectedInternship.qualifications.map((qualification, i) => (
                  <li key={i}>{qualification}</li>
                ))}
              </ul>

              {/* Contact */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Contact:</span>
                <a
                  href={`mailto:${selectedInternship.contact.email}`}
                  className="text-blue-600 underline"
                >
                  {selectedInternship.contact.email}
                </a>
                {selectedInternship.contact.website && (
                  <>
                    {" | "}
                    <a
                      href={selectedInternship.contact.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Website
                    </a>
                  </>
                )}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <Link to={`/Internship/${selectedInternship._id}`}>
                <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                  Join Now
                </button>
              </Link>
              <button
                className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg font-semibold text-white"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

import PropTypes from "prop-types";

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
