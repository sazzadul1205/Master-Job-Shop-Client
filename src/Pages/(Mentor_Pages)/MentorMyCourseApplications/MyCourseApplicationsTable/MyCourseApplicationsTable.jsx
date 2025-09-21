import React, { useState } from "react";
import { FaCheck, FaCopy, FaSpinner } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

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

// Map status to display name
const statusDisplayName = {
  open: "Open",
  active: "closed",
  closed: "Closed",
  onhold: "On Hold",
};

// Map internal status to dropdown value
const statusMap = {
  active: "closed",
  open: "open",
  closed: "closed",
  onhold: "onhold",
};

// Items per page
const ITEMS_PER_PAGE = 5;

const MyCourseApplicationsTable = ({
  course,
  pageMap,
  refetchAll,
  handlePageChange,
  setSelectedApplicantName,
  setSelectedApplicationID,
}) => {
  // Destructuring
  const { _id: id, title, applications = [] } = course;

  // Active filter state

  const [activeFilters, setActiveFilters] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);

  // Normalize status (fallback to "Pending")
  const getStatus = (app) => {
    const raw = app?.status;
    return raw === "Accepted"
      ? "Accepted"
      : raw === "Rejected"
      ? "Rejected"
      : "Pending";
  };

  // Filtered applications based on active filters
  const filteredApplications = activeFilters.length
    ? applications.filter((app) => activeFilters.includes(getStatus(app)))
    : applications;

  // Pagination
  const currentPage = pageMap[id] || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedApplicants = filteredApplications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  // Counts (based on full applications, not filtered)
  const acceptedCount = applications.filter(
    (a) => getStatus(a) === "Accepted"
  ).length;
  const rejectedCount = applications.filter(
    (a) => getStatus(a) === "Rejected"
  ).length;
  const pendingCount = applications.filter(
    (a) => getStatus(a) === "Pending"
  ).length;

  // Handler to change mentorship status with loading
  const handleStatusChange = async (mentorshipId, currentStatus, newStatus) => {
    if (newStatus === currentStatus) return; // No change

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to change status from "${statusDisplayName[currentStatus]}" to "${statusDisplayName[newStatus]}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setStatusLoading(true); // start loading
        const res = await axiosPublic.patch(
          `/Mentorship/Status/${mentorshipId}`,
          { status: newStatus }
        );

        if (res.data?.message) {
          Swal.fire({
            title: "Success!",
            text: `Status changed to "${statusDisplayName[newStatus]}"`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          refetchAll?.();
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update mentorship status.",
          icon: "error",
        });
      } finally {
        setStatusLoading(false); // stop loading
      }
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* Status Badge */}
      <span
        className={`absolute -top-2 -left-4 px-3 py-1 rounded-full text-white font-semibold text-sm
    ${
      course?.status === "completed"
        ? "bg-green-700" // completed badge color
        : course?.status === "closed" || course?.status === "active"
        ? "bg-red-500"
        : course?.status === "open"
        ? "bg-green-500"
        : course?.status === "onhold"
        ? "bg-yellow-500 text-black"
        : "bg-gray-400"
    }`}
      >
        {course?.status === "completed"
          ? "Completed"
          : course?.status === "closed" || course?.status === "active"
          ? "Closed"
          : course?.status === "open"
          ? "Open"
          : course?.status === "onhold"
          ? "On Hold"
          : "Unknown"}
      </span>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-600">{title}</h2>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Copy JSON Button */}
          <button
            data-tooltip-id="copyTooltip"
            data-tooltip-content="Copy course JSON (excluding applicants)"
            onClick={() => {
              if (!course) return;
              // eslint-disable-next-line no-unused-vars
              const { applications, ...rest } = course;
              navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
              Swal.fire({
                title: "Copied!",
                text: "Course JSON (without applicants) has been copied to clipboard.",
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition"
          >
            <FaCopy className="text-lg" />
          </button>

          {/* Tooltip Instance */}
          <Tooltip id="copyTooltip" place="top" effect="solid" />

          {/* Status Dropdown */}
          <select
            value={
              course?.status === "completed"
                ? "" // clear value if completed
                : statusMap[course.status] || "open"
            }
            onChange={(e) =>
              handleStatusChange(
                course?._id,
                statusMap[course.status] || "open",
                e.target.value
              )
            }
            disabled={course?.status === "completed" || statusLoading} // disable if completed or loading
            className={`px-3 py-2 w-[200px] rounded-xl border transition cursor-pointer ${
              course?.status === "completed" || statusLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
          >
            {statusLoading ? (
              <option value="">Updating...</option>
            ) : course?.status === "completed" ? (
              <option value="">Completed</option>
            ) : (
              <>
                <option value="open">Open</option>
                <option value="closed">Close</option>
                <option value="onhold">On Hold</option>
              </>
            )}
          </select>

          {/* Show Complete Program Button only if not Completed */}
          {course?.status !== "completed" && (
            <button
              onClick={() => handleCompleteProgram(course?._id)}
              disabled={loadingComplete}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl shadow-md border transition-all duration-300 ease-in-out cursor-pointer ${
                loadingComplete
                  ? "bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg active:scale-95"
              }`}
            >
              {loadingComplete ? (
                <>
                  <FaSpinner className="animate-spin text-lg" /> Processing...
                </>
              ) : (
                <>
                  <FaCheck className="text-lg" /> Complete Program
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourseApplicationsTable;
