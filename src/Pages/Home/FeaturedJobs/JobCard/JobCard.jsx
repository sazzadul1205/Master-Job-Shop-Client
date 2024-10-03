import PropTypes from "prop-types";

const JobCard = ({
  jobTitle,
  companyName,
  location,
  jobType,
  salary,
  postedDate,
}) => {
  // Function to calculate how many days ago the job was posted
  const calculateDaysAgo = (isoString) => {
    const postedDate = new Date(isoString);
    const today = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = today - postedDate;

    // Convert the time difference to days
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // If the job was posted today, return "Today"
    if (daysDiff === 0) {
      return "Today";
    }

    // Otherwise, return "X days ago"
    return `${daysDiff} days ago`;
  };

  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Job Title */}
        <p className="font-bold text-2xl">{jobTitle || "Job Title"}</p>

        {/* Company Name */}
        <p className="text-gray-500">{companyName || "Company Name"}</p>

        {/* Location */}
        <p className="text-gray-500">
          {location || "Location, location, location"}
        </p>

        {/* Optional Job Type Section */}
        {jobType && (
          <p className="text-blue-500 font-semibold">Job Type: {jobType}</p>
        )}

        {/* Optional Salary Section */}
        {salary && <p className="text-green-500">Salary: {salary}</p>}

        {/* Posted Date as "X days ago" */}
        {postedDate && (
          <p className="text-black">Posted: {calculateDaysAgo(postedDate)}</p>
        )}

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Apply Now
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes
JobCard.propTypes = {
  jobTitle: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  jobType: PropTypes.string,
  salary: PropTypes.string,
  postedDate: PropTypes.string,
};

export default JobCard;
