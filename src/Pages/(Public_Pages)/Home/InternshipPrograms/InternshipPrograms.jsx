import { useState } from "react";
import { Link } from "react-router-dom";

// Icons
import { FaArrowRight } from "react-icons/fa";

// Shared
import InternshipCard from "../../../../Shared/InternshipCard/InternshipCard";

// Packages
import PropTypes from "prop-types";

const InternshipPrograms = ({ InternshipData }) => {
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Internship Programs
            </h2>
            <p className="lg:text-xl">
              Explore internship opportunities to kickstart your career.
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
          {InternshipData.slice(0, 6).map((internship) => (
            <InternshipCard
              key={internship._id}
              internship={internship}
              setSelectedGigID={setSelectedInternshipID}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Prop validation
InternshipPrograms.propTypes = {
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

export default InternshipPrograms;
