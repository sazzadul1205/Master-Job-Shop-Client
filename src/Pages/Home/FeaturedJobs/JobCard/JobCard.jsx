import PropTypes from "prop-types";

const JobCard = ({ job }) => {
  // Function to calculate how many days ago the job was posted
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

  const openModal = () => {
    document.getElementById("my_modal_2").showModal();
  };

  const closeModal = () => {
    document.getElementById("my_modal_2").close();
  };

  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl">
      {/* Card */}
      <div className="card-body">
        <p className="font-bold text-2xl text-black">{job.jobTitle}</p>
        <p className="text-gray-500">{job.companyName}</p>
        <p className="text-gray-500">{job.location}</p>
        {job.jobType && (
          <p className="text-blue-500 font-semibold">Job Type: {job.jobType}</p>
        )}
        {job.salary && <p className="text-green-500">Salary: {job.salary}</p>}
        {job.postedDate && (
          <p className="text-black">
            Posted: {calculateDaysAgo(job.postedDate)}
          </p>
        )}
        <div className="card-actions justify-end mt-5">
          <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
            Apply Now
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
            onClick={openModal}
          >
            View More
          </button>
        </div>
      </div>

      {/* View Modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg-white text-black max-w-[700px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{job?.companyName}</p>
              <p className="text-lg">
                <span className="font-bold mr-2">Position</span>
                {job?.jobTitle}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Location :</span>
                {job?.location}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Job Type :</span>
                {job?.jobType}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Salary :</span>
                {job?.salary}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Posted Date :</span>
                {new Date(job?.postedDate).toLocaleDateString()}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Available Until :</span>
                {new Date(job?.availableUntil).toLocaleDateString()}
              </p>
            </div>
            {job?.companyLogo && (
              <img src={job.companyLogo} alt={job.companyName} />
            )}
          </div>
          <p className="py-4">{job?.jobDescription}</p>

          <h4 className="font-semibold">Responsibilities:</h4>
          <ul className="list-disc pl-5 mb-4">
            {job?.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>

          <h4 className="font-semibold">Qualifications:</h4>
          <ul className="list-disc pl-5 mb-4">
            {job?.qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>

          <h4 className="font-semibold">Tools and Technologies:</h4>
          <ul className="list-disc pl-5 mb-4">
            {job?.toolsAndTechnologies.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>

          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

// Define PropTypes
JobCard.propTypes = {
  job: PropTypes.shape({
    jobTitle: PropTypes.string.isRequired,
    companyLogo: PropTypes.string.isRequired,
    jobDescription: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    jobType: PropTypes.string,
    salary: PropTypes.string,
    postedDate: PropTypes.string,
    availableUntil: PropTypes.string,
    responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    qualifications: PropTypes.arrayOf(PropTypes.string).isRequired,
    toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
};

export default JobCard;
