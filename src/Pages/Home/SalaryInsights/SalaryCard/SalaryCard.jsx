import PropTypes from "prop-types";

const SalaryCard = ({ jobTitle, averageSalary, location, experienceLevel, jobType }) => {
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-orange-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Job Title */}
        <p className="font-bold text-2xl">{jobTitle || "Job Title"}</p>

        {/* Location */}
        <p className="text-gray-500">{location || "Location"}</p>

        {/* Average Salary */}
        <p className="text-green-500 font-semibold">Average Salary: {averageSalary || "$0"}</p>

        {/* Experience Level */}
        <p className="text-blue-500">Experience Level: {experienceLevel || "N/A"}</p>

        {/* Job Type */}
        {jobType && (
          <p className="text-gray-500">
            Job Type: {jobType}
          </p>
        )}
      </div>
    </div>
  );
};

// Define PropTypes
SalaryCard.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  averageSalary: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  experienceLevel: PropTypes.string.isRequired,
  jobType: PropTypes.string,
};

export default SalaryCard;
