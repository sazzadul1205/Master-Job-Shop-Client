// Packages
import PropTypes from "prop-types";

// Icons
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

// Shared
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

// Functions
import { formatBudget } from "../../../../Functions/formatBudget";
import { calculateDaysAgo } from "../../../../Functions/calculateDaysAgo";

const MentorMyArchivedMentorship = ({
  error,
  isLoading,
  toggleStar,
  handleDelete,
  MentorshipData,
  setSelectedMentorshipID,
}) => {
  // Sort Mentorship's by postedAt (most recent first)
  const sortedMentorship = MentorshipData
    ? [...MentorshipData].sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
      )
    : [];

  // Loading State
  if (isLoading) return <Loading />;

  // Error State
  if (error) return <Error />;

  return (
    <div className="text-black">
      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold">
        Archived Mentorship&apos;s ( {sortedMentorship?.length || 0} )
      </h3>

      {/* Divider */}
      <p className="bg-blue-500 w-full h-[2px] my-2" />

      {/* Mentorship Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
        {sortedMentorship && sortedMentorship.length > 0 ? (
          sortedMentorship.map((mentorship, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col justify-between transition-transform duration-300 hover:shadow-2xl"
            >
              {/* Status Badge */}
              <span
                className={`absolute -top-3 -left-3 px-3 sm:px-5 py-1 text-xs sm:text-sm font-semibold rounded-full shadow-xl ${
                  ["active", "closed"].includes(
                    mentorship?.status?.toLowerCase()
                  )
                    ? "bg-red-500 text-white"
                    : mentorship?.status?.toLowerCase() === "open"
                    ? "bg-green-500 text-white"
                    : mentorship?.status?.toLowerCase() === "completed"
                    ? "bg-blue-500 text-white"
                    : mentorship?.status?.toLowerCase() === "onhold"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {["active", "closed"].includes(
                  mentorship?.status?.toLowerCase()
                )
                  ? "Closed"
                  : mentorship?.status?.toLowerCase() === "open"
                  ? "Open"
                  : mentorship?.status?.toLowerCase() === "completed"
                  ? "Completed"
                  : mentorship?.status?.toLowerCase() === "onhold"
                  ? "On Hold"
                  : "Unknown"}
              </span>

              {/* Star Toggle */}
              <button
                onClick={() => toggleStar(mentorship._id)}
                className="absolute top-3 right-3 text-xl sm:text-2xl cursor-pointer transition-colors group"
              >
                {mentorship.archived ? (
                  <FaStar className="text-yellow-400 drop-shadow-md" />
                ) : (
                  <FaRegStar className="text-gray-400 hover:text-yellow-400" />
                )}

                {/* Tooltip */}
                <span className="absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {mentorship.archived ? "Archived" : "Un-Archived"}
                </span>
              </button>

              {/* Content */}
              <div className="space-y-2 text-sm sm:text-base pt-5 md:pt-0">
                {/* Title */}
                <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                  {mentorship.title || "Untitled Mentorship"}
                </h4>

                {/* Category */}
                <p className="text-gray-500 text-xs sm:text-sm">
                  {mentorship?.category || "Category not specified"} ›{" "}
                  {mentorship?.subCategory || "Subcategory not specified"}
                </p>

                {/* Location */}
                <p className="text-gray-800 text-xs sm:text-sm">
                  <span className="font-semibold">Location:</span>{" "}
                  {mentorship?.location?.city
                    ? `${mentorship?.location?.city}, ${mentorship?.location?.country}`
                    : mentorship?.isRemote
                    ? "Remote"
                    : "Not specified"}
                </p>

                {/* Fee */}
                <p className="text-xs sm:text-sm">
                  <span className="font-semibold">Fee:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    {mentorship?.fee
                      ? formatBudget(
                          mentorship?.fee?.amount,
                          mentorship?.fee?.currency,
                          mentorship?.fee?.isNegotiable
                        )
                      : "Not specified"}
                  </span>
                </p>

                {/* Posted Date */}
                <p className="text-gray-400 text-xs sm:text-sm">
                  Posted:{" "}
                  {mentorship?.postedAt
                    ? calculateDaysAgo(mentorship.postedAt)
                    : "Unknown"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch mt-4 gap-2">
                {/* View */}
                <button
                  onClick={() => {
                    document
                      .getElementById("Mentorship_Details_Modal")
                      ?.showModal();
                    setSelectedMentorshipID(mentorship._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <FaEye /> View
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    document
                      .getElementById("Edit_Mentorship_Modal")
                      ?.showModal();
                    setSelectedMentorshipID(mentorship._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600 transition-colors cursor-pointer"
                >
                  <FaEdit /> Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(mentorship._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          // Fallback: Center Card for Creating Mentorship
          <div className="col-span-full mx-auto max-w-3xl flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-6 sm:p-10 text-center space-y-4 sm:space-y-6">
            {/* Icon */}
            <div className="bg-blue-100 p-4 rounded-full">
              <FaPlus className="text-3xl sm:text-4xl text-blue-600" />
            </div>

            {/* Heading */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              No Mentorship&apos;s Created Yet
            </h3>

            {/* Description */}
            <p className="text-gray-600 font-semibold text-sm sm:text-base">
              It looks like you haven’t created any mentorship programs yet.
              Mentorship&apos;s are a great way to guide aspiring developers,
              share your knowledge, and build your professional network.
            </p>

            {/* Encouragement */}
            <p className="text-gray-500 text-xs sm:text-sm">
              Click the button below to create your first mentorship program.
              You can set up topics, schedule sessions, and start helping
              mentees grow their skills today!
            </p>

            {/* Create Mentorship Button */}
            <button
              onClick={() =>
                document.getElementById("Create_Mentorship_Modal").showModal()
              }
              className="flex items-center gap-2 sm:gap-3 bg-[#002242] hover:bg-[#00509e] text-white shadow hover:shadow-2xl font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-colors duration-500 cursor-pointer text-sm sm:text-base"
            >
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Create New Mentorship
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Prop Validation
MentorMyArchivedMentorship.propTypes = {
  error: PropTypes.bool,
  isLoading: PropTypes.bool,
  MentorshipData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string,
      subCategory: PropTypes.string,
      location: PropTypes.shape({
        city: PropTypes.string,
        country: PropTypes.string,
      }),
      isRemote: PropTypes.bool,
      fee: PropTypes.shape({
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        currency: PropTypes.string,
        isNegotiable: PropTypes.bool,
      }),
      postedAt: PropTypes.string,
    })
  ).isRequired,
  handleDelete: PropTypes.func,
  toggleStar: PropTypes.func,
  setSelectedMentorshipID: PropTypes.func,
};

export default MentorMyArchivedMentorship;
