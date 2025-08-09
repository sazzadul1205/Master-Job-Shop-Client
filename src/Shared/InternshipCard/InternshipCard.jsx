import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Assets
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Icons
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

// Shared
import CommonButton from "../CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Format Budget
const formatBudget = (min, max, currency, negotiable) => {
  if (!min && !max) return "Not specified";
  if (min && !max) return `${currency}${min}+`;
  if (!min && max) return `Up to ${currency}${max}`;
  if (min === max) return `${currency}${min}`;
  return `${currency} ${min} - ${max}${negotiable ? " (Negotiable)" : ""}`;
};

// Calculate Days Ago
const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";
  const postedDate = new Date(isoString);
  const today = new Date();
  const diff = today - postedDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

// Clean String
const cleanString = (str) => str?.replace(/^"(.*)"$/, "$1").trim();

const InternshipCard = ({
  poster,
  refetch,
  internship,
  setSelectedInternshipID,
  setSelectedInternshipData,
}) => {
  const axiosPublic = useAxiosPublic();

  // Handle Delete Internship
  const handleDeleteInternship = async (internshipId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Internship will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/Internship/${internshipId}`);
        Swal.fire({
          title: "Deleted!",
          text: "The Internship has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          position: "center",
        });
        refetch?.();
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "Error",
          text: "Failed to delete Internship. Please try again.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "The Internship is safe.",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
        position: "center",
      });
    }
  };

  return (
    <div className="flex flex-col justify-between border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-lg transition duration-300 min-h-[280px]">
      {/* Poster Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={internship?.postedBy?.profileImage || DefaultUserLogo}
          alt="Poster"
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {internship?.postedBy?.name || "Client"}
          </p>
          {internship?.postedBy?.rating > 0 && (
            <p className="text-xs text-yellow-600">
              ⭐ {internship.postedBy.rating.toFixed(1)}
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {cleanString(internship.title)}
      </h3>

      {/* Category */}
      <p className="text-sm text-gray-600 font-medium mb-1">
        {internship.category} &rsaquo; {internship.subCategory}
      </p>

      {/* Location */}
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold">Location:</span>{" "}
        {internship.isRemote
          ? "Remote"
          : internship.location
          ? internship.location
          : "Not specified"}
      </p>

      {/* Budget */}
      <p className="text-sm text-green-700 font-semibold mb-3">
        Budget:{" "}
        {formatBudget(
          internship.budget?.min,
          internship.budget?.max,
          internship.budget?.currency || "USD",
          internship.budget?.isNegotiable
        )}
      </p>

      {/* Tags */}
      {internship.tags?.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500 mb-1">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {internship.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Required Skills */}
      {internship.requiredSkills?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Required Skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {internship.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mb-3">
        Posted: {calculateDaysAgo(internship?.postedAt)}
      </p>

      {/* Action Buttons */}
      {poster ? (
        <div className="flex justify-between items-center gap-4 mt-auto pt-0">
          {/* Edit Internship */}
          <button
            title="Edit Internship"
            className="flex items-center gap-2 text-yellow-600 hover:text-white border border-yellow-600 hover:bg-yellow-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
            onClick={() => {
              // Trigger your edit handler/modal here
              document.getElementById("Edit_Internship_Modal")?.showModal();
              setSelectedInternshipData(internship);
            }}
          >
            <MdEdit /> Edit
          </button>

          {/* Delete Internship */}
          <button
            title="Delete Internship"
            className="flex items-center gap-2 text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
            onClick={() => handleDeleteInternship(internship?._id)}
          >
            <FaRegTrashAlt /> Delete
          </button>

          {/* Details Button */}
          <button
            title="Delete Internship"
            className="flex items-center gap-2 text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
            onClick={() => {
              document.getElementById("Internship_Details_Modal")?.showModal();
              setSelectedInternshipID(internship?._id);
            }}
          >
            <FaEye />
            View Details
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center pt-2 mt-auto">
          <Link to={`/Internship/Apply/${internship?._id}`}>
            <CommonButton
              text="Bid Now"
              textColor="text-white"
              bgColor="blue"
              px="px-4"
              py="py-2"
              width="auto"
              className="text-sm font-medium"
            />
          </Link>

          {/* Details Button */}
          <button
            onClick={() => {
              document.getElementById("Internship_Details_Modal").showModal();
              setSelectedInternshipID(internship?._id);
            }}
            className="text-sm text-blue-700 hover:underline cursor-pointer"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

// Prop Vallation
InternshipCard.propTypes = {
  internship: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    deliveryDeadline: PropTypes.string,
    requiredSkills: PropTypes.arrayOf(PropTypes.string),
    attachments: PropTypes.array,
    isRemote: PropTypes.bool,
    location: PropTypes.string,
    budget: PropTypes.shape({
      type: PropTypes.string,
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      currency: PropTypes.string,
      isNegotiable: PropTypes.bool,
    }),
    communication: PropTypes.shape({
      preferredMethod: PropTypes.string,
      allowCalls: PropTypes.bool,
    }),
    extraNotes: PropTypes.string,
    postedBy: PropTypes.shape({
      email: PropTypes.string,
      name: PropTypes.string,
      profileImage: PropTypes.string,
      rating: PropTypes.number,
    }),
    status: PropTypes.string,
    postedAt: PropTypes.string,
  }).isRequired,
  setSelectedInternshipID: PropTypes.func.isRequired,
  poster: PropTypes.bool,
  refetch: PropTypes.func,
  setSelectedInternshipData: PropTypes.func,
};

export default InternshipCard;
