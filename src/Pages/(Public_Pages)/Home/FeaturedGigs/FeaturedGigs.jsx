import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Icon
import { FaArrowRight } from "react-icons/fa";

// Packages
import PropTypes from "prop-types";

// Shared
import GigCard from "../../../../Shared/GigCard/GigCard";

// Modal
import GigDetailsModal from "./GigDetailsModal/GigDetailsModal";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedGigs = ({ GigsData }) => {
  const [selectedGigID, setSelectedGigID] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Top Commission-Based Gigs
            </h2>
            <p className="text-gray-200 text-xl mt-2">
              Unlock exclusive earning opportunities tailored for
              high-performing talent.
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
          {GigsData.slice(0, 8).map((gig, index) => (
            <div
              key={gig._id}
              data-aos="fade-up"
              data-aos-delay={index * 150} // 150ms delay between cards
            >
              <GigCard gig={gig} setSelectedGigID={setSelectedGigID} />
            </div>
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
