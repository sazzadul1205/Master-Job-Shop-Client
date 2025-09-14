import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Icons
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoIosEye } from "react-icons/io";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

// Assets
import DefaultX from "../../../../assets/Mentor/DefaultX.jpg";
import PropTypes from "prop-types";

// Format date like "22 Feb 2026 10:12 PM"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options).replace(",", "");
};

// Time ago calculation
const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

// Items per page
const ITEMS_PER_PAGE = 5;

const MyMentorshipApplicationsTable = ({
  pageMap,
  mentorship,
  handleAccept,
  handleReject,
  handlePageChange,
}) => {
  const { _id: id, title, applications = [] } = mentorship;

  // Keep applications unfiltered here
  const filteredApplications = applications;

  const currentPage = pageMap[id] || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedApplicants = filteredApplications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const acceptedCount = applications.filter(
    (a) => a.status === "Accepted"
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-600">{title}</h2>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Status Dropdown */}
          <select className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer">
            <option value="all">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="requested">Requested</option>
          </select>

          {/* Complete Program Button */}
          <button className="flex items-center gap-2 text-black border border-gray-700 hover:border-green-700 px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-green-500 hover:text-white cursor-pointer">
            <FaCheck /> Complete Program
          </button>
        </div>
      </div>

      {/* Applicants Info */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Applicants Card */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
          {/* Icon */}
          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <IoIosEye className="w-5 h-5" />
          </div>

          {/* length */}
          <div>
            <p className="text-sm text-gray-500">Total Applicants</p>
            <p className="text-lg font-bold text-gray-700">
              {applications.length}
            </p>
          </div>
        </div>

        {/* Accepted Applicants */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
          {/* Icon */}
          <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <FaCheck className="w-5 h-5" />
          </div>

          {/* length */}
          <div>
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-lg font-bold text-green-600">{acceptedCount}</p>
          </div>
        </div>

        {/* Rejected Applicants */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
          {/* Icon */}
          <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ImCross className="w-5 h-5" />
          </div>

          {/* length */}
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-lg font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto text-black">
        {/* Table */}
        <table className="table">
          {/* Table Head */}
          <thead className="bg-gray-200 text-black">
            <tr>
              <th>#</th>
              <th>Applicant Info</th>
              <th className="text-center">Status</th>
              <th className="w-96 text-center">Application Time</th>
              <th className="w-96 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedApplicants.map((applicant, index) => (
              <tr key={applicant.id} className="hover:bg-gray-100">
                {/* Serial Number */}
                <th>{startIndex + index + 1}</th>

                {/* Applicant Info */}
                <td className="flex items-center gap-4">
                  {/* Avatar */}
                  <img
                    src={applicant.avatar || DefaultX}
                    alt={applicant.name || "N/A"}
                    className="w-16 h-16 rounded-full"
                  />

                  {/* Name */}
                  <h3 className="font-bold">{applicant.name || "N/A"}</h3>
                </td>

                {/* Status */}
                <td className="text-center">{applicant.status || "Pending"}</td>

                {/* Application Time */}
                <td className="text-center">
                  {formatDate(applicant.date)}{" "}
                  <span className="text-gray-500">
                    ({getTimeAgo(applicant.date)})
                  </span>
                </td>

                {/* Action */}
                <td className="text-right w-96">
                  <div className="flex justify-end gap-2">
                    {/* View Button */}
                    <button
                      data-tooltip-id={`viewTip-${id}-${applicant.id}`}
                      data-tooltip-content="View applicant details"
                      className="flex gap-2 items-center border-2 hover:bg-blue-600/90 bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg transition"
                    >
                      <IoIosEye /> View
                    </button>
                    <Tooltip id={`viewTip-${id}-${applicant.id}`} />

                    {/* Accept Buttons */}
                    <button
                      onClick={() => handleAccept(id, applicant.id)}
                      data-tooltip-id={`acceptTip-${id}-${applicant.id}`}
                      data-tooltip-content="Accept this application"
                      className="flex gap-2 items-center border-2 hover:bg-green-600/90 bg-green-500 text-white font-semibold py-2 px-5 rounded-lg transition"
                    >
                      <FaCheck /> Accept
                    </button>
                    <Tooltip id={`acceptTip-${id}-${applicant.id}`} />

                    {/* Reject Button */}
                    <button
                      onClick={() => handleReject(id, applicant.id)}
                      data-tooltip-id={`rejectTip-${id}-${applicant.id}`}
                      data-tooltip-content="Reject this application"
                      className="flex gap-2 items-center border-2 hover:bg-red-600/90 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg transition"
                    >
                      <ImCross /> Reject
                    </button>
                    <Tooltip id={`rejectTip-${id}-${applicant.id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="join flex justify-center mt-4">
          {/* Previous Button */}
          <button
            className="join-item bg-gray-100 hover:bg-gray-200 p-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(id, currentPage - 1)}
          >
            <FaAnglesLeft />
          </button>

          {/* Page Number */}
          <button className="join-item bg-gray-100 border-x-2 px-5 border-gray-300">
            Page {currentPage} of {totalPages}
          </button>

          {/* Next Button */}
          <button
            className="join-item bg-gray-100 hover:bg-gray-200 p-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(id, currentPage + 1)}
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop Validation
MyMentorshipApplicationsTable.propTypes = {
  mentorship: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    durationWeeks: PropTypes.string,
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    Mentor: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      profileImage: PropTypes.string,
      bio: PropTypes.string,
      rating: PropTypes.string,
      position: PropTypes.string,
    }),
    applications: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.string,
        profileImage: PropTypes.string,
        portfolio: PropTypes.string,
        motivation: PropTypes.string,
        goals: PropTypes.string,
        date: PropTypes.string,
        status: PropTypes.string,
        appliedAt: PropTypes.string,
      })
    ),
  }).isRequired,

  // Pagination state
  pageMap: PropTypes.objectOf(PropTypes.number).isRequired,

  // Handlers
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default MyMentorshipApplicationsTable;
