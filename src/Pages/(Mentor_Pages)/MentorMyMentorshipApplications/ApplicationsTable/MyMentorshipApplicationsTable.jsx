import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Icons
import { ImCross } from "react-icons/im";
import { IoIosEye } from "react-icons/io";
import { FaCheck, FaCopy, FaSpinner } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { MdPendingActions, MdRestartAlt } from "react-icons/md";
import { AiOutlineLoading3Quarters, AiOutlineReload } from "react-icons/ai";

// Assets
import CautionIcon from "../../../../assets/MentorshipApplications/CautionIcon.gif";
import AcceptedIcon from "../../../../assets/MentorshipApplications/AcceptedIcon.gif";
import RejectedIcon from "../../../../assets/MentorshipApplications/RejectedIcon.gif";
import CompletedIcon from "../../../../assets/MentorshipApplications/CompletedIcon.gif";
import DefaultApplicant from "../../../../assets/MentorshipApplications/MentorshipDefaultImage.jpeg";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

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

const MyMentorshipApplicationsTable = ({
  pageMap,
  refetchAll,
  mentorship,
  handlePageChange,
  setSelectedApplicantName,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Destructuring
  const { _id: id, title, applications = [] } = mentorship;

  // Active filter state
  const [loadingId, setLoadingId] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

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

  // Toggle handler for filters
  const toggleFilter = (status) => {
    setActiveFilters(
      (prev) =>
        prev.includes(status)
          ? prev.filter((s) => s !== status) // remove if active
          : [...prev, status] // add if not active
    );
  };

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

  // Handler for completing the mentorship program
  const handleCompleteProgram = async (mentorshipId) => {
    // start loading
    setLoadingComplete(true);

    const cautionHtml = renderToStaticMarkup(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <img
          src={CautionIcon}
          alt="Caution"
          style={{ width: 150, height: 150 }}
        />
      </div>
    );

    Swal.fire({
      title: "Are you sure?",
      html: `${cautionHtml}<p>Once completed, this mentorship cannot be updated. You can only delete it later.</p>`,
      showCancelButton: true,
      confirmButtonText: "Yes, complete it!",
      cancelButtonText: "Cancel",
      customClass: { popup: "text-center" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosPublic.patch(
            `/Mentorship/Status/${mentorshipId}`,
            { status: "completed" }
          );

          if (res.data?.message) {
            const completedHtml = renderToStaticMarkup(
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 15,
                }}
              >
                <img
                  src={CompletedIcon}
                  alt="Completed"
                  style={{ width: 150, height: 150 }}
                />
              </div>
            );

            Swal.fire({
              title: "Mentorship Completed!",
              html: `${completedHtml}<p>The mentorship program has been successfully marked as completed.</p>`,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              allowOutsideClick: true,
              customClass: { popup: "text-center" },
            });

            refetchAll?.();
          }
        } catch (error) {
          console.error("Error completing mentorship:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to complete the mentorship program.",
            icon: "error",
          });
        }
      }
      // stop loading after alert resolves
      setLoadingComplete(false);
    });
  };

  // Handler to accept/revert/reject an application
  const updateApplicationStatus = async (
    applicationId,
    newStatus,
    applicantName
  ) => {
    if (!applicationId) {
      console.error("No application ID provided.");
      Swal.fire({
        title: "Error",
        text: "No application selected.",
        icon: "error",
      });
      return;
    }

    if (!["Accepted", "Rejected", "Pending"].includes(newStatus)) {
      console.error("Invalid status provided:", newStatus);
      Swal.fire({
        title: "Error",
        text: "Invalid status value.",
        icon: "error",
      });
      return;
    }

    setLoadingId(applicationId);

    try {
      const response = await axiosPublic.put(
        `/MentorshipApplications/Status/${applicationId}`,
        { status: newStatus }
      );

      if (response.status >= 200 && response.status < 300) {
        refetchAll?.();

        // Choose icon based on status
        const iconHtml =
          newStatus === "Accepted"
            ? renderToStaticMarkup(
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 15,
                  }}
                >
                  <img
                    src={AcceptedIcon}
                    alt="Accepted"
                    style={{ width: 150, height: 150 }}
                  />
                </div>
              )
            : newStatus === "Rejected"
            ? renderToStaticMarkup(
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 15,
                  }}
                >
                  <img
                    src={RejectedIcon}
                    alt="Rejected"
                    style={{ width: 150, height: 150 }}
                  />
                </div>
              )
            : renderToStaticMarkup(
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 15,
                    fontSize: 80,
                    color: "#facc15",
                    animation: "spin 1.5s linear infinite",
                  }}
                >
                  <AiOutlineReload />
                </div>
              );

        Swal.fire({
          title:
            newStatus === "Pending"
              ? "Reverted Successfully!"
              : `${newStatus} Successfully!`,
          html: `${iconHtml}<p>${applicantName}'s application has been ${
            newStatus === "Pending"
              ? "reverted to pending"
              : newStatus.toLowerCase()
          }.</p>`,
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true,
          allowOutsideClick: true,
          customClass: { popup: "text-center" },
        });
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(
        `Error updating application status to ${newStatus}:`,
        error
      );
      Swal.fire({
        title: "Error",
        text: `Failed to update ${applicantName}'s application status to "${newStatus}".`,
        icon: "error",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* Status Badge */}
      <span
        className={`absolute -top-2 -left-4 px-3 py-1 rounded-full text-white font-semibold text-sm
    ${
      mentorship.status === "completed"
        ? "bg-green-700" // completed badge color
        : mentorship.status === "closed" || mentorship.status === "active"
        ? "bg-red-500"
        : mentorship.status === "open"
        ? "bg-green-500"
        : mentorship.status === "onhold"
        ? "bg-yellow-500 text-black"
        : "bg-gray-400"
    }`}
      >
        {mentorship.status === "completed"
          ? "Completed"
          : mentorship.status === "closed" || mentorship.status === "active"
          ? "Closed"
          : mentorship.status === "open"
          ? "Open"
          : mentorship.status === "onhold"
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
            data-tooltip-content="Copy mentorship JSON (excluding applicants)"
            onClick={() => {
              if (!mentorship) return;
              // eslint-disable-next-line no-unused-vars
              const { applications, ...rest } = mentorship;
              navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
              Swal.fire({
                title: "Copied!",
                text: "Mentorship JSON (without applicants) has been copied to clipboard.",
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
              mentorship?.status === "completed"
                ? "" // clear value if completed
                : statusMap[mentorship.status] || "open"
            }
            onChange={(e) =>
              handleStatusChange(
                mentorship?._id,
                statusMap[mentorship.status] || "open",
                e.target.value
              )
            }
            disabled={mentorship?.status === "completed" || statusLoading} // disable if completed or loading
            className={`px-3 py-2 w-[200px] rounded-xl border transition cursor-pointer ${
              mentorship?.status === "completed" || statusLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            }`}
          >
            {statusLoading ? (
              <option value="">Updating...</option>
            ) : mentorship?.status === "completed" ? (
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
          {mentorship?.status !== "completed" && (
            <button
              onClick={() => handleCompleteProgram(mentorship?._id)}
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

      {/* Applicants Info */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* Total Applicants Card */}
        <div
          className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
          onClick={() => setActiveFilters([])}
        >
          <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <IoIosEye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Applicants</p>
            <p className="text-lg font-bold text-gray-700">
              {applications.length}
            </p>
          </div>
        </div>

        {/* Accepted Applicants */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer ${
            activeFilters.includes("Accepted") ? "bg-green-100" : "bg-gray-50"
          }`}
          onClick={() => toggleFilter("Accepted")}
        >
          <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <FaCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-lg font-bold text-green-600">{acceptedCount}</p>
          </div>
        </div>

        {/* Rejected Applicants */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer ${
            activeFilters.includes("Rejected") ? "bg-red-100" : "bg-gray-50"
          }`}
          onClick={() => toggleFilter("Rejected")}
        >
          <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <ImCross className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-lg font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>

        {/* Pending Applicants */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer ${
            activeFilters.includes("Pending") ? "bg-yellow-100" : "bg-gray-50"
          }`}
          onClick={() => toggleFilter("Pending")}
        >
          <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            <MdPendingActions className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-lg font-bold text-yellow-600">{pendingCount}</p>
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
              <tr
                key={applicant?.id || index}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                {/* Serial Number */}
                <th>{startIndex + index + 1}</th>

                {/* Applicant Info */}
                <td className="flex items-center gap-4">
                  {/* Avatar */}
                  <img
                    src={
                      applicant?.avatar ||
                      applicant?.profileImage ||
                      DefaultApplicant
                    }
                    alt={applicant?.name || applicant?.fullname || "N/A"}
                    className="w-16 h-16 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = DefaultApplicant; // fallback image
                    }}
                  />

                  <h3
                    className="font-bold cursor-pointer hover:text-blue-600 transition"
                    onClick={() => {
                      setSelectedApplicantName(applicant?.userId || "N/A");
                      document
                        .getElementById("View_Applicant_Profile_Modal")
                        ?.showModal();
                    }}
                  >
                    {applicant?.name || "N/A"}
                  </h3>
                </td>

                {/* Status */}
                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
                      applicant?.status === "Accepted"
                        ? "bg-green-500"
                        : applicant?.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {applicant?.status || "Pending"}
                  </span>
                </td>

                {/* Application Time */}
                <td className="text-center">
                  {formatDate(applicant?.appliedAt)}{" "}
                  <span className="text-gray-500">
                    ({getTimeAgo(applicant?.appliedAt)})
                  </span>
                </td>

                {/* Action Column */}
                <td className="text-right w-96">
                  <div className="flex justify-end gap-2">
                    {(() => {
                      const status = getStatus(applicant);
                      const isCompleted =
                        mentorship?.status?.toLowerCase() === "completed"; // check mentorship status

                      return (
                        <>
                          {/* View Button (always available, but disabled if Completed) */}
                          <button
                            onClick={() => {
                              if (isCompleted) return;
                              setSelectedApplicationID(applicant?._id);
                              document
                                .getElementById(
                                  "View_Mentorship_Application_Modal"
                                )
                                ?.showModal();
                            }}
                            data-tooltip-id={`viewTip-${id}-${applicant?._id}`}
                            data-tooltip-content="View Application Details"
                            disabled={isCompleted}
                            className={`flex gap-2 items-center border-2 font-semibold py-2 px-5 rounded-lg transition cursor-pointer ${
                              isCompleted
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-700/90"
                            }`}
                          >
                            <IoIosEye className="text-xl" /> View
                          </button>
                          <Tooltip id={`viewTip-${id}-${applicant?._id}`} />

                          {/* Pending Applications → Accept & Reject */}
                          {(status === "Pending" || !status) && (
                            <>
                              {/* Accept Button */}
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    applicant?._id,
                                    "Accepted",
                                    applicant?.name
                                  )
                                }
                                disabled={
                                  isCompleted || loadingId === applicant?._id
                                }
                                data-tooltip-id={`acceptTip-${id}-${applicant?._id}`}
                                data-tooltip-content="Accept this Application"
                                className={`flex gap-2 items-center border-2 font-semibold py-2 px-5 rounded-lg transition cursor-pointer ${
                                  isCompleted
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-700/90"
                                }`}
                              >
                                {loadingId === applicant?._id ? (
                                  <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                                ) : (
                                  <FaCheck />
                                )}
                                Accept
                              </button>
                              <Tooltip
                                id={`acceptTip-${id}-${applicant?._id}`}
                              />

                              {/* Reject Button */}
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    applicant?._id,
                                    "Rejected",
                                    applicant?.name
                                  )
                                }
                                disabled={
                                  isCompleted || loadingId === applicant?._id
                                }
                                data-tooltip-id={`rejectTip-${id}-${applicant?._id}`}
                                data-tooltip-content="Reject this Application"
                                className={`flex gap-2 items-center border-2 font-semibold py-2 px-5 rounded-lg transition cursor-pointer ${
                                  isCompleted
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-red-500 text-white hover:bg-red-700/90"
                                }`}
                              >
                                {loadingId === applicant?._id ? (
                                  <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                                ) : (
                                  <ImCross />
                                )}
                                Reject
                              </button>
                              <Tooltip
                                id={`rejectTip-${id}-${applicant?._id}`}
                              />
                            </>
                          )}

                          {/* Accepted or Rejected → Revert */}
                          {(status === "Accepted" || status === "Rejected") && (
                            <>
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    applicant?._id,
                                    "Pending",
                                    applicant?.name
                                  )
                                }
                                disabled={
                                  isCompleted || loadingId === applicant?._id
                                }
                                data-tooltip-id={`revertTip-${id}-${applicant?._id}`}
                                data-tooltip-content="Revert to Pending"
                                className={`flex gap-2 items-center border-2 font-semibold py-2 px-5 rounded-lg transition cursor-pointer ${
                                  isCompleted
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-yellow-500 text-white hover:bg-yellow-700/90"
                                }`}
                              >
                                {loadingId === applicant?._id ? (
                                  <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                                ) : (
                                  <MdRestartAlt className="text-2xl" />
                                )}
                                Revert
                              </button>
                              <Tooltip
                                id={`revertTip-${id}-${applicant?._id}`}
                              />
                            </>
                          )}
                        </>
                      );
                    })()}
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
    durationWeeks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    Mentor: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      profileImage: PropTypes.string,
      bio: PropTypes.string,
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      position: PropTypes.string,
    }),
    applications: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
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
  refetchAll: PropTypes.func.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,

  // Application selection
  setSelectedApplicationID: PropTypes.func.isRequired,
  setSelectedApplicantName: PropTypes.func.isRequired,
};

export default MyMentorshipApplicationsTable;
