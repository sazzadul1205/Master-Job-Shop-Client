import PropTypes from "prop-types";

// Packages
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Assess
import DefaultCompanyLogo from "../../../../../assets/DefaultCompanyLogo.jpg";

// Icons
import { ImCross } from "react-icons/im";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Format Date
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const EventDetailsModal = ({ selectedEventID, setSelectedEventID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetching Selected Event Data
  const {
    data: SelectedEventData,
    isLoading: SelectedEventIsLoading,
    error: SelectedEventError,
  } = useQuery({
    queryKey: ["SelectedEventData", selectedEventID],
    queryFn: () =>
      axiosPublic.get(`/Events?id=${selectedEventID}`).then((res) => res.data),
    enabled: !!selectedEventID, // Only run when selectedEventID is truthy
  });

  // Loading
  if (SelectedEventIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedEventID("");
            document.getElementById("Event_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error
  if (SelectedEventError)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedEventID("");
            document.getElementById("Event_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // No Data Fetched
  if (!SelectedEventData) return null;

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      <div
        onClick={() => {
          setSelectedEventID("");
          document.getElementById("Event_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-black mb-4">
        {SelectedEventData?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-4">{SelectedEventData?.description}</p>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
        <p>
          <strong>Category:</strong> {SelectedEventData?.category} ›{" "}
          {SelectedEventData?.subCategory}
        </p>
        <p>
          <strong>Type:</strong> {SelectedEventData?.type} (
          {SelectedEventData?.format})
        </p>
        <p>
          <strong>Dates:</strong> {formatDate(SelectedEventData?.startDate)} –{" "}
          {formatDate(SelectedEventData?.endDate)}
        </p>
        <p>
          <strong>Capacity:</strong> {SelectedEventData?.capacity} attendees
        </p>
        <p>
          <strong>Location:</strong> {SelectedEventData?.location?.venue},{" "}
          {SelectedEventData?.location?.city}
        </p>
        <p>
          <strong>Price:</strong>{" "}
          {SelectedEventData?.price?.isFree
            ? "Free"
            : `${SelectedEventData?.price?.currency} ${SelectedEventData?.price?.standard}`}
        </p>
      </div>

      {/* Tags */}
      <div>
        <h4 className="font-semibold text-gray-700 pb-1">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {SelectedEventData?.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
            >
              # {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Schedules */}
      <div className="py-6">
        <p className="font-semibold text-gray-800 mb-1">Schedule:</p>
        {SelectedEventData?.schedule?.map((day, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {formatDate(day.day)}
            </p>
            <ul className="text-sm list-disc ml-4 text-gray-600">
              {day.sessions?.map((session, i) => (
                <li key={i}>
                  <strong>{session.title}</strong> by{" "}
                  {session.speaker || session.speakers?.join(", ")} (
                  {session.startTime}–{session.endTime})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Speakers */}
      <div className="py-6">
        <p className="font-semibold mb-2 text-black">Speakers:</p>
        <ul className="text-sm text-gray-700 list-disc ml-4">
          {SelectedEventData?.speakers?.map((spk, idx) => (
            <li key={idx}>
              <strong>{spk.name}</strong>: {spk.topic} – {spk.bio}
            </li>
          ))}
        </ul>
      </div>

      {/* Organizers */}
      <div className="mb-6">
        <p className="font-semibold mb-2 text-black">Organizer:</p>
        <div className="flex items-center gap-3">
          <img
            src={SelectedEventData?.organizer?.logo || DefaultCompanyLogo}
            alt="Organizer"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = DefaultCompanyLogo;
            }}
          />

          <div>
            <p className="font-semibold text-gray-800">
              {SelectedEventData?.organizer.name}
            </p>
            <p className="text-sm text-gray-600">
              {SelectedEventData?.organizer.bio}
            </p>
            <p className="text-xs text-gray-500">
              Contact: {SelectedEventData?.organizer.contactEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <strong>Extra Notes:</strong> {SelectedEventData?.extraNotes}
        </p>
      </div>

      {/* Action Area */}
      <div className="flex justify-between items-center mt-6">
        <Link to={`/Events/Apply/${SelectedEventData?._id}`}>
          <CommonButton
            text="Register"
            textColor="text-white"
            bgColor="blue"
            px="px-4"
            py="py-2"
            width="auto"
            className="text-sm font-medium"
          />
        </Link>
        <p className="text-xs text-gray-400">
          Posted on:{" "}
          {new Date(SelectedEventData?.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

// Prop Validation
EventDetailsModal.propTypes = {
  selectedEventID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedEventID: PropTypes.func.isRequired,
};
export default EventDetailsModal;
