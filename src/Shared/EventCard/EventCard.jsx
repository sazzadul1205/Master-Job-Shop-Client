import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Assets
import DefaultCompanyLogo from "../../assets/DefaultCompanyLogo.jpg";

// Icons
import { FaEye, FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

// Shared
import CommonButton from "../CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Format Date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Calculate days ago
const calculateDaysAgo = (isoDate) => {
  const posted = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
};

const EventCard = ({
  event,
  poster,
  refetch,
  setSelectedEventID,
  setSelectedEventData,
}) => {
  const axiosPublic = useAxiosPublic();

  // Handle Delete Event
  const handleDeleteEvent = async (eventId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Event will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/Events/${eventId}`);
        Swal.fire({
          title: "Deleted!",
          text: "The Event has been removed.",
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
          text: "Failed to delete Event. Please try again.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "The Event is safe.",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
        position: "center",
      });
    }
  };

  return (
    <div className="flex flex-col justify-between border border-gray-300 rounded-lg shadow-sm p-6 bg-white hover:shadow-lg transition duration-300 min-h-[280px]">
      {/* Organizer */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={event?.organizer?.logo || DefaultCompanyLogo}
          alt={event?.organizer?.name || "Organizer Logo"}
          className="w-14 h-14 object-contain rounded"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DefaultCompanyLogo;
          }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {event?.organizer?.name || "Event Host"}
          </p>
          <p className="text-xs text-gray-500">
            {event?.organizer?.contactEmail || ""}
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-black mb-2 truncate">
        {event?.title || "Untitled Event"}
      </h2>

      {/* Category */}
      <p className="text-sm text-gray-600 font-medium mb-3">
        {event?.category || "Category Unspecified"}
      </p>

      {/* Location & Date & Price row */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-700 mb-4">
        {/* Location */}
        {/* Location / Online Link */}
        <div className="flex items-center gap-1">
          <span className="font-semibold">
            {event?.format === "Online" ? "Live Link:" : "Location:"}
          </span>{" "}
          {event?.format === "Online" ? (
            event?.liveLink ? (
              <a
                href={event.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {event.liveLink}
              </a>
            ) : (
              <span className="text-gray-500 italic">Not available</span>
            )
          ) : event?.location?.city || event?.location?.country ? (
            <>
              {event?.location?.venue && (
                <span className="text-gray-700">{event.location.venue}, </span>
              )}
              <span className="text-gray-700">
                {[event?.location?.city, event?.location?.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </>
          ) : (
            <span className="text-gray-500 italic">Not specified</span>
          )}
        </div>

        {/* Start Date */}
        <div>
          <span className="font-semibold">Starts:</span>{" "}
          {event?.startDate ? formatDate(event.startDate) : "TBD"}
        </div>

        {/* Entry Fee */}
        <div>
          <span className="font-semibold">Entry Fee:</span>{" "}
          {event?.price?.isFree
            ? "Free"
            : event?.price
            ? `${event.price.currency} ${event.price.standard}`
            : "TBD"}
        </div>
      </div>

      {/* Published */}
      <p className="text-xs text-gray-400 mb-5">
        Published:{" "}
        {event?.publishedAt ? calculateDaysAgo(event.publishedAt) : "N/A"}
      </p>

      {/* Actions Button */}
      {poster ? (
        <div className="flex justify-between items-center gap-4 mt-auto pt-0">
          {/* Edit Event */}
          <button
            title="Edit Event"
            className="flex items-center gap-2 text-yellow-600 hover:text-white border border-yellow-600 hover:bg-yellow-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
            onClick={() => {
              // Trigger your edit handler/modal here
              document.getElementById("Edit_Event_Modal")?.showModal();
              setSelectedEventData(event);
            }}
          >
            <MdEdit /> Edit
          </button>

          {/* Delete Event */}
          <button
            title="Delete Event"
            className="flex items-center gap-2 text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
            onClick={() => handleDeleteEvent(event?._id)}
          >
            <FaRegTrashAlt /> Delete
          </button>

          {/* Details Button */}
          <button
            title="Delete Event"
            className="flex items-center gap-2 text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 px-5 py-1 rounded font-semibold transition-colors duration-300 cursor-pointer"
            onClick={() => {
              document.getElementById("Event_Details_Modal")?.showModal();
              setSelectedEventID(event?._id);
            }}
          >
            <FaEye />
            View Details
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center pt-2 mt-auto">
          <Link to={`/Events/Apply/${event?._id}`}>
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
              document.getElementById("Event_Details_Modal").showModal();
              setSelectedEventID(event?._id);
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

// Prop Validation
EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  poster: PropTypes.bool,
  refetch: PropTypes.func,
  setSelectedEventID: PropTypes.func.isRequired,
  setSelectedEventData: PropTypes.func,
};

export default EventCard;
