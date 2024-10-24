import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ModalGigDetails from "../../Shared/ModalGigDetails/ModalGigDetails";

const FeaturedGigs = ({ PostedGigsData }) => {
  const [selectedGig, setSelectedGig] = useState(null);

  const calculateDaysAgo = (dateString) => {
    const today = new Date();
    const postedDate = new Date(dateString);
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const openModal = (gig) => {
    setSelectedGig(gig);
    const modal = document.getElementById("View_FeaturedGigs_Details");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("View_FeaturedGigs_Details");
    modal.close();
    setSelectedGig(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center pt-20 px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-4xl md:text-5xl font-bold italic text-blue-700">
              Featured Gigs
            </p>
            <p className="lg:text-xl">
              Explore high-potential commission-based opportunities to boost
              your career and earnings.
            </p>
          </div>
          <button className="mt-4 md:mt-0 md:ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Gigs"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Gig Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 px-5 lg:px-0">
          {PostedGigsData.slice(0, 6).map((gig, index) => (
            <div
              key={index}
              className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl"
            >
              <div className="card-body">
                <p className="font-bold text-2xl">
                  {gig.gigTitle || "Gig Title"}
                </p>
                {gig.gigType && (
                  <p className="text-red-500">Gig Type: {gig.gigType}</p>
                )}
                <p className="text-gray-500">
                  {gig.clientName || "Client/Company Name"}
                </p>
                <p className="text-gray-500">
                  {gig.location || "Location or Remote"}
                </p>
                {gig.paymentRate && (
                  <p className="text-green-500">
                    Payment Rate: {gig.paymentRate}
                  </p>
                )}
                {gig.duration && (
                  <p className="text-blue-500">Duration: {gig.duration}</p>
                )}
                {gig.postedDate && (
                  <p className="text-black">
                    Posted: {calculateDaysAgo(gig.postedDate)}
                  </p>
                )}

                {/* Card Actions */}
                <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                  <Link to={`/PostedGigsDetails/${gig._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                      Bid Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
                    onClick={() => openModal(gig)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="View_FeaturedGigs_Details" className="modal">
        {selectedGig && (
          <ModalGigDetails selectedGig={selectedGig} closeModal={closeModal} />
        )}
      </dialog>
    </div>
  );
};

FeaturedGigs.propTypes = {
  PostedGigsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      gigTitle: PropTypes.string,
      gigType: PropTypes.string,
      clientName: PropTypes.string,
      location: PropTypes.string,
      paymentRate: PropTypes.string,
      duration: PropTypes.string,
      postedDate: PropTypes.string,
      responsibilities: PropTypes.string,
      requiredSkills: PropTypes.string,
      workingHours: PropTypes.string,
      projectExpectations: PropTypes.string,
      communication: PropTypes.string,
      additionalBenefits: PropTypes.string,
      rating: PropTypes.number,
    })
  ).isRequired,
};

export default FeaturedGigs;
