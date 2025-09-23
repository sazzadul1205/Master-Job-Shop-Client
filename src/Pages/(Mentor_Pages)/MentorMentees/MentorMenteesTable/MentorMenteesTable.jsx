import { useState } from "react";
import MMTCMIdentifier from "./MMTCMIdentifier/MMTCMIdentifier";
import { FaArrowLeft, FaArrowRight, FaRegMessage } from "react-icons/fa6";
import PropTypes from "prop-types";

const MentorMenteesTable = ({
  courseApplications = [],
  mentorshipApplications = [],
}) => {
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust for bigger or smaller page size

  // Merge and sort applications
  const mergedApplications = [
    ...(courseApplications || []).map((app) => ({ ...app, type: "Course" })),
    ...(mentorshipApplications || []).map((app) => ({
      ...app,
      type: "Mentorship",
    })),
  ];

  const sortedApplications = mergedApplications.sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = sortedApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Toggle selection
  const toggleApplicant = (appId) => {
    setSelectedApplicants((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  // Check if all are selected
  const allSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((a) => selectedApplicants.includes(a._id));

  return (
    <div className="mx-7 my-9 overflow-x-auto text-black">
      <table className="w-full rounded-xl overflow-hidden border border-black">
        {/* Table Header */}
        <thead className="bg-gray-200 ">
          <tr className="items-center text-left">
            {/* Checkbox column */}
            <th className="p-3 text-center w-12">
              <input
                type="checkbox"
                className="w-5 h-5 mt-2 text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                onChange={() =>
                  setSelectedApplicants(
                    allSelected
                      ? selectedApplicants.filter(
                          (id) =>
                            !paginatedApplications.find((a) => a._id === id)
                        )
                      : [
                          ...selectedApplicants,
                          ...paginatedApplications
                            .filter((a) => !selectedApplicants.includes(a._id))
                            .map((a) => a._id),
                        ]
                  )
                }
                checked={allSelected}
              />
            </th>

            {/* Other columns */}
            <th className="p-3 py-5">Applicant</th>
            <th className="p-3 py-5">Email & Phone</th>
            <th className="p-3 py-5">Mentorship / Course Name</th>
            <th className="p-3 py-5">Applied At</th>
            <th className="p-3 py-5">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {paginatedApplications.length > 0 ? (
            paginatedApplications.map((app) => {
              const isSelected = selectedApplicants.includes(app._id);

              return (
                <tr
                  key={app._id}
                  onClick={() => toggleApplicant(app._id)}
                  className={`border-t-2 border-b-black border-gray-200 cursor-pointer transition-colors duration-200 px-4 ${
                    isSelected
                      ? "bg-blue-200 hover:bg-blue-300"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleApplicant(app._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        app.profileImage || "https://i.ibb.co/0jq81tfx/blob.jpg"
                      }
                      alt={app.name || "Applicant"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{app.name || "N/A"}</span>
                  </td>

                  <td className="p-3">
                    <div>{app.email || "N/A"}</div>
                    <div className="text-gray-500">
                      {app.phone ? `+${app.phone}` : "N/A"}
                    </div>
                  </td>

                  <td className="p-3">
                    <MMTCMIdentifier
                      type={app.type}
                      courseId={app.courseId}
                      mentorshipId={app.mentorshipId}
                    />
                  </td>
                  <td className="p-3">
                    {app.appliedAt
                      ? new Date(app.appliedAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <button className="flex items-center gap-2 px-3 py-3 font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">
                      <FaRegMessage className="text-base" />
                      Message
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-500">
                No applicants added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5 text-sm text-gray-700">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex gap-2 items-center px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold hover:bg-gray-100 bg-white"
            >
              <FaArrowLeft />
              Prev
            </button>

            {/* Dynamic page numbers (show 5 pages window) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 bg-white "
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex gap-2 items-center px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold hover:bg-gray-100 bg-white"
            >
              Next
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Validation
MentorMenteesTable.propTypes = {
  courseApplications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      profileImage: PropTypes.string,
      courseId: PropTypes.string,
      appliedAt: PropTypes.string,
    })
  ),
  mentorshipApplications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      profileImage: PropTypes.string,
      mentorshipId: PropTypes.string,
      appliedAt: PropTypes.string,
    })
  ),
};

export default MentorMenteesTable;
