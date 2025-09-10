import { useState } from "react";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Shared
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

// Modals
import EditMentorshipModal from "./EditMentorshipModal/EditMentorshipModal";
import MentorshipDetailsModal from "../../../(Public_Pages)/Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";

// Utility: Format Budget Display
const formatBudget = (amount, currency = "USD", isNegotiable = false) => {
  if (!amount) return "Free";
  return `${currency} ${amount}${isNegotiable ? " (Negotiable)" : ""}`;
};

// Utility: Posted Time
const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";
  const postedDate = new Date(isoString);
  const today = new Date();
  const diff = today - postedDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

const MentorMyActiveMentorship = ({ error, isLoading, MentorshipData }) => {
  // State Variables
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

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
      <h3 className="text-2xl font-bold mb-6">Ongoing Mentorship&apos;s</h3>

      {/* Mentorship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMentorship && sortedMentorship.length > 0 ? (
          sortedMentorship.map((mentorship, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 hover:shadow-2xl"
            >
              {/* Content */}
              <div className="space-y-2">
                {/* Title */}
                <h4 className="font-semibold text-lg text-gray-900">
                  {mentorship.title || "Untitled Mentorship"}
                </h4>

                {/* Category */}
                <p className="text-gray-500 text-sm">
                  {mentorship?.category || "Category not specified"} ›{" "}
                  {mentorship?.subCategory || "Subcategory not specified"}
                </p>

                {/* Location */}
                <p className="text-sm">
                  <span className="font-semibold">Location:</span>{" "}
                  <span className="text-gray-800">
                    {mentorship?.location?.city
                      ? `${mentorship?.location?.city}, ${mentorship?.location?.country}`
                      : mentorship?.isRemote
                      ? "Remote"
                      : "Not specified"}
                  </span>
                </p>

                {/* Fee */}
                <p className="text-sm">
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
                <p className="text-sm text-gray-400">
                  Posted:{" "}
                  {mentorship?.postedAt
                    ? calculateDaysAgo(mentorship.postedAt)
                    : "Unknown"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4 gap-2">
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
                <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition-colors cursor-pointer">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          // Fallback: Center Card for Creating Mentorship
          <div className="col-span-full mx-auto max-w-3xl flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-10 text-center space-y-6">
            {/* Icon */}
            <div className="bg-blue-100 p-4 rounded-full">
              <FaPlus className="text-4xl text-blue-600" />
            </div>

            {/* Heading */}
            <h3 className="text-2xl font-bold text-gray-900">
              No Mentorship&apos;s Created Yet
            </h3>

            {/* Description */}
            <p className="text-gray-600 font-semibold text-base ">
              It looks like you haven’t created any mentorship programs yet.
              Mentorship&apos;s are a great way to guide aspiring developers,
              share your knowledge, and build your professional network.
            </p>

            {/* Encouragement */}
            <p className="text-gray-500 text-sm ">
              Click the button below to create your first mentorship program.
              You can set up topics, schedule sessions, and start helping
              mentees grow their skills today!
            </p>

            {/* Create Mentorship Button */}
            <button
              onClick={() =>
                document.getElementById("Create_Mentorship_Modal").showModal()
              }
              className="flex items-center gap-3 bg-[#002242] hover:bg-[#00509e] text-white shadow hover:shadow-2xl font-semibold px-6 py-3 rounded-md transition-colors duration-500 cursor-pointer"
            >
              <FaPlus /> Create New Mentorship
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* Mentorship Details Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          isEditor={true}
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>

      {/* Edit Mentorship Modal */}
      <dialog id="Edit_Mentorship_Modal" className="modal">
        <EditMentorshipModal
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
MentorMyActiveMentorship.propTypes = {
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
};

export default MentorMyActiveMentorship;
