import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";
import DefaultCompanyLogo from "../../../../..//assets/DefaultCompanyLogo.jpg";
import { Link } from "react-router-dom";

const formatSalary = (min, max, currency) => {
  if (!min && !max) return "Not specified";
  if (min && !max) return `${currency}${min}+`;
  if (!min && max) return `Up to ${currency}${max}`;
  return `${currency}${min} - ${max}`;
};

const JobDetailsModal = ({ selectedJobID, setSelectedJobID }) => {
  const job = selectedJobID; // Assuming it's the full job object

  if (!job) {
    return (
      <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg max-w-3xl w-full mx-auto overflow-y-auto max-h-[90vh] p-6 flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-red-600">Job Not Found</h2>
          <p className="text-gray-600 text-sm">
            This job is no longer available or an error occurred while
            retrieving the details.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              setSelectedJobID("");
              document.getElementById("Jobs_Details_Modal")?.close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg max-w-3xl w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Floating Close Button */}
      <div className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
        <ImCross
          className="text-xl text-black hover:text-red-500 cursor-pointer"
          onClick={() => {
            setSelectedJobID("");
            document.getElementById("Jobs_Details_Modal")?.close();
          }}
        />
      </div>

      {/* Modal Content */}
      <div className="pt-10 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <img
            src={job.company.logo || DefaultCompanyLogo}
            onError={(e) => (e.target.src = DefaultCompanyLogo)}
            alt={job.company.name}
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
            <p className="text-gray-600 text-sm">
              {job.company.name} • {job.company.industry}
            </p>
            <p className="text-gray-600 text-sm">{job.location}</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <strong>Type:</strong> {job.type}
          </p>
          <p>
            <strong>Level:</strong> {job.level}
          </p>
          <p>
            <strong>Experience:</strong> {job.experience}
          </p>
          <p>
            <strong>Mode:</strong>{" "}
            {job.remote ? "Remote" : job.hybrid ? "Hybrid" : "Onsite"}
          </p>
          <p>
            <strong>Timezone:</strong> {job.timezoneOverlap || "Not specified"}
          </p>
          <p>
            <strong>Salary:</strong>{" "}
            {formatSalary(
              job.salaryRange.min,
              job.salaryRange.max,
              job.salaryRange.currency
            )}{" "}
            {job.isNegotiable && (
              <span className="text-green-600">(Negotiable)</span>
            )}
          </p>
        </div>

        {/* Description */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Job Description
          </h3>
          <p className="text-sm text-gray-700">{job.description}</p>
        </section>

        {/* Responsibilities */}
        {job.responsibilities?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Responsibilities
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Requirements
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {job.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Nice to Have */}
        {job.niceToHave?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Nice to Have
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {job.niceToHave.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Benefits and Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {job.benefits?.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Benefits
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {job.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          )}
          {job.perks?.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Perks
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {job.perks.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Company Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            About the Company
          </h3>
          <p className="text-sm text-gray-700 mb-1">
            {job.company.description}
          </p>
          <p className="text-sm text-gray-600">Size: {job.company.size}</p>
          <a
            href={job.company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline"
          >
            Visit Website
          </a>
        </section>

        {/* Application Info */}
        <section className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            How to Apply
          </h3>
          <p className="text-sm text-gray-700 mb-1">
            Send your application to:{" "}
            <a
              href={`mailto:${job.application.applyEmail}`}
              className="text-blue-600 hover:underline"
            >
              {job.application.applyEmail}
            </a>
          </p>
          <Link
            to={`/external-apply?url=${encodeURIComponent(
              job.application.applyUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 text-sm"
          >
            Apply Now
          </Link>
          <p className="text-xs text-gray-500 mt-2">
            Deadline:{" "}
            {new Date(job.application.applicationDeadline).toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
};

JobDetailsModal.propTypes = {
  selectedJobID: PropTypes.object,
  setSelectedJobID: PropTypes.func.isRequired,
};

export default JobDetailsModal;
