import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Rating from "react-rating";

const ModalViewJobs = ({ jobData }) => {
  return (
    <div className="modal-box bg-white max-w-[1000px] px-0">
      {/* Top part */}
      <div className="flex justify-between items-center pb-3 border-b-2 border-black px-5 text-xl">
        <p>View Job Details</p>
        <button
          onClick={() => document.getElementById("Modal_Job_View").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5">
        {/* Primary data */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-3xl py-2">{jobData?.jobTitle}</p>
            <p className="text-2xl grid grid-cols-2 py-1">
              <span className="font-semibold mr-10">Company Name:</span>
              {jobData?.companyName}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold text-xl mr-5">Location:</span>
              {jobData?.location}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold text-xl mr-5">Job Type:</span>
              {jobData?.jobType}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold text-xl mr-5">Salary:</span>
              {jobData?.salary}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-bold text-xl mr-5">Posted Date:</span>
              {new Date(jobData?.postedDate).toLocaleDateString()}
            </p>
            {jobData?.availableUntil && (
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Available Until:</span>
                {new Date(jobData?.availableUntil).toLocaleDateString()}
              </p>
            )}
            {jobData?.companyLink && (
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Company Link:</span>
                <a
                  href={jobData?.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {jobData?.companyLink}
                </a>
              </p>
            )}
          </div>
          {jobData?.companyLogo && (
            <img
              src={jobData?.companyLogo}
              alt={jobData?.companyName}
              className="border-2 border-black max-w-[500px]"
            />
          )}
        </div>

        {/* Description */}
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Description:</h4>
          <p>{jobData?.jobDescription}</p>
        </div>

        {/* Responsibilities */}
        {jobData?.responsibilities && (
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Responsibilities:</h4>
            <ul className="list-disc pl-5 mb-4">
              {jobData?.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Qualifications */}
        {jobData?.qualifications && (
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Qualifications:</h4>
            <ul className="list-disc pl-5 mb-4">
              {jobData?.qualifications.map((qual, idx) => (
                <li key={idx}>{qual}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools and Rating */}
        <div className="flex items-center justify-between">
          {jobData?.toolsAndTechnologies && (
            <div className="text-xl mt-8">
              <h4 className="font-semibold">Tools and Technologies:</h4>
              <ul className="list-disc gap-3 mb-4 flex mt-2">
                {jobData?.toolsAndTechnologies.map((tool, idx) => (
                  <p key={idx} className="py-1 px-6 bg-gray-300 rounded-full">
                    {tool}
                  </p>
                ))}
              </ul>
            </div>
          )}

          {jobData?.companyRating && (
            <div>
              <h4 className="font-semibold mb-2">Company Rating:</h4>
              <Rating
                initialRating={jobData?.companyRating}
                emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                readonly
              />
            </div>
          )}
        </div>

        {/* People Applied Section */}
        <div className="overflow-x-auto mt-8">
          <h4 className="text-xl font-semibold mb-4">People Applied:</h4>
          <table className="table-auto w-full text-left">
            {/* Table Header */}
            <thead>
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Applied Date</th>
                <th className="px-4 py-2">About Me</th>
                <th className="px-4 py-2">Resume Link</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {jobData?.PeopleApplied && jobData?.PeopleApplied.length > 0 ? (
                jobData?.PeopleApplied.map((applicant, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">
                      <img
                        src={applicant.image}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2">{applicant.name}</td>
                    <td className="px-4 py-2">{applicant.email}</td>
                    <td className="px-4 py-2">{applicant.appliedDate}</td>
                    <td className="px-4 py-2">{applicant.AboutMe}</td>
                    <td className="px-4 py-2">
                      <a
                        href={applicant.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Resume
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">
                    No applicants available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Define prop validation using PropTypes
ModalViewJobs.propTypes = {
  jobData: PropTypes.shape({
    jobTitle: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    salary: PropTypes.string.isRequired,
    postedDate: PropTypes.string.isRequired,
    availableUntil: PropTypes.string,
    companyLink: PropTypes.string,
    companyLogo: PropTypes.string,
    jobDescription: PropTypes.string.isRequired,
    responsibilities: PropTypes.arrayOf(PropTypes.string),
    qualifications: PropTypes.arrayOf(PropTypes.string),
    toolsAndTechnologies: PropTypes.arrayOf(PropTypes.string),
    companyRating: PropTypes.number,
    PeopleApplied: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        appliedDate: PropTypes.string.isRequired,
        AboutMe: PropTypes.string.isRequired,
        resumeLink: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default ModalViewJobs;
