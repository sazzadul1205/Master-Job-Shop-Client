import React from "react";
import { FaCheck, FaEye } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const EventApplicantTable = ({
  paginatedApplicants,
  setSelectedApplicationID,
}) => {
  return (
    <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
      <table className="min-w-full bg-white text-sm text-gray-800">
        <thead>
          <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Profile</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Attendees</th>
            <th className="px-4 py-3">Applied At</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedApplicants?.length > 0 ? (
            paginatedApplicants.map((applicant, index) => (
              <tr
                key={applicant._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {/* Index */}
                <td className="px-4 py-3 text-center">{index + 1}</td>

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
                  {/* View Button */}
                  <button
                    onClick={() => {
                      setSelectedApplicationID(applicant?._id);
                      document
                        .getElementById("View_Internship_Applications_Modal")
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
              </tr>
            ))
          ) : (
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

export default EventApplicantTable;
