import { useState } from "react";
import MMTCMIdentifier from "./MMTCMIdentifier/MMTCMIdentifier";
import { FaArrowLeft, FaArrowRight, FaRegMessage } from "react-icons/fa6";
import PropTypes from "prop-types";
import { MdEmail, MdPhone } from "react-icons/md";

const MentorMenteesTable = ({
  selectedApplicants,
  mergedApplications,
  setSelectedApplicants,
  setSelectedApplicantName,
}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Items Per Page
  const itemsPerPage = 10;

  // Sort by Date
  const sortedApplications = mergedApplications.sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  );

  // Pagination Config
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = sortedApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Toggle selection (store full applicant object)
  const toggleApplicant = (app) => {
    setSelectedApplicants((prev) => {
      const exists = prev.find((p) => p._id === app._id);
      if (exists) {
        return prev.filter((p) => p._id !== app._id);
      }
      return [
        ...prev,
        {
          _id: app._id,
          name: app.name || "N/A",
          email: app.email || "N/A",
          phone: app.phone || "N/A",
        },
      ];
    });
  };

  // Check if all are selected
  const allSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((a) =>
      selectedApplicants.some((p) => p._id === a._id)
    );

  return (
    <div className="mx-7 my-9 overflow-x-auto text-black">
      <table className="w-full rounded-xl overflow-hidden border border-black">
        <thead className="bg-gray-200 ">
          <tr className="items-center text-left">
            {/* Select All */}
            <th className="p-3 text-center w-12">
              <input
                type="checkbox"
                className="w-5 h-5 mt-2 text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                onChange={() =>
                  setSelectedApplicants(
                    allSelected
                      ? selectedApplicants.filter(
                          (s) =>
                            !paginatedApplications.some((a) => a._id === s._id)
                        )
                      : [
                          ...selectedApplicants,
                          ...paginatedApplications
                            .filter(
                              (a) =>
                                !selectedApplicants.some((s) => s._id === a._id)
                            )
                            .map((a) => ({
                              _id: a._id,
                              name: a.name || "N/A",
                              email: a.email || "N/A",
                              phone: a.phone || "N/A",
                            })),
                        ]
                  )
                }
                checked={allSelected}
              />
            </th>
            <th className="p-3 py-5">Applicant</th>
            <th className="p-3 py-5">Email & Phone</th>
            <th className="p-3 py-5">Mentorship / Course Name</th>
            <th className="p-3 py-5">Applied At</th>
            <th className="p-3 py-5">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedApplications.length > 0 ? (
            paginatedApplications.map((app) => {
              const isSelected = selectedApplicants.some(
                (p) => p._id === app._id
              );

              return (
                <tr
                  key={app._id}
                  onClick={() => toggleApplicant(app)}
                  className={`border-t-2 border-b-black border-gray-200 cursor-pointer transition-colors duration-200 px-4 ${
                    isSelected
                      ? "bg-blue-200 hover:bg-blue-300"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleApplicant(app)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  {/* Applicant */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        app.profileImage || "https://i.ibb.co/0jq81tfx/blob.jpg"
                      }
                      alt={app.name || "Applicant"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3
                      className="font-bold cursor-pointer hover:text-blue-600 transition"
                      onClick={() => {
                        setSelectedApplicantName(app?.userId || "N/A");
                        document
                          .getElementById("View_Applicant_Profile_Modal")
                          ?.showModal();
                      }}
                    >
                      {app?.name || "N/A"}
                    </h3>
                  </td>

                  {/* Email & Phone */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-gray-600" />
                      <span>{app.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MdPhone className="text-gray-600" />
                      <span>{app.phone ? `+${app.phone}` : "N/A"}</span>
                    </div>
                  </td>

                  {/* Mentorship / Course */}
                  <td className="p-3">
                    <MMTCMIdentifier
                      type={app.type}
                      courseId={app.courseId}
                      mentorshipId={app.mentorshipId}
                    />
                  </td>

                  {/* Applied At */}
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

                  {/* Message Button */}
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
              <td
                colSpan={6}
                rowSpan={3}
                className="text-center py-10 text-gray-500"
              >
                No applicants added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5 text-sm text-gray-700">
          {/* Page Numbers */}
          <span>
            Page {currentPage} of {totalPages}
          </span>

          {/* Pagination Buttons */}
          <div className="flex gap-2">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex gap-2 items-center px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold hover:bg-gray-100 bg-white"
            >
              <FaArrowLeft /> Prev
            </button>

            {/* Page Number Buttons */}
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
                      : "hover:bg-gray-100 bg-white"
                  }`}
                >
                  {page}
                </button>
              ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex gap-2 items-center px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold hover:bg-gray-100 bg-white"
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Validation
MentorMenteesTable.propTypes = {
  selectedApplicants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
    })
  ).isRequired,
  mergedApplications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      profileImage: PropTypes.string,
      type: PropTypes.oneOf(["Course", "Mentorship"]).isRequired,
      courseId: PropTypes.string,
      mentorshipId: PropTypes.string,
      appliedAt: PropTypes.string,
    })
  ).isRequired,
  setSelectedApplicants: PropTypes.func.isRequired,
  setSelectedApplicantName: PropTypes.func.isRequired,
};

export default MentorMenteesTable;
