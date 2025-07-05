import { Link } from "react-router-dom";
import { useState } from "react";

// Packages
import PropTypes from "prop-types";

// Icon
import { FaArrowRight } from "react-icons/fa";

// Shared
import JobCard from "../../../../Shared/JobCard/JobCard";

// Modals
import JobDetailsModal from "./JobDetailsModal/JobDetailsModal";

const FeaturedJobs = ({ JobsData }) => {
  const [selectedJobID, setSelectedJobID] = useState(null);

  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Featured Opportunities
            </h2>
            <p className="text-gray-200 mt-2">
              Explore hand-picked roles from top companies
            </p>
          </div>
          <Link
            to="/Jobs"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Browse All Jobs <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Jobs Card */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {JobsData?.slice(0, 6).map((job) => (
            <JobCard
              key={job._id}
              job={job}
              setSelectedJobID={setSelectedJobID}
            />
          ))}
        </div>
      </div>

      {/* Jobs Modal */}
      <dialog id="Jobs_Details_Modal" className="modal">
        <JobDetailsModal
          selectedJobID={selectedJobID}
          setSelectedJobID={setSelectedJobID}
        />
      </dialog>
    </section>
  );
};

FeaturedJobs.propTypes = {
  JobsData: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
    })
  ),
};

export default FeaturedJobs;
