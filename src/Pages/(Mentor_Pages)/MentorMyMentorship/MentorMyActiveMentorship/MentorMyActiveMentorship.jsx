import { useState } from "react";

// Packages
import Swal from "sweetalert2";
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
import DeleteAnimation from "../../../../assets/Animation/DeleteAnimation.gif";

// Shared
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

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

const MentorMyActiveMentorship = ({
  error,
  refetch,
  isLoading,
  MentorshipData,
}) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

  // keep track of starred Mentorship's by ID
  const [starred, setStarred] = useState([]);

  // Optimistic Archive Toggle
  const toggleStar = async (id) => {
    // Optimistically toggle locally
    const isCurrentlyStarred = starred.includes(id);
    setStarred((prev) =>
      isCurrentlyStarred ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

    try {
      // Call backend to toggle archive
      const res = await axiosPublic.put(`/Mentorship/Archive/${id}`);

      if (res?.data?.archived === undefined) {
        throw new Error("Unexpected response from server");
      }

      // Refetch data
      refetch();

      // Show success toast
      Swal.fire({
        toast: true,
        position: "top-start",
        icon: "success",
        title: res.data.archived ? "Archived!" : "Un-Archived!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // If backend disagrees with local toggle, correct it
      if (res.data.archived !== !isCurrentlyStarred) {
        setStarred((prev) =>
          res.data.archived ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
      }
    } catch (error) {
      // Rollback local toggle
      setStarred((prev) =>
        isCurrentlyStarred ? [...prev, id] : prev.filter((sid) => sid !== id)
      );

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update archive status. Please try again!",
      });

      console.error("Failed to toggle archive:", error);
    }
  };

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

  // Handle Delete
  const handleDelete = async (id) => {
    // If Delete
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This mentorship will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (confirmResult.isConfirmed) {
        // For testing, skip actual deletion
        await axiosPublic.delete(`/Mentorship/${id}`);

        // Trashcan animation modal
        Swal.fire({
          title: "Deleted!",
          html: `
          <div style="font-size: 50px; text-align:center;">
            <img src=${DeleteAnimation} alt="Trashcan closing" width="200" /> 
          </div> 
          <p>Mentorship has been removed.</p>
          `,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#fff",
          didOpen: () => {
            const content = Swal.getHtmlContainer();
            content.style.display = "flex";
            content.style.alignItems = "center";
            content.style.flexDirection = "column";
          },
        });

        refetch();
      }
    } catch (error) {
      console.error("Failed to delete mentorship:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete. Please try again!",
      });
    }
  };

  return (
    <div className="text-black">
      {/* Title */}
      <h3 className="text-2xl font-bold mb-6">
        Ongoing Mentorship&apos;s ( {sortedMentorship?.length || 0} )
      </h3>

      {/* Mentorship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMentorship && sortedMentorship.length > 0 ? (
          sortedMentorship.map((mentorship, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 hover:shadow-2xl"
            >
              {/* 🔖 Status Badge */}
              <span
                className={`absolute -top-3 -left-3 px-5 py-1 text-sm font-semibold rounded-full shadow-xl ${
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

              {/* ⭐ Star Toggle */}
              <button
                onClick={() => toggleStar(mentorship._id)}
                className="absolute top-3 right-3 text-2xl cursor-pointer transition-colors group"
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
          refetch={refetch}
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
  refetch: PropTypes.func,
};

export default MentorMyActiveMentorship;
