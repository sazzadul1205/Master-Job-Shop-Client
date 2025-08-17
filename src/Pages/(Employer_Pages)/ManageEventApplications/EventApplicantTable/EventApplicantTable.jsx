// Package
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Icons
import { FaCheck, FaEye } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const EventApplicantTable = ({
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

      const response = await axiosPublic.patch(
        `/EventApplications/Status/Reject/${applicantId}`
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

  // Handle Accept Applications
  const handleAcceptApplicant = async (applicantId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Accept this applicant?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Accept",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
      });

      if (!isConfirmed) return;

      const response = await axiosPublic.patch(
        `/EventApplications/Status/Accept/${applicantId}`
      );

      if (response.status !== 200) {
        console.error("Failed to Accept applicant:", response.statusText);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to Accept applicant. Please try again.",
          confirmButtonText: "Ok",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Accepted",
        text: "Applicant has been Accepted.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      refetch();

      // Optionally trigger refresh or state update here
    } catch (error) {
      console.error("Error Accepting applicant:", error);
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
      {/* Table */}
      <table className="min-w-full bg-white text-sm text-gray-800">
        {/* Table - Header */}
        <thead>
          <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Attendees</th>
            <th className="px-4 py-3">Applied At</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* Table - Body */}
        <tbody>
          {paginatedApplicants?.length > 0 ? (
            paginatedApplicants.map((applicant, idx) => (
              <tr
                key={applicant._id}
                className={`${applicant.status === "Rejected"
                  ? "bg-red-50"
                  : applicant.status === "Accepted"
                    ? "bg-green-50"
                    : "hover:bg-gray-50"
                  }`}
              >
                {/* Index */}
                <td className="px-4 py-3 text-center">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1} .
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
                    <span
                      onClick={() => {
                        document.getElementById("View_Profile_Modal").showModal()
                        setUserEmail(applicant.email);
                      }}
                      className="font-medium hover:underline cursor-pointer">
                      {applicant.fullName || applicant.name || "Unnamed"}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3">{applicant.email}</td>

                {/* Phone */}
                <td className="px-4 py-3">{applicant.phone}</td>

                {/* Attendees */}
                <td className="px-4 py-3 text-center">{applicant.attendees}</td>

                {/* Applied At */}
                <td className="px-4 py-3">
                  {new Date(applicant.appliedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 flex justify-end items-center gap-2 whitespace-nowrap flex-shrink-0">
                  {applicant.status === "Accepted" ? (
                    <div className="w-[300px] flex justify-center items-center gap-3">
                      <span className="text-green-600 font-semibold">
                        Accepted
                      </span>
                      {/* View Button */}
                      <button
                        onClick={() => {
                          setSelectedApplicationID(applicant?._id);
                          document
                            .getElementById("View_Event_Applications_Modal")
                            .showModal();
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 font-medium text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 rounded transition cursor-pointer"
                      >
                        <FaEye />
                        View
                      </button>
                    </div>
                  ) : applicant.status === "Rejected" ? (
                    // Rejected Status
                    <div className="w-[300px] flex justify-center items-center h-full">
                      <p className="text-red-600 font-semibold text-center">
                        Applicant Rejected
                      </p>
                    </div>
                  ) : (
                    <div className="w-[300px] flex justify-center items-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => {
                          setSelectedApplicationID(applicant?._id);
                          document
                            .getElementById("View_Event_Applications_Modal")
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
                          handleRejectApplicant(applicant?._id);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 font-medium text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded transition cursor-pointer"
                      >
                        <ImCross />
                        Reject
                      </button>

                      {/* Accept Button */}
                      <button
                        onClick={() => {
                          handleAcceptApplicant(applicant?._id);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 font-medium text-green-500 hover:text-white border border-green-500 hover:bg-green-500 rounded transition cursor-pointer"
                      >
                        <FaCheck />
                        Accept
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            // Fallback Row
            <tr>
              <td
                colSpan="9"
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                No applicants found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Prop Validation
EventApplicantTable.propTypes = {
  refetch: PropTypes.func.isRequired,
  setUserEmail: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  ITEMS_PER_PAGE: PropTypes.number.isRequired,
  paginatedApplicants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["Accepted", "Rejected", "Pending"]).isRequired,
      profileImage: PropTypes.string,
      fullName: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      attendees: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      appliedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ).isRequired,
  setSelectedApplicationID: PropTypes.func.isRequired,
};

export default EventApplicantTable;
