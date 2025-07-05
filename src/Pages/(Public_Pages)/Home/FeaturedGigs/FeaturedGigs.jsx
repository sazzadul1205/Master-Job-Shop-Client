import { Link } from "react-router-dom";
import { useState } from "react";

// Icon
import { FaArrowRight } from "react-icons/fa";

// Packages
import PropTypes from "prop-types";

// Shared
import GigCard from "../../../../Shared/GigCard/GigCard";

// Modal
import GigDetailsModal from "./GigDetailsModal/GigDetailsModal";

const FeaturedGigs = ({ GigsData }) => {
  const [selectedGigID, setSelectedGigID] = useState(null);

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white">Featured Gigs</h2>
            <p className="text-gray-200 mt-2">
              Discover hand-picked commission-based opportunities tailored to
              skilled professionals like you.
            </p>
          </div>
          <Link
            to="/Gigs"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Gigs Card */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {GigsData.slice(0, 6).map((gig) => (
            <GigCard
              key={gig._id}
              gig={gig}
              setSelectedGigID={setSelectedGigID}
            />
          ))}
        </div>
      </div>

      {/* Gig Modal */}
      <dialog id="Gig_Details_Modal" className="modal">
        <GigDetailsModal
          selectedGigID={selectedGigID}
          setSelectedGigID={setSelectedGigID}
        />
      </dialog>
    </section>
  );
};

FeaturedGigs.propTypes = {
  GigsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      gigTitle: PropTypes.string,
      gigType: PropTypes.string,
      postedBy: PropTypes.shape({
        name: PropTypes.string,
      }),
      isRemote: PropTypes.bool,
      location: PropTypes.shape({
        city: PropTypes.string,
      }),
      budget: PropTypes.shape({
        type: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        currency: PropTypes.string,
      }),
      duration: PropTypes.string,
      postedAt: PropTypes.string,
    })
  ).isRequired,
};

export default FeaturedGigs;
