import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import NoLogo from "../../../assets/NoLogo.png";

const ModalJobDetails = ({ selectedJob, closeModal }) => {
  return (
    <div className="modal-box bg-white text-black max-w-[700px] bg-gradient-to-br from-blue-100 to-blue-50">
      {/* Top part */}
      <div className="flex flex-col-reverse md:flex-row justify-between gap-5">
        {/* Content */}
        <div>
          {/* Company Name */}
          <p className="text-2xl font-bold ">{selectedJob.companyName}</p>

          {/* Job Title */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Position:</span>
            <span className="ml-5">{selectedJob.jobTitle}</span>
          </p>

          {/* Location */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Location:</span>
            <span className="ml-5">{selectedJob.location}</span>
          </p>

          {/* ob Type */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Job Type:</span>
            <span className="ml-5">{selectedJob.jobType}</span>
          </p>

          {/* Salary */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Salary:</span>
            <span className="ml-5">{selectedJob.salary}</span>
          </p>

          {/* Posted Date */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Posted Date:</span>
            <span className="ml-5">{selectedJob.postedDate}</span>
          </p>

          {/* Available Until */}
          <p className="text-lg flex flex-col md:flex-row">
            <span className="font-bold w-28">Available Until:</span>
            <span className="ml-5">{selectedJob.availableUntil}</span>
          </p>
        </div>

        {/* Company Logo */}
        <div className="mb-8 lg:mb-0  ">
          {selectedJob.companyLogo && (
            <img
              src={selectedJob.companyLogo || NoLogo}
              alt={selectedJob.companyName}
              className="border border-gray-200 "
            />
          )}
        </div>
      </div>

      {/* Company Link */}
      <p className=" flex flex-col md:flex-row">
        <span className="font-bold mr-5 text-xl">Company Link:</span>
        <a
          href={selectedJob.companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="md:text-xl"
        >
          {selectedJob.companyLink}
        </a>
      </p>

      {/* Description */}
      <p className="py-4 text-lg">{selectedJob.jobDescription}</p>

      {/* Responsibilities */}
      <div>
        <h4 className="font-semibold mb-2 ">Responsibilities:</h4>
        <ul className="list-disc pl-5 mb-4">
          {selectedJob.responsibilities.map((responsibility, index) => (
            <li className="my-2" key={index}>
              {responsibility}
            </li>
          ))}
        </ul>
      </div>

      {/* Qualifications */}
      <div>
        <h4 className="font-semibold mb-2 ">Qualifications:</h4>
        <ul className="list-disc pl-5 mb-4">
          {selectedJob.qualifications.map((qualification, index) => (
            <li className="my-2" key={index}>
              {qualification}
            </li>
          ))}
        </ul>
      </div>

      {/* Tools */}
      <div className="flex flex-col md:flex-row   justify-between mx-5">
        <div>
          <h4 className="font-semibold">Tools and Technologies:</h4>
          <ul className="list-disc gap-3 mb-4 flex flex-col md:flex-row mt-2">
            {selectedJob.toolsAndTechnologies.map((tool, index) => (
              <p key={index} className="py-1 px-6 bg-gray-300 rounded-full text-center">
                {tool}
              </p>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company Rating:</h4>
          <Rating
            initialRating={selectedJob.companyRating}
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            readonly
          />
        </div>
      </div>

      <div className="modal-action">
        <Link to={`/PostedJobsDetails/${selectedJob._id}`}>
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Apply Now
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
  );
};

ModalJobDetails.propTypes = {
  selectedJob: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    salary: PropTypes.string.isRequired,
    postedDate: PropTypes.string.isRequired,
    availableUntil: PropTypes.string.isRequired,
    companyLink: PropTypes.string.isRequired,
    companyLogo: PropTypes.string,
    jobDescription: PropTypes.string.isRequired,
    responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    qualifications: PropTypes.arrayOf(PropTypes.string).isRequired,
    toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    companyRating: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ModalJobDetails;
