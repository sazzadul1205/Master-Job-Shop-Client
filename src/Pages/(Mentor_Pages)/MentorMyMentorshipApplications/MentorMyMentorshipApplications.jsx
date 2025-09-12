import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import DefaultX from "../../../assets/Mentor/DefaultX.jpg";
import { IoIosEye } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

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

// Demo Applicants Data
const applicants = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Applicant ${i + 1}`,
  status: "Requested",
  date: "2023-08-20T12:20:00Z",
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
}));

const ITEMS_PER_PAGE = 5;

const MentorMyMentorshipApplications = () => {
  // State for this table’s pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedApplicants = applicants.slice(startIndex, endIndex);

  const totalPages = Math.ceil(applicants.length / ITEMS_PER_PAGE);

  const acceptedCount = applicants.filter(
    (a) => a.status === "Accepted"
  ).length;
  const rejectedCount = applicants.filter(
    (a) => a.status === "Rejected"
  ).length;

  return (
    <div className="py-7 px-8">
      {/* Title */}
      <h3 className="font-bold text-3xl text-gray-700">
        Mentorship Applications Management
      </h3>

      {/* Filters */}
      <div className="pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchSharp className="w-5 h-5 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search mentorship..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="statusFilter"
            className="text-sm font-semibold text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            defaultValue=""
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
            <option value="onhold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Container for Mentorship Applications */}
      <div className="py-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-600">
              Software Engineering Mentorship
            </h2>

            {/* Filters & Complete Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                {/* Label */}
                <label
                  htmlFor="statusFilter"
                  className="text-sm font-semibold text-gray-700"
                >
                  Filter by Status:
                </label>

                {/* Dropdown */}
                <select
                  id="statusFilter"
                  className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer"
                  defaultValue="all"
                >
                  <option value="all">All</option>
                  <option value="open">Accepted</option>
                  <option value="completed">Rejected</option>
                </select>
              </div>

              {/* Complete Button */}
              <button className="flex items-center gap-2 text-black border border-gray-700 hover:border-green-700 px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-green-500 hover:text-white cursor-pointer">
                <FaCheck /> Complete Program
              </button>
            </div>
          </div>

          {/* Applicants Info */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Applicants */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <IoIosEye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Applicants</p>
                <p className="text-lg font-bold text-gray-700">
                  {applicants.length}
                </p>
              </div>
            </div>

            {/* Accepted Applicants */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <FaCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Accepted Applicants</p>
                <p className="text-lg font-bold text-green-600">
                  {acceptedCount}
                </p>
              </div>
            </div>

            {/* Rejected Applicants */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                <ImCross className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rejected Applicants</p>
                <p className="text-lg font-bold text-red-600">
                  {rejectedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-black">
            <table className="table">
              {/* Table Header */}
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
                {paginatedApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-100">
                    <th>{applicant.id}</th>
                    <td className="flex items-center gap-4">
                      <img
                        src={applicant.avatar || DefaultX}
                        alt={applicant.name || "N/A"}
                        className="w-16 h-16 rounded-full"
                      />
                      <h3 className="font-bold">{applicant.name || "N/A"}</h3>
                    </td>
                    <td className="text-center">
                      {applicant.status || "Pending"}
                    </td>
                    <td className="text-center">
                      {formatDate(applicant.date)}{" "}
                      <span className="text-gray-500">
                        ({getTimeAgo(applicant.date)})
                      </span>
                    </td>
                    <td className="text-right w-96">
                      <div className="flex justify-end gap-2">
                        {/* View Button */}
                        <button
                          data-tooltip-id="viewTip"
                          data-tooltip-content="View applicant details"
                          className="flex gap-2 items-center border-2 hover:bg-blue-600/90 bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg transition"
                        >
                          <IoIosEye /> View
                        </button>
                        <Tooltip id="viewTip" />

                        {/* Accept Button */}
                        <button
                          data-tooltip-id="acceptTip"
                          data-tooltip-content="Accept this application"
                          className="flex gap-2 items-center border-2 hover:bg-green-600/90 bg-green-500 text-white font-semibold py-2 px-5 rounded-lg transition"
                        >
                          <FaCheck /> Accept
                        </button>
                        <Tooltip id="acceptTip" />

                        {/* Reject Button */}
                        <button
                          data-tooltip-id="rejectTip"
                          data-tooltip-content="Reject this application"
                          className="flex gap-2 items-center border-2 hover:bg-red-600/90 bg-red-500 text-white font-semibold py-2 px-5 rounded-lg transition"
                        >
                          <ImCross /> Reject
                        </button>
                        <Tooltip id="rejectTip" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="join flex justify-center mt-4">
              <button
                className="join-item bg-gray-100 hover:bg-gray-200 p-3 cursor-pointer disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <FaAnglesLeft />
              </button>
              <button className="join-item bg-gray-100 border-x-2 px-5 border-gray-300">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className="join-item bg-gray-100 hover:bg-gray-200 p-3 cursor-pointer disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorMyMentorshipApplications;
