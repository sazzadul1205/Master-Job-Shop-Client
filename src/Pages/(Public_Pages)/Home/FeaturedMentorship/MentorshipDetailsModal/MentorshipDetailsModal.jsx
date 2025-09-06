import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaMapMarkerAlt,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";

// Assets
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const MentorshipDetailsModal = ({
  isEditor = false,
  selectedMentorshipID,
  setSelectedMentorshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch Selected Mentorship
  const {
    data: SelectedMentorshipData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedMentorshipData", selectedMentorshipID],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?id=${selectedMentorshipID}`)
        .then((res) => res.data),
    enabled: !!selectedMentorshipID,
  });

  // Close Modal Handler
  const handleClose = () => {
    setSelectedMentorshipID("");
    document.getElementById("Mentorship_Details_Modal")?.close();
  };

  // Loading State
  if (isLoading)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Loading />
      </div>
    );

  // Error State
  if (error)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Error />
      </div>
    );

  // If no data
  if (!SelectedMentorshipData) return null;

  // Destructure Data
  const {
    mentor,
    title,
    description,
    category,
    subCategory,
    tags,
    skillsCovered,
    prerequisites,
    schedule,
    fee,
    startDate,
    applicationDeadline,
    communication,
    isRemote,
    location,
    extraNotes,
    postedAt,
  } = SelectedMentorshipData;

  return (
    <div className="modal-box min-w-[800px] relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6 space-y-6">
      {/* Close */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Mentor Info */}
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        <img
          src={mentor?.profileImage || DefaultUserLogo}
          alt={mentor?.name || "Mentor"}
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />

        {/* Mentor Details */}
        <div>
          {/* Name */}
          <p className="text-xl font-bold text-gray-800">
            {mentor?.name || "Unknown Mentor"}
          </p>

          {/* Rating & Mentees */}
          <p className="text-sm text-gray-500 flex items-center gap-2">
            {/* Rating */}
            <FaChalkboardTeacher /> Rating: {mentor?.rating ?? "N/A"} |{" "}
            {/* Total Mentees */}
            <FaUsers /> Mentees: {mentor?.totalMentees ?? "0"}
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-extrabold text-blue-900">
        {title || "Untitled Mentorship"}
      </h2>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">
        {description || "No description provided."}
      </p>

      {/* Category & Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category */}
        <span className="text-sm font-medium text-gray-600">
          <strong>Category:</strong> {category || "General"} ›{" "}
          {subCategory || "General"}
        </span>

        {/* Tags */}
        {tags?.length > 0 ? (
          tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-xs">No tags</span>
        )}
      </div>

      {/* Skills & Prerequisites */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Skills */}
        <div>
          {/* Title */}
          <p className="font-semibold text-gray-800 mb-1">Skills Covered:</p>

          {/* List */}
          <div className="flex flex-wrap gap-2">
            {skillsCovered?.length > 0 ? (
              skillsCovered.map((skill, i) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">None</span>
            )}
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          {/* Title */}
          <p className="font-semibold text-gray-800 mb-1">Prerequisites:</p>

          {/* List */}
          <div className="flex flex-wrap gap-2">
            {prerequisites?.length > 0 ? (
              prerequisites.map((p, i) => (
                <span
                  key={i}
                  className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {p}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="flex flex-col md:flex-row md:gap-6 text-gray-700">
        {/* Sessions */}
        <p className="flex items-center gap-2">
          <FaCalendarAlt /> {schedule?.sessionsPerWeek ?? 0} sessions/week •{" "}
          {schedule?.sessionLength || "N/A"}
        </p>

        {/* Days */}
        <p className="flex items-center gap-2">
          Days: {schedule?.days?.length ? schedule.days.join(", ") : "N/A"} •
          Time Zone: {schedule?.timeZone || "N/A"}
        </p>
      </div>

      {/* Fee & Dates */}
      <div className="flex flex-col md:flex-row md:gap-6 text-gray-700">
        {/* Fee */}
        <p className="flex items-center gap-2">
          <FaDollarSign /> Fee: {fee?.currency || "USD"}
          {fee?.amount ?? "0"} {fee?.isNegotiable ? "(Negotiable)" : ""}
        </p>

        {/* Dates */}
        <p className="flex items-center gap-2">
          <FaCalendarAlt /> Start Date:{" "}
          {startDate ? new Date(startDate).toLocaleDateString() : "TBD"}
        </p>

        {/* Deadline */}
        <p className="flex items-center gap-2">
          <FaCalendarAlt /> Application Deadline:{" "}
          {applicationDeadline
            ? new Date(applicationDeadline).toLocaleDateString()
            : "TBD"}
        </p>
      </div>

      {/* Communication */}
      <div className="text-gray-700">
        <p className="font-semibold text-gray-800">Communication:</p>
        <p>Preferred: {communication?.preferredMethod || "N/A"}</p>
        <p>
          Group Chat: {communication?.groupChatEnabled ? "Enabled" : "Disabled"}
        </p>
        <p>
          One-on-One Support: {communication?.oneOnOneSupport ? "Yes" : "No"}
        </p>
      </div>

      {/* Location */}
      <p className="text-gray-700 flex items-center gap-2">
        <FaMapMarkerAlt /> Location:{" "}
        {isRemote
          ? "Remote"
          : location?.city
          ? `${location.city}, ${location.country || ""}`
          : "Not specified"}
      </p>

      {/* Extra Notes */}
      {extraNotes && (
        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
          <p className="font-semibold text-gray-800">Extra Notes:</p>
          <p className="text-gray-700 text-sm">{extraNotes}</p>
        </div>
      )}

      {/* Apply Button */}
      {!isEditor && (
        <Link to={`/Mentorship/Apply/${selectedMentorshipID}`}>
          <button
            type="button"
            className="w-full px-6 py-3 font-semibold text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Apply Now
          </button>
        </Link>
      )}

      {/* Posted Date */}
      <p className="text-xs text-gray-400 mt-2">
        Posted on: {postedAt ? new Date(postedAt).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
};

// Prop Validation
MentorshipDetailsModal.propTypes = {
  isEditor: PropTypes.bool,
  selectedMentorshipID: PropTypes.string.isRequired,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default MentorshipDetailsModal;
