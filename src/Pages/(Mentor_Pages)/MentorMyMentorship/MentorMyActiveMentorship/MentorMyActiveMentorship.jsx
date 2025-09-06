import { useState } from "react";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// Shared
import Loading from "../../../../Shared/Loading/Loading";
import Error from "../../../../Shared/Error/Error";

// Modals
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
        {MentorshipData.map((mentorship, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 hover:shadow-2xl"
          >
            <div className="space-y-2">
              {/* Title */}
              <h4 className="font-semibold text-lg text-gray-900">
                {mentorship.title}
              </h4>

              {/* Category */}
              <p className="text-gray-500 text-sm">
                {mentorship?.category} › {mentorship?.subCategory}
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
                {formatBudget(
                  mentorship?.fee?.amount,
                  mentorship?.fee?.currency,
                  mentorship?.fee?.isNegotiable
                )}
              </p>

              {/* Posted Date */}
              <p className="text-sm text-gray-400">
                Posted: {calculateDaysAgo(mentorship?.postedAt)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4 gap-2">
              {/* View Buttons */}
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

              {/* Edit Buttons */}
              <button className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600 transition-colors cursor-pointer">
                <FaEdit /> Edit
              </button>

              {/* Delete Buttons */}
              <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition-colors cursor-pointer">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}

      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          isEditor={true}
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
