import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowRight } from "react-icons/fa";

// Shared
import InternshipCard from "../../../../Shared/InternshipCard/InternshipCard";

// Modals
import InternshipDetailsModal from "./InternshipDetailsModal/InternshipDetailsModal";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedInternships = ({ InternshipData }) => {
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Internship Opportunities
            </h2>
            <p className="lg:text-xl text-gray-200">
              Connect with industry leaders and build valuable experience early
              in your journey.
            </p>
          </div>

          {/* Go To Button */}
          <Link
            to="/Internships"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Internship Cards Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {InternshipData.slice(0, 6).map((internship, index) => (
            <div
              key={internship._id}
              data-aos="fade-up"
              data-aos-delay={index * 150} // 150ms delay between cards
            >
              <InternshipCard
                internship={internship}
                setSelectedInternshipID={setSelectedInternshipID}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Internship Modal */}
      <dialog id="Internship_Details_Modal" className="modal">
        <InternshipDetailsModal
          selectedInternshipID={selectedInternshipID}
          setSelectedInternshipID={setSelectedInternshipID}
        />
      </dialog>
    </section>
  );
};

// Prop validation
FeaturedInternships.propTypes = {
  InternshipData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string,
      subCategory: PropTypes.string,
      budget: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        currency: PropTypes.string,
        isNegotiable: PropTypes.bool,
      }),
      postedAt: PropTypes.string,
      postedBy: PropTypes.shape({
        name: PropTypes.string,
        profileImage: PropTypes.string,
      }),
      location: PropTypes.object,
      isRemote: PropTypes.bool,
    })
  ).isRequired,
};

export default FeaturedInternships;
