import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import PropTypes from "prop-types";
import ModalJobDetails from "../../Shared/ModalJobDetails/ModalJobDetails";
import { Link } from "react-router-dom";

const FeaturedJobs = ({ PostedJobsData }) => {
  const [selectedJob, setSelectedJob] = useState(null); // State for the selected job for the modal

  const calculateDaysAgo = (isoString) => {
    const postedDate = new Date(isoString);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      return "Today";
    }
    return `${daysDiff} days ago`;
  };

  const openModal = (job) => {
    setSelectedJob(job); // Set the selected job for the modal
    const modal = document.getElementById("View_FeaturedJobs_Details");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("View_FeaturedJobs_Details");
    modal.close();
    setSelectedJob(null); // Clear selected job on modal close
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-20">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center pt-20 px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-4xl md:text-5xl font-bold italic text-blue-700">
              Featured Jobs
            </p>
            <p className="lg:text-xl">Find your dream job and help yourself</p>
          </div>
          <button className="mt-4 md:mt-0 md:ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Jobs"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Job Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 px-5 lg:px-0">
          {PostedJobsData.slice(0, 6).map((job) => (
            <div
              key={job._id}
              className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
            >
              {/* Card */}
              <div className="card-body">
                <p className="font-bold text-2xl text-black">{job.jobTitle}</p>
                <p className="text-gray-500">{job.companyName}</p>
                <p className="text-gray-500">{job.location}</p>
                {job.jobType && (
                  <p className="text-blue-500 font-semibold">
                    Job Type: {job.jobType}
                  </p>
                )}
                {job.salary && (
                  <p className="text-green-500">Salary: {job.salary}</p>
                )}
                {job.postedDate && (
                  <p className="text-black">
                    Posted: {calculateDaysAgo(job.postedDate)}
                  </p>
                )}
                <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                  <Link to={`/PostedJobsDetails/${job._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                      Apply Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
                    onClick={() => openModal(job)} // Open modal on button click
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Modal */}
        <dialog id="View_FeaturedJobs_Details" className="modal">
          {selectedJob && (
            <ModalJobDetails
              selectedJob={selectedJob}
              closeModal={closeModal}
            />
          )}
        </dialog>
      </div>
    </div>
  );
};

FeaturedJobs.propTypes = {
  PostedJobsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      jobTitle: PropTypes.string.isRequired,
      companyName: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      jobType: PropTypes.string,
      salary: PropTypes.string,
      postedDate: PropTypes.string.isRequired,
      availableUntil: PropTypes.string,
      companyLink: PropTypes.string,
      companyLogo: PropTypes.string,
      jobDescription: PropTypes.string,
      responsibilities: PropTypes.arrayOf(PropTypes.string),
      qualifications: PropTypes.arrayOf(PropTypes.string),
      toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string),
      companyRating: PropTypes.number,
    })
  ).isRequired,
};

export default FeaturedJobs;
