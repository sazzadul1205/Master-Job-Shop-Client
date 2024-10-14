import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import NoLogo from "../../../assets/NoLogo.png";

const ModalJobDetails = ({ selectedJob, closeModal }) => {
  return (
    <div className="modal-box bg-white text-black max-w-[700px] bg-gradient-to-br from-blue-100 to-blue-50">
      {/* Top part */}
      <div className="flex items-center justify-between">
        {/* Content */}
        <div>
          <p className="text-2xl font-bold">{selectedJob.companyName}</p>
          <p className="text-lg">
            <span className="font-bold mr-2">Position:</span>
            {selectedJob.jobTitle}
          </p>
          <p className="text-lg">
            <span className="font-bold mr-5">Location:</span>
            {selectedJob.location}
          </p>
          <p className="text-lg">
            <span className="font-bold mr-5">Job Type:</span>
            {selectedJob.jobType}
          </p>
          <p className="text-lg">
            <span className="font-bold mr-5">Salary:</span>
            {selectedJob.salary}
          </p>
          <p className="text-lg">
            <span className="font-bold mr-5">Posted Date:</span>
            {new Date(selectedJob.postedDate).toLocaleDateString()}
          </p>
          <p className="text-lg">
            <span className="font-bold mr-5">Available Until:</span>
            {new Date(selectedJob.availableUntil).toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-bold mr-5">Company Link:</span>
            <a
              href={selectedJob.companyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {selectedJob.companyLink}
            </a>
          </p>
        </div>
        {/* Image */}
        {selectedJob.companyLogo && (
          <img
            src={selectedJob.companyLogo || NoLogo}
            alt={selectedJob.companyName}
            className="border border-gray-200"
          />
        )}
      </div>

      {/* Description */}
      <p className="py-4">{selectedJob.jobDescription}</p>

      {/* Responsibilities */}
      <div>
        <h4 className="font-semibold">Responsibilities:</h4>
        <ul className="list-disc pl-5 mb-4">
          {selectedJob.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </div>

      {/* Qualifications */}
      <div>
        <h4 className="font-semibold">Qualifications:</h4>
        <ul className="list-disc pl-5 mb-4">
          {selectedJob.qualifications.map((qualification, index) => (
            <li key={index}>{qualification}</li>
          ))}
        </ul>
      </div>

      {/* Tools */}
      <div className="flex items-center justify-between mx-5">
        <div>
          <h4 className="font-semibold">Tools and Technologies:</h4>
          <ul className="list-disc gap-3 mb-4 flex mt-2">
            {selectedJob.toolsAndTechnologies.map((tool, index) => (
              <p key={index} className="py-1 px-6 bg-gray-300 rounded-full">
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
