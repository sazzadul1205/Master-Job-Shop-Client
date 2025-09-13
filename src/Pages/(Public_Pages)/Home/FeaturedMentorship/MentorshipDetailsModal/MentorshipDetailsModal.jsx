import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import {
  FaUserTie,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTools,
  FaBook,
  FaTasks,
  FaCommentDots,
} from "react-icons/fa";

// Assets
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Format Time
const formatTime = (time) => {
  if (!time) return "TBD";
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const MentorshipDetailsModal = ({
  isEditor = false,
  selectedMentorshipID,
  setSelectedMentorshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Refs
  const bioRef = useRef(null);

  // States Variables
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioHeight, setBioHeight] = useState(0);

  // Fetch Mentorship Data
  const {
    data: mentorship,
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

  // Close Modal
  const handleClose = () => {
    setSelectedMentorshipID("");
    document.getElementById("Mentorship_Details_Modal")?.close();
  };

  // Adjust bio height on load and when bio changes
  useEffect(() => {
    if (bioRef.current && mentorship?.Mentor?.bio) {
      setBioHeight(bioRef.current.scrollHeight);
    }
  }, [mentorship?.Mentor?.bio]);

  // If loading
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

  // If error
  if (error)
    return (
      <div className="min-w-[600px] max-h-[90vh] relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Error />
      </div>
    );

  if (!mentorship) return null;

  // Destructure Mentorship Data
  const {
    Mentor,
    title,
    description,
    category,
    subCategory,
    skillsCovered,
    prerequisites,
    attachments,
    weeklyPlan,
    skills,
    sessionsPerWeek,
    sessionLength,
    sessionDays,
    sessionStartTime,
    sessionEndTime,
    location,
    fee,
    durationWeeks,
    startDate,
    endDate,
    communication,
    postedAt,
    isRemote,
  } = mentorship;

  return (
    <div
      id="Mentorship_Details_Modal"
      className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Mentor Info */}
      <div className="flex items-center space-x-4">
        {/* Mentor Image */}
        <img
          src={Mentor?.profileImage || DefaultUserLogo}
          alt={Mentor?.name || "Mentor"}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
        />

        {/* Mentor Details */}
        <div>
          {/* Name */}
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaUserTie className="text-blue-500" /> {Mentor?.name || "N/A"}
          </h2>

          {/* Position */}
          <p className="text-sm text-gray-500">{Mentor?.position || "N/A"}</p>

          {/* Bio */}
          <div className="mt-2 text-gray-700">
            <div
              className={`cursor-pointer overflow-hidden transition-all duration-500`}
              style={{
                maxHeight: bioExpanded ? `${bioHeight}px` : "1.5rem", // approx 1 line
              }}
              onClick={() => setBioExpanded(!bioExpanded)}
              title="Click to expand"
              ref={bioRef}
            >
              {Mentor?.bio || "No bio available."}
            </div>
          </div>
        </div>
      </div>

      {/* Program Title & Description */}
      <div>
        {/* Title */}
        <h1 className="text-3xl font-bold mt-4 text-blue-600">
          {title || "Untitled Mentorship Program"}
        </h1>

        {/* Description */}
        <p className="mt-2 text-black whitespace-pre-line">
          {description ||
            "No description available for this mentorship program."}
        </p>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Category */}
        <div className="flex items-center gap-2">
          <FaBook className="text-green-500" />
          <div>
            <h3 className="font-semibold text-lg">Category</h3>
            <p>
              {category
                ? `${category} / ${subCategory || "TBD"}`
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* Duration weeks */}
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-500" />
          <div>
            <h3 className="font-semibold text-lg">Duration</h3>
            <p>{durationWeeks || "TBD"} Weeks</p>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-400" />
          <div>
            <h3 className="font-semibold text-lg">Sessions</h3>
            <p>
              {sessionsPerWeek || "TBD"} per week, {sessionLength || "TBD"} each
            </p>
            <p>
              {sessionDays?.length ? sessionDays.join(", ") : "TBD"} |{" "}
              <span>
                {formatTime(sessionStartTime)} - {formatTime(sessionEndTime)}
              </span>
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-400" />
          <div>
            <h3 className="font-semibold text-lg">Location</h3>
            <p>
              {location?.address || ""}
              {location?.city ? `, ${location.city}` : ""}
              {location?.state ? `, ${location.state}` : ""}
              {location?.country ? `, ${location.country}` : ""}
              {!location && !isRemote ? "Not specified" : ""}
            </p>
          </div>
        </div>

        {/* Fee */}
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-yellow-500" />
          <div>
            <h3 className="font-semibold text-lg">Fee</h3>
            {fee?.isFree ? (
              <p>Free</p>
            ) : fee?.amount ? (
              <p>
                {fee.amount} {fee.currency || "USD"} via{" "}
                <span className="text-black">{fee.paymentMethod || "TBD"}</span>
              </p>
            ) : (
              <p>Not specified</p>
            )}
          </div>
        </div>

        {/* Start / End Date */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-purple-400" />
          <div>
            <h3 className="font-semibold text-lg">Start / End Date</h3>
            <p>
              {startDate || "TBD"} - {endDate || "TBD"}
            </p>
          </div>
        </div>

        {/* Posted At */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          <div>
            <h3 className="font-semibold text-lg">Posted At</h3>
            <p>
              {postedAt
                ? new Date(postedAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-6 pb-3 flex items-center gap-2 text-blue-600">
          <FaTools /> Required Skills
        </h3>

        {/* Skill List */}
        {skills?.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {skills.map((tech, idx) => (
              <li
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block font-medium"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No skills specified.</p>
        )}
      </div>

      {/* Prerequisites / Soft Requirements */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 pb-3 flex items-center gap-2 text-green-600">
          <FaTasks /> Prerequisites / Soft Requirements
        </h3>

        {/* Prerequisite List */}
        {prerequisites?.length > 0 ? (
          <ul className="list-disc list-inside mt-2 font-semibold text-gray-700">
            {prerequisites.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No prerequisites specified.</p>
        )}
      </div>

      {/* Skills Covered */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 pb-3 flex items-center gap-2 text-purple-600">
          <FaTools /> Skills You Will Learn
        </h3>

        {/* Skill List */}
        {skillsCovered?.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {skillsCovered.map((skill, idx) => (
              <li
                key={idx}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            No skills specified for this program yet.
          </p>
        )}
      </div>

      {/* Attachments */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 pb-3 flex items-center gap-2 text-orange-600">
          <FaBook /> Attachments
        </h3>

        {/* Attachment List */}
        {attachments?.length > 0 ? (
          <ul className="list-disc list-inside mt-2 font-semibold text-gray-700">
            {attachments.map((file, idx) => (
              <li key={idx}>{file}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            No attachments available for this program.
          </p>
        )}
      </div>

      {/* Weekly Plan */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 pb-3 flex items-center gap-2 text-teal-600">
          <FaTasks /> Weekly Plan
        </h3>

        {/* Weekly Plan */}
        {weeklyPlan && weeklyPlan.length > 0 ? (
          <div className="space-y-4 mt-2">
            {weeklyPlan.map((week) => (
              <div
                key={week.weekNo}
                className="p-4 border-4 border-l-blue-500 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* Week Number & Topic */}
                <h4 className="font-semibold text-lg">
                  Week {week.weekNo}: {week.topic || "No topic provided"}
                </h4>

                {/* Objectives */}
                <p className="text-gray-700 mt-1">
                  <strong>Objectives:</strong>{" "}
                  {week.objectives || "Not specified"}
                </p>

                {/* Resources */}
                <p className="text-gray-700 mt-1">
                  <strong>Resources:</strong> {week.resources || "Not provided"}
                </p>

                {/* Notes */}
                <p className="text-gray-500 mt-1 text-sm">
                  {week.notes || "No additional notes"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">
            No weekly plan has been provided for this program.
          </p>
        )}
      </div>

      {/* Communication & Support */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 pb-3 flex items-center gap-2 text-red-600">
          <FaCommentDots /> Communication & Support
        </h3>

        {/* Sessions */}
        {communication ? (
          <>
            {/* Preferred Method */}
            <p className="text-gray-700 mt-1">
              <strong>Preferred Method:</strong>{" "}
              {communication.preferredMethod || "Not specified"}
            </p>

            {/* One-on-One Support */}
            <p className="text-gray-700 mt-1">
              <strong>One-on-One Support:</strong>{" "}
              {communication.oneOnOneSupport !== undefined
                ? communication.oneOnOneSupport
                  ? "Yes"
                  : "No"
                : "Not specified"}
            </p>

            {/* Group Chat */}
            <p className="text-gray-700 mt-1">
              <strong>Group Chat:</strong>{" "}
              {communication.groupChatEnabled !== undefined
                ? communication.groupChatEnabled
                  ? "Enabled"
                  : "Disabled"
                : "Not specified"}
            </p>

            {/* Notes */}
            <p className="text-black mt-1 whitespace-pre-line pt-2">
              {communication.notes || "No additional notes provided."}
            </p>
          </>
        ) : (
          <p className="text-gray-500 mt-2">
            No communication details provided for this program.
          </p>
        )}
      </div>

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
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <FaCalendarAlt className="text-gray-400" />
        <span>
          Posted on:{" "}
          <span>
            {postedAt
              ? new Date(postedAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Not specified"}
          </span>
        </span>
      </div>
    </div>
  );
};

MentorshipDetailsModal.propTypes = {
  isEditor: PropTypes.bool,
  selectedMentorshipID: PropTypes.string.isRequired,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default MentorshipDetailsModal;
