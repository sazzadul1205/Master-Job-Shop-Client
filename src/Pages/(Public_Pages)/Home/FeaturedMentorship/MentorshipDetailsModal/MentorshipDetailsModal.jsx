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

  // Loading states
  if (isLoading)
    return (
      <div
        id="Mentorship_Details_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (error)
    return (
      <div
        id="Mentorship_Details_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => handleClose()}
          className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>

        {/* Error Component inside modal */}

        <Error height="min-h-[60vh]" />
      </div>
    );

  // If no Data
  if (!mentorship)
    return (
      <div
        id="Mentorship_Details_Modal"
        className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center text-center py-16">
          {/* Icon */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6 shadow-sm">
            <ImCross className="text-4xl text-gray-400" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Data Found
          </h3>

          {/* Subtitle */}
          <p className="text-gray-500 max-w-sm">
            We couldn’t find any Mentorship details to display right now. Please
            check back later or refresh the page.
          </p>
        </div>
      </div>
    );

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
      className="modal-box w-full max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
    >
      {/* Close Button */}
      <button
        onClick={() => handleClose()}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Mentor Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0  gap-0 md:gap-5 pt-6 text-center sm:text-left">
        {/* Mentor Image */}
        <img
          src={Mentor?.profileImage || DefaultUserLogo}
          alt={Mentor?.name || "Mentor"}
          className="w-24 h-24 sm:w-20 sm:h-20 mx-auto sm:mx-0 rounded-full object-cover border-2 border-blue-400"
        />

        {/* Mentor Details */}
        <div className="flex-1">
          {/* Name */}
          <h2 className="text-xl sm:text-2xl font-semibold flex justify-center sm:justify-start items-center gap-2 flex-wrap">
            <FaUserTie className="text-blue-500" />
            <span>{Mentor?.name || "N/A"}</span>
          </h2>

          {/* Position */}
          <p className="text-sm text-gray-500 mt-1">
            {Mentor?.position || "N/A"}
          </p>

          {/* Bio */}
          <div className="mt-2 text-gray-700">
            <div
              className={`cursor-pointer overflow-hidden transition-all duration-500`}
              style={{
                maxHeight: bioExpanded ? `${bioHeight}px` : "1.5rem",
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

      {/* Divider */}
      <p className="bg-gray-400 h-[1px] w-[80%] md:w-[99%] mx-auto" />

      {/* Program Title & Description */}
      <div className="mt-4 text-center sm:text-left px-3 sm:px-0">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 break-words">
          {title || "Untitled Mentorship Program"}
        </h1>

        {/* Description */}
        <p className="mt-2 text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-line break-words">
          {description ||
            "No description available for this mentorship program."}
        </p>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 px-0">
        {/* Category */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <FaBook className="text-green-500 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Category
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              {category
                ? `${category} / ${subCategory || "TBD"}`
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* Duration weeks */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <FaClock className="text-orange-500 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Duration
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              {durationWeeks || "TBD"} Weeks
            </p>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg sm:col-span-2">
          <FaCalendarAlt className="text-blue-400 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Sessions
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              {sessionsPerWeek || "TBD"} per week, {sessionLength || "TBD"} each
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              {sessionDays?.length ? sessionDays.join(", ") : "TBD"} |{" "}
              <span>
                {formatTime(sessionStartTime)} - {formatTime(sessionEndTime)}
              </span>
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <FaMapMarkerAlt className="text-red-400 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Location
            </h3>
            <p className="text-sm sm:text-base text-gray-700 break-words">
              {location?.address || ""}
              {location?.city ? `, ${location.city}` : ""}
              {location?.state ? `, ${location.state}` : ""}
              {location?.country ? `, ${location.country}` : ""}
              {!location && !isRemote ? "Not specified" : ""}
            </p>
          </div>
        </div>

        {/* Fee */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <FaMoneyBillWave className="text-yellow-500 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Fee
            </h3>
            {fee?.isFree ? (
              <p className="text-sm sm:text-base text-gray-700">Free</p>
            ) : fee?.amount ? (
              <p className="text-sm sm:text-base text-gray-700">
                {fee.amount} {fee.currency || "USD"} via{" "}
                <span className="text-black">{fee.paymentMethod || "TBD"}</span>
              </p>
            ) : (
              <p className="text-sm sm:text-base text-gray-700">
                Not specified
              </p>
            )}
          </div>
        </div>

        {/* Start / End Date */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg">
          <FaCalendarAlt className="text-purple-400 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Start / End Date
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              {startDate || "TBD"} - {endDate || "TBD"}
            </p>
          </div>
        </div>

        {/* Posted At */}
        <div className="flex items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-lg sm:col-span-2">
          <FaCalendarAlt className="text-gray-500 text-xl sm:text-2xl flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
              Posted At
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
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
      <div className="mt-6">
        {/* Title */}
        <h3 className="font-semibold text-xl pb-3 flex items-center gap-2 text-blue-600">
          <FaTools className="text-blue-500" /> Required Skills
        </h3>

        {/* Skill List */}
        {skills?.length > 0 ? (
          <ul
            className="
        grid 
        grid-cols-2
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        gap-3 
        mt-2
      "
          >
            {skills.map((tech, idx) => (
              <li
                key={idx}
                className="
            bg-blue-100 
            text-blue-800 
            px-3 
            py-2 
            rounded-full 
            text-center 
            font-medium 
            text-sm 
            sm:text-base 
            hover:bg-blue-200 
            transition
          "
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No skills specified.</p>
        )}
      </div>

      {/* Divider */}
      <p className="bg-gray-400 h-[1px] w-[80%] md:w-[99%] mx-auto" />

      {/* Prerequisites / Soft Requirements */}
      <div className="mt-6">
        {/* Title */}
        <h3 className="font-semibold text-xl pb-3 flex items-center gap-2 text-green-600">
          <FaTasks className="text-green-500" /> Prerequisites / Soft
          Requirements
        </h3>

        {/* Prerequisite List */}
        {prerequisites?.length > 0 ? (
          <ul
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-3 
        mt-2 
        font-semibold 
        text-gray-700
      "
          >
            {prerequisites.map((item, idx) => (
              <li
                key={idx}
                className="
            bg-green-100 
            text-green-800 
            px-4 
            py-2 
            rounded-lg 
            shadow-sm 
            hover:bg-green-200 
            transition 
            text-sm 
            sm:text-base
          "
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No prerequisites specified.</p>
        )}
      </div>

      {/* Divider */}
      <p className="bg-gray-400 h-[1px] w-[80%] md:w-[99%] mx-auto" />

      {/* Skills Covered */}
      <div className="mt-6">
        {/* Title */}
        <h3 className="font-semibold text-xl pb-3 flex items-center gap-2 text-purple-600">
          <FaTools className="text-purple-500" /> Skills You Will Learn
        </h3>

        {/* Skill List */}
        {skillsCovered?.length > 0 ? (
          <ul
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-3 
        mt-2
      "
          >
            {skillsCovered.map((skill, idx) => (
              <li
                key={idx}
                className="
            bg-purple-100 
            text-purple-800 
            px-4 
            py-2 
            rounded-lg 
            shadow-sm 
            font-medium 
            text-sm 
            sm:text-base 
            hover:bg-purple-200 
            transition-all 
            duration-200
          "
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

      {/* Divider */}
      <p className="bg-gray-400 h-[1px] w-[80%] md:w-[99%] mx-auto" />

      {/* Attachments */}
      <div className="mt-6">
        {/* Title */}
        <h3 className="font-semibold text-xl pb-3 flex items-center gap-2 text-orange-600">
          <FaBook className="text-orange-500" /> Attachments
        </h3>

        {/* Attachment List */}
        {attachments?.length > 0 ? (
          <ul
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-3 
        mt-2
      "
          >
            {attachments.map((file, idx) => (
              <li
                key={idx}
                className="
            flex 
            items-center 
            gap-2 
            bg-orange-50 
            text-orange-800 
            px-4 
            py-2 
            rounded-lg 
            shadow-sm 
            font-medium 
            text-sm 
            sm:text-base 
            hover:bg-orange-100 
            transition-all 
            duration-200
            break-all
          "
              >
                📎 {file}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">
            No attachments available for this program.
          </p>
        )}
      </div>

      {/* Divider */}
      <p className="bg-gray-400 h-[1px] w-[80%] md:w-[99%] mx-auto" />

      {/* Weekly Plan */}
      <div className="mt-6">
        {/* Title */}
        <h3 className="font-semibold text-xl pb-3 flex items-center gap-2 text-teal-600">
          <FaTasks className="text-teal-500" /> Weekly Plan
        </h3>

        {/* Weekly Plan List */}
        {weeklyPlan && weeklyPlan.length > 0 ? (
          <div
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-4 
        mt-2
      "
          >
            {weeklyPlan.map((week) => (
              <div
                key={week.weekNo}
                className="
            p-4 
            border-l-4 
            border-teal-500 
            rounded-lg 
            bg-gray-50 
            shadow-sm 
            hover:shadow-md 
            hover:bg-gray-100 
            transition-all 
            duration-200 
            flex 
            flex-col 
            justify-between
          "
              >
                {/* Week Number & Topic */}
                <h4 className="font-semibold text-lg text-gray-800 break-words">
                  Week {week.weekNo}: {week.topic || "No topic provided"}
                </h4>

                {/* Objectives */}
                <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  <strong>Objectives:</strong>{" "}
                  {week.objectives || "Not specified"}
                </p>

                {/* Resources */}
                <p className="text-gray-700 mt-1 text-sm sm:text-base">
                  <strong>Resources:</strong> {week.resources || "Not provided"}
                </p>

                {/* Notes */}
                <p className="text-gray-500 mt-2 text-xs sm:text-sm italic">
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

      {/* Divider */}
      <p className="bg-gray-400 h-[1px] w-[80%] md:w-[99%] mx-auto" />

      {/* Communication & Support */}
      <div className="mt-6">
        {/* Title */}
        <h3 className="font-semibold text-xl pb-3 flex items-center gap-2 text-red-600">
          <FaCommentDots className="text-red-500" /> Communication & Support
        </h3>

        {/* Communication Details */}
        {communication ? (
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            {/* Preferred Method */}
            <p>
              <strong>Preferred Method:</strong>{" "}
              {communication.preferredMethod || "Not specified"}
            </p>

            {/* One-on-One Support */}
            <p>
              <strong>One-on-One Support:</strong>{" "}
              {communication.oneOnOneSupport !== undefined
                ? communication.oneOnOneSupport
                  ? "Yes"
                  : "No"
                : "Not specified"}
            </p>

            {/* Group Chat */}
            <p>
              <strong>Group Chat:</strong>{" "}
              {communication.groupChatEnabled !== undefined
                ? communication.groupChatEnabled
                  ? "Enabled"
                  : "Disabled"
                : "Not specified"}
            </p>

            {/* Notes */}
            <p className="text-gray-800 whitespace-pre-line pt-2">
              {communication.notes || "No additional notes provided."}
            </p>
          </div>
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
            className="
        w-full 
        sm:w-auto 
        px-6 
        py-3 
        font-semibold 
        text-sm 
        sm:text-base
        text-white 
        bg-blue-600 
        rounded 
        hover:bg-blue-700 
        transition-colors 
        cursor-pointer
        block
        sm:inline-block
      "
          >
            Apply Now
          </button>
        </Link>
      )}

      {/* Posted Date */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-2 text-xs sm:text-sm text-gray-400">
        <FaCalendarAlt className="text-gray-400" />
        <span>
          Posted on:{" "}
          <span className="break-words">
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
