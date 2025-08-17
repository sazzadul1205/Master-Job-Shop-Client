// Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Icons
import { FaCheck, FaEye, FaRegClock } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const InternshipApplicantTable = ({
  refetch,
  currentPage,
  setUserEmail,
  ITEMS_PER_PAGE,
  paginatedApplicants,
  setSelectedApplicationID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Handle Reject Applications
  const handleRejectApplicant = async (applicantId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to reject this applicant?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
      });

      if (!isConfirmed) return;

      const response = await axiosPublic.put(
        `/InternshipApplications/Status/${applicantId}`,
        {
          status: "Rejected",
        }
      );

      if (response.status !== 200) {
        console.error("Failed to reject applicant:", response.statusText);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to reject applicant. Please try again.",
          confirmButtonText: "Ok",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Applicant has been rejected.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      refetch();

      // Optionally trigger refresh or state update here
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
      {/* Applicants Table */}
      <table className="min-w-full bg-white text-sm text-gray-800">
        {/* Applicants Table - Header */}
        <thead className="bg-gray-100 border-b text-gray-900 text-left">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Applicant</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Applied On</th>
            <th className="px-4 py-3">Resume</th>
            <th className="px-4 py-3 text-center justify-end">Action</th>
          </tr>
        </thead>

        {/* Applicants Table - Body */}
        <tbody className="divide-y divide-gray-200">
          {paginatedApplicants && paginatedApplicants.length > 0 ? (
            paginatedApplicants.map((applicant, idx) => {
              // Get the interview date from the applicant object, if available
              // If no interview time is set, interviewDate will be null
              const interviewDate = applicant?.interview?.interviewTime
                ? new Date(applicant.interview.interviewTime)
                : null;

              // Get the current date and time
              const now = new Date();

              // Calculate the time left in milliseconds
              // If interviewDate is null, timeLeftMs will be 0
              const timeLeftMs = interviewDate ? interviewDate - now : 0;

              // Time unit conversions
              const msInMinute = 1000 * 60; // 1 minute = 60,000 ms
              const msInHour = msInMinute * 60; // 1 hour = 3,600,000 ms
              const msInDay = msInHour * 24; // 1 day = 86,400,000 ms
              const msInMonth = msInDay * 30; // Approximate month length = 2,592,000,000 ms

              // Variable to store the final formatted time left
              let timeLeft = "";

              // Case 1: No interview scheduled or time already passed
              if (!interviewDate || timeLeftMs <= 0) {
                timeLeft = "Interview time passed";
              } else {
                // Calculate months, days, hours, and minutes remaining
                const months = Math.floor(timeLeftMs / msInMonth);
                const days = Math.floor((timeLeftMs % msInMonth) / msInDay);
                const hours = Math.floor((timeLeftMs % msInDay) / msInHour);
                const minutes = Math.floor(
                  (timeLeftMs % msInHour) / msInMinute
                );

                // Build the human-readable string for remaining time
                // Only include units that are greater than zero
                timeLeft =
                  (months > 0 ? `${months}mo ` : "") +
                  (days > 0 ? `${days}d ` : "") +
                  (hours > 0 ? `${hours}h ` : "") +
                  (minutes > 0 ? `${minutes}m` : "");

                // If all values are zero, show "Less than a minute left"
                if (!timeLeft.trim()) timeLeft = "Less than a minute left";
              }

              return (
                <tr
                  key={applicant._id}
                  className={`${applicant.status === "Rejected"
                    ? "bg-red-50"
                    : applicant.status === "Accepted" &&
                      interviewDate &&
                      interviewDate < now
                      ? "bg-gray-100"
                      : applicant.status === "Accepted"
                        ? "bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {/* Applicant Number */}
                  <td className="px-4 py-3 font-medium whitespace-nowrap ">
                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}.
                  </td>

                  {/* Basic Information */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Image */}
                      {applicant.profileImage ? (
                        <img
                          src={applicant.profileImage}
                          alt={
                            applicant.fullName || applicant.name || "Applicant"
                          }
                          className="w-9 h-9 rounded-full object-cover border border-gray-300"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                          {(applicant.fullName || applicant.name || "A")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      {/* Name */}
                      <span className="font-medium">
                        {applicant.fullName || applicant.name || "Unnamed"}
                      </span>
                      {/* Name */}
                      <span
                        onClick={() => {
                          document.getElementById("View_Profile_Modal").showModal()
                          setUserEmail(applicant.email);
                        }}
                        className="font-medium hover:underline cursor-pointer">
                        {applicant.name || applicant.fullName}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">{applicant.email}</td>

                  {/* Phone */}
                  <td className="px-4 py-3">
                    {applicant.phone?.startsWith("+")
                      ? applicant.phone
                      : applicant.phone
                        ? `+${applicant.phone}`
                        : "N/A"}
                  </td>

                  {/* Applied At */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {applicant.appliedAt
                      ? new Date(applicant.appliedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                      : "N/A"}
                  </td>

                  {/* Resume Download */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {applicant.resumeUrl ? (
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  {/* Buttons */}
                  <>
                    {applicant.status === "Rejected" ? (
                      // Rejected Status
                      <td className="px-4 py-3 w-[200px]">
                        <div className="flex justify-center items-center h-full">
                          <p className="text-red-600 font-semibold text-center">
                            Applicant Rejected
                          </p>
                        </div>
                      </td>
                    ) : applicant.status === "Accepted" ? (
                      // Accepted Status
                      <td className="px-4 py-3 w-[300px]">
                        <div className="flex justify-center items-center h-full">
                          <div className="flex flex-col items-center space-y-1">
                            {/* Title */}
                            {interviewDate && interviewDate < now ? (
                              <></>
                            ) : (
                              <p className="text-green-600 font-semibold">
                                Applicant Accepted
                              </p>
                            )}

                            {/* Interview Status */}
                            {interviewDate && interviewDate < now ? (
                              <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
                                <FaRegClock />
                                Interview Time Passed
                              </p>
                            ) : (
                              <p className="text-gray-600 text-sm flex items-center gap-1">
                                <FaRegClock /> {timeLeft}
                              </p>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-5 items-center">
                              {/* View Applicant Button */}
                              <button
                                onClick={() => {
                                  setSelectedApplicationID(applicant?._id);
                                  document
                                    .getElementById(
                                      "View_Internship_Applications_Modal"
                                    )
                                    .showModal();
                                }}
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                              >
                                <FaEye />
                                View Application
                              </button>

                              {/* View Applicant Interview Button */}
                              <button
                                onClick={() => {
                                  setSelectedApplicationID(applicant?._id);
                                  document
                                    .getElementById("View_Interview_Modal")
                                    .showModal();
                                }}
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                              >
                                <FaEye />
                                View Interview
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    ) : (
                      // Pending Status
                      <td className="px-4 py-3 flex justify-end items-center gap-2 whitespace-nowrap flex-shrink-0">
                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedApplicationID(applicant?._id);
                            document
                              .getElementById(
                                "View_Internship_Applications_Modal"
                              )
                              .showModal();
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 font-medium text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 rounded transition cursor-pointer"
                        >
                          <FaEye />
                          View
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => {
                            handleRejectApplicant(applicant._id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 font-medium text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded transition cursor-pointer"
                        >
                          <ImCross />
                          Reject
                        </button>

                        {/* Accept Button */}
                        <button
                          onClick={() => {
                            setSelectedApplicationID(applicant?._id);
                            document
                              .getElementById("Accepted_Application_Modal")
                              .showModal();
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 font-medium text-green-500 hover:text-white border border-green-500 hover:bg-green-500 rounded transition cursor-pointer"
                        >
                          <FaCheck />
                          Accept
                        </button>
                      </td>
                    )}
                  </>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-6 text-gray-500">
                No applicants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Prop Validation
InternshipApplicantTable.propTypes = {
  refetch: PropTypes.func.isRequired,
  setUserEmail: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  ITEMS_PER_PAGE: PropTypes.number.isRequired,
  paginatedApplicants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
      fullName: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      appliedAt: PropTypes.string,
      resumeUrl: PropTypes.string,
      status: PropTypes.oneOf(["Pending", "Accepted", "Rejected"]),
      interview: PropTypes.shape({
        interviewTime: PropTypes.string,
      }),
    })
  ),
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default InternshipApplicantTable;
