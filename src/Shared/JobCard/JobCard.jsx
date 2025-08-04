import { Link } from "react-router-dom";

// Prop Validation Import
import PropTypes from "prop-types";

// Import Common Btn
import CommonButton from "../CommonButton/CommonButton";

// Default Company Logo
import DefaultCompanyLogo from "../../assets/DefaultCompanyLogo.jpg";
import { MdEdit } from "react-icons/md";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";

// Salary Format
const formatSalary = (min, max, currency) => {
  if (!min && !max) return "Not specified";
  if (min && !max) return `${currency}${min}+`;
  if (!min && max) return `Up to ${currency}${max}`;
  return `${currency} ${min} - ${max}`;
};

// Function to Calculate Days Ago
const calculateDaysAgo = (isoString) => {
  const postedDate = new Date(isoString);
  const today = new Date();
  const timeDiff = today - postedDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff === 0
    ? "Today"
    : `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
};

const JobCard = ({ job, setSelectedJobID, setSelectedJobData, poster }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm hover:shadow-2xl p-6 bg-linear-to-bl from-white to-gray-100 transition duration-200 h-[350px] overflow-hidden">
      {/* Top: Company Logo and Info */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          {/* Company Logo */}
          <img
            src={job.company.logo || DefaultCompanyLogo}
            alt={job.company.name}
            className="w-12 h-12 object-contain rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DefaultCompanyLogo;
            }}
          />

          {/* Company Info */}
          <div>
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>

            {/* Name and Location */}
            <p className="text-sm text-gray-500">
              {job.company.name} • {job.location}
            </p>
          </div>
        </div>

        {/* Middle: Job Details */}
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          {/* Job Type & Level */}
          <p>
            <strong>Type:</strong> {job.type} • {job.level}
          </p>

          {/* Job Esperance */}
          <p>
            <strong>Experience:</strong> {job.experience}
          </p>

          {/* Salary */}
          <p className="text-sm font-bold  mb-1">
            Salary:{" "}
            <span className="text-green-700 font-semibold">
              {formatSalary(
                job.salaryRange?.min,
                job.salaryRange?.max,
                job.salaryRange?.currency || "USD"
              )}
              {job?.isNegotiable && (
                <span className="text-xs text-green-600 ml-1">
                  (Negotiable)
                </span>
              )}
            </span>
          </p>

          {/* Mode */}
          <p>
            <strong>Mode:</strong>{" "}
            {job.remote
              ? "Remote"
              : job.hybrid
              ? "Hybrid"
              : job.onsite
              ? "Onsite"
              : "N/A"}
          </p>

          {/* Posted At */}
          <p>
            <strong>Posted:</strong> {calculateDaysAgo(job.postedAt)}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-gray-700 text-sm mb-6 line-clamp-2">
          {job.description}
        </p>
      </div>

      {/* Bottom: Action Buttons */}
      <div>
        {poster ? (
          <div className="flex justify-between items-center gap-4 mt-auto pt-0">
            {/* Edit Job */}
            <button
              title="Edit Job"
              className="flex items-center gap-2 text-yellow-600 hover:text-white border border-yellow-600 hover:bg-yellow-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
              onClick={() => {
                // Trigger your edit handler/modal here
                document.getElementById("Edit_Job_Modal")?.showModal();
                setSelectedJobData(job);
              }}
            >
              <MdEdit /> Edit
            </button>

            {/* Delete Job */}
            <button
              title="Delete Job"
              className="flex items-center gap-2 text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
              onClick={() => {
                // Trigger your delete handler here
                document.getElementById("Delete_Job_Modal")?.showModal();
                setSelectedJobID(job?._id);
              }}
            >
              <FaRegTrashAlt /> Delete
            </button>

            {/* Details Button */}
            <button
              title="Delete Job"
              className="flex items-center gap-2 text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
              onClick={() => {
                document.getElementById("Jobs_Details_Modal")?.showModal();
                setSelectedJobID(job?._id);
              }}
            >
              <FaEye />
              View Details
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-auto">
            {/* Apply Now Button */}
            <Link to={`/Jobs/Apply/${job?._id}`}>
              <CommonButton
                text="Apply Now"
                textColor="text-white"
                bgColor="blue"
                px="px-4"
                py="py-2"
                width="auto"
                className="text-sm font-medium"
              />
            </Link>

            {/* Details Button */}
            <button
              onClick={() => {
                document.getElementById("Jobs_Details_Modal")?.showModal();
                setSelectedJobID(job?._id);
              }}
              className="text-sm text-blue-700 hover:underline cursor-pointer"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Prop Validation
JobCard.propTypes = {
  job: PropTypes.shape({
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    level: PropTypes.string,
    type: PropTypes.string,
    experience: PropTypes.string,
    postedAt: PropTypes.string,
    isNegotiable: PropTypes.bool,
    salaryRange: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      currency: PropTypes.string,
    }),
    remote: PropTypes.bool,
    hybrid: PropTypes.bool,
    onsite: PropTypes.bool,
    description: PropTypes.string,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
    }),
    application: PropTypes.shape({
      applyUrl: PropTypes.string,
    }),
    _id: PropTypes.string.isRequired,
  }).isRequired,
  setSelectedJobID: PropTypes.func.isRequired,
  setSelectedJobData: PropTypes.func.isRequired,
  poster: PropTypes.bool,
};

export default JobCard;
