import { Link } from "react-router-dom";

// Default Company Icon
import DefaultCompanyLogo from "../../../../..//assets/DefaultCompanyLogo.jpg";

// Icons
import { ImCross } from "react-icons/im";

// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

// Format Salary Function
const formatSalary = (min, max, currency) => {
  if (!min && !max) return "Not specified";
  if (min && !max) return `${currency}${min}+`;
  if (!min && max) return `Up to ${currency}${max}`;
  return `${currency}${min} - ${max}`;
};

const JobDetailsModal = ({ selectedJobID, setSelectedJobID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetching Selected Job Data
  const {
    data: SelectedJobData,
    isLoading: SelectedJobIsLoading,
    error: SelectedJobError,
  } = useQuery({
    queryKey: ["SelectedJobData", selectedJobID],
    queryFn: () =>
      axiosPublic.get(`/Jobs?id=${selectedJobID}`).then((res) => res.data),
    enabled: !!selectedJobID, // Only run when selectedJobID is truthy
  });

  // Loading
  if (SelectedJobIsLoading) {
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedJobID("");
            document.getElementById("Job_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );
  }

  // Error
  if (SelectedJobError) {
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedJobID("");
            document.getElementById("Job_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );
  }

  // No Data Fetched
  if (!SelectedJobData) {
    return null;
  }

  return (
    <div className="modal-box min-w-5xl relative bg-linear-to-bl from-white to-gray-200 rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-5">
      {/* Floating Close Button */}
      <div
        onClick={() => {
          setSelectedJobID("");
          document.getElementById("Jobs_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
      >
        <ImCross className="text-xl text-black hover:text-red-500 cursor-pointer" />
      </div>

      {/* Modal Content */}
      <div className="pt-2 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Company Icon */}
          <img
            src={SelectedJobData?.company.logo || DefaultCompanyLogo}
            onError={(e) => (e.target.src = DefaultCompanyLogo)}
            alt={SelectedJobData?.company.name}
            className="w-16 h-16 object-contain"
          />

          {/* Company Information */}
          <div>
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800">
              {SelectedJobData?.title}
            </h2>

            {/* Name & Industries */}
            <p className="text-gray-600 text-sm">
              {SelectedJobData?.company.name} •{" "}
              {SelectedJobData?.company.industry}
            </p>

            {/* Location */}
            <p className="text-gray-600 text-sm">{SelectedJobData?.location}</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          {/* Type */}
          <p>
            <strong>Type:</strong> {SelectedJobData?.type}
          </p>

          {/* Level */}
          <p>
            <strong>Level:</strong> {SelectedJobData?.level}
          </p>

          {/* Experience */}
          <p>
            <strong>Experience:</strong> {SelectedJobData?.experience}
          </p>

          {/* Mode */}
          <p>
            <strong>Mode:</strong>{" "}
            {SelectedJobData?.remote
              ? "Remote"
              : SelectedJobData?.hybrid
              ? "Hybrid"
              : "Onsite"}
          </p>

          {/* Timezone */}
          <p>
            <strong>Timezone:</strong>{" "}
            {SelectedJobData?.timezoneOverlap || "Not specified"}
          </p>

          {/* Salary */}
          <p>
            <strong>Salary:</strong>{" "}
            {formatSalary(
              SelectedJobData?.salaryRange.min,
              SelectedJobData?.salaryRange.max,
              SelectedJobData?.salaryRange.currency
            )}{" "}
            {SelectedJobData?.isNegotiable && (
              <span className="text-green-600">(Negotiable)</span>
            )}
          </p>
        </div>

        {/* Description */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Job Description
          </h3>
          <p className="text-sm text-gray-700">
            {SelectedJobData?.description}
          </p>
        </section>

        {/* Responsibilities */}
        {SelectedJobData?.responsibilities?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Responsibilities
            </h3>

            {/* Responsibility */}
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {SelectedJobData?.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Requirements */}
        {SelectedJobData?.requirements?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Requirements
            </h3>

            {/* Requirement */}
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {SelectedJobData?.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Nice to Have */}
        {SelectedJobData?.niceToHave?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Nice to Have
            </h3>

            {/* Nice To Have */}
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {SelectedJobData?.niceToHave.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Skills */}
        {SelectedJobData?.skills?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Skills</h3>

            {/* Required Skills */}
            <div className="flex flex-wrap gap-2">
              {SelectedJobData?.skills.map((skill, i) => (
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
          {/* Benefits */}
          {SelectedJobData?.benefits?.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Benefits
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {SelectedJobData?.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Perks */}
          {SelectedJobData?.perks?.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                Perks
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {SelectedJobData?.perks.map((p, i) => (
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
          {/* Description */}
          <p className="text-sm text-gray-700 mb-1">
            {SelectedJobData?.company.description}
          </p>

          {/* Size */}
          <p className="text-sm text-gray-600">
            Size: {SelectedJobData?.company.size}
          </p>

          {/* Website Links */}
          <a
            href={SelectedJobData?.company.website}
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
          {/* Application Email */}
          <p className="text-sm text-gray-700 mb-1">
            Send your application to:{" "}
            <a
              href={`mailto:${SelectedJobData?.application.applyEmail}`}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {SelectedJobData?.application.applyEmail}
            </a>
          </p>

          {/* Apply Now Button */}
          <Link
            to={`/external-apply?url=${encodeURIComponent(
              SelectedJobData?.application.applyUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 text-sm"
          >
            Apply Now
          </Link>

          {/* Dead Line */}
          <p className="text-xs text-gray-500 mt-2">
            Deadline:{" "}
            {new Date(
              SelectedJobData?.application.applicationDeadline
            ).toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
};

// Prop Validation
JobDetailsModal.propTypes = {
  selectedJobID: PropTypes.object,
  setSelectedJobID: PropTypes.func.isRequired,
};

export default JobDetailsModal;
