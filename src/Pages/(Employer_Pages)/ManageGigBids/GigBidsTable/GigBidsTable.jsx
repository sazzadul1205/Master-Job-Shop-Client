// Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Icons
import { FaCheck, FaEye, FaRegClock } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const GigBidsTable = ({
  refetch,
  currentPage,
  setUserEmail,
  paginatedBids,
  ITEMS_PER_PAGE,
  setSelectedBidID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Handle Reject Applications
  const handleRejectBid = async (applicantId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Reject this applicant?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Reject",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
      });

      if (!isConfirmed) return;

      const response = await axiosPublic.put(`/GigBids/Status/${applicantId}`, {
        status: "Rejected",
      });

      if (response.status !== 200) {
        console.error("Failed to reject applicant:", response.statusText);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to Reject applicant. Please try again.",
          confirmButtonText: "Ok",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Applicant has been Rejected.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      refetch();

      // Optionally trigger refresh or state update here
    } catch (error) {
      console.error("Error Rejected applicant:", error);
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
      {/* Bids Table */}
      <table className="min-w-full bg-white text-sm text-gray-800">
        <thead className="bg-gray-100 border-b text-gray-900 text-left">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Profile</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Bid Amount</th>
            <th className="px-4 py-2">Delivery Days</th>
            <th className="px-4 py-2">Submitted</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>

        {/* Bids Table - Body */}
        <tbody className="divide-y divide-gray-200">
          {paginatedBids && paginatedBids.length > 0 ? (
            paginatedBids.map((applicant, idx) => {
              const interviewDate = applicant?.interview?.interviewTime
                ? new Date(applicant.interview.interviewTime)
                : null;
              const now = new Date();

              const timeLeftMs = interviewDate ? interviewDate - now : 0;
              const msInMinute = 1000 * 60;
              const msInHour = msInMinute * 60;
              const msInDay = msInHour * 24;
              const msInMonth = msInDay * 30;

              let timeLeft = "";

              if (!interviewDate || timeLeftMs <= 0) {
                timeLeft = "Interview time passed";
              } else {
                const months = Math.floor(timeLeftMs / msInMonth);
                const days = Math.floor((timeLeftMs % msInMonth) / msInDay);
                const hours = Math.floor((timeLeftMs % msInDay) / msInHour);
                const minutes = Math.floor(
                  (timeLeftMs % msInHour) / msInMinute
                );

                timeLeft =
                  (months > 0 ? `${months}mo ` : "") +
                  (days > 0 ? `${days}d ` : "") +
                  (hours > 0 ? `${hours}h ` : "") +
                  (minutes > 0 ? `${minutes}m` : "");

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
                  {/* Email */}
                  <td className="px-4 py-2">
                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1} .
                  </td>

                  {/* Basic Information */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Image */}
                      <img
                        src={applicant.profileImage}
                        alt={applicant.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-300"
                      />
                      {/* Name */}
                      <span
                        onClick={() => {
                          document.getElementById("View_Profile_Modal").showModal()
                          setUserEmail(applicant.email);
                        }}
                        className="font-medium hover:underline cursor-pointer">
                        {applicant.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-2">{applicant?.email}</td>

                  {/* Phone */}
                  <td className="px-4 py-2">{applicant?.phone}</td>

                  {/* Bid Amount */}
                  <td className="px-4 py-2">{applicant?.bidAmount}</td>

                  {/* Delivery Days */}
                  <td className="px-4 py-2">
                    {applicant?.deliveryDays}{" "}
                    {applicant?.deliveryDays === 1 ? "Day" : "Days"}
                  </td>

                  {/* Submitted Date */}
                  <td className="px-4 py-2">
                    {new Date("2025-08-07T04:03:55.886Z").toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </td>

                  {/* // Pending Status */}
                  <>
                    {applicant.status === "Rejected" ? (
                      // Rejected Status
                      <td className="px-4 py-3 w-[200px]">
                        <div className="flex justify-center items-center h-full">
                          <p className="text-red-600 font-semibold text-center">
                            Bid Rejected
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
                                Bid Accepted
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
                              {/* View Bid Button */}
                              <button
                                onClick={() => {
                                  setSelectedBidID(applicant?._id);
                                  document
                                    .getElementById("View_Gig_Bids_Modal")
                                    .showModal();
                                }}
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                              >
                                <FaEye />
                                View Bid
                              </button>

                              {/* View Bid Interview Button */}
                              <button
                                onClick={() => {
                                  setSelectedBidID(applicant?._id);
                                  document
                                    .getElementById("View_Bid_Interview_Modal")
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
                            setSelectedBidID(applicant?._id);
                            document
                              .getElementById("View_Gig_Bids_Modal")
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
                            handleRejectBid(applicant._id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 font-medium text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded transition cursor-pointer"
                        >
                          <ImCross />
                          Reject
                        </button>

                        {/* Accept Button */}
                        <button
                          onClick={() => {
                            setSelectedBidID(applicant?._id);
                            document
                              .getElementById("Accepted_Bid_Modal")
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
                No Bids found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Prop Validation
GigBidsTable.propTypes = {
  refetch: PropTypes.func.isRequired,
  setUserEmail: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  paginatedBids: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
      bidAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      deliveryDays: PropTypes.number,
      status: PropTypes.oneOf(["Pending", "Accepted", "Rejected"]),
      interview: PropTypes.shape({
        interviewTime: PropTypes.string,
      }),
    })
  ),
  ITEMS_PER_PAGE: PropTypes.number.isRequired,
  setSelectedBidID: PropTypes.func.isRequired,
};

export default GigBidsTable;
