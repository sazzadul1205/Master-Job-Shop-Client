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
import { useEffect, useRef, useState } from "react";

const MentorshipDetailsModal = ({
  isEditor = false,
  selectedMentorshipID,
  setSelectedMentorshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Bio Expand State
  const [bioExpanded, setBioExpanded] = useState(false);
  const bioRef = useRef(null);
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
  } = mentorship;

  return (
    <div className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
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
          src={Mentor.profileImage || DefaultUserLogo}
          alt={Mentor.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
        />

        {/* Mentor Details */}
        <div>
          {/* Name */}
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaUserTie className="text-blue-500" /> {Mentor.name}
          </h2>

          {/* Position */}
          <p className="text-sm text-gray-500">{Mentor.position}</p>

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
              {Mentor.bio}
            </div>
          </div>
        </div>
      </div>

      {/* Program Title & Description */}
      <div>
        {/* Title */}
        <h1 className="text-3xl font-bold mt-4 text-blue-600">{title}</h1>

        {/* Description */}
        <p className="mt-2 text-gray-700 whitespace-pre-line">{description}</p>
      </div>

      {/* Key Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Category */}
        <div className="flex items-center gap-2">
          <FaBook className="text-green-500" />
          <div>
            <h3 className="font-semibold text-lg">Category</h3>
            <p>
              {category} / {subCategory}
            </p>
          </div>
        </div>

        {/* Duration weeks */}
        <div className="flex items-center gap-2">
          <FaClock className="text-orange-500" />
          <div>
            <h3 className="font-semibold text-lg">Duration</h3>
            <p>{durationWeeks} Weeks</p>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-blue-400" />
          <div>
            <h3 className="font-semibold text-lg">Sessions</h3>
            {/* Sessions Per Week & Session Length */}
            <p>
              {sessionsPerWeek} per week, {sessionLength} each
            </p>

            {/* Session Days, Start Time & End Time */}
            <p>
              {sessionDays.join(", ")} | {sessionStartTime} - {sessionEndTime}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-400" />
          <div>
            <h3 className="font-semibold text-lg">Location</h3>

            {/* Address, City, State, Country */}
            <p>
              {location.address}, {location.city}, {location.state},{" "}
              {location.country}
            </p>
          </div>
        </div>

        {/* Fee */}
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-yellow-500" />

          {/* Fee */}
          <div>
            <h3 className="font-semibold text-lg">Fee</h3>
            {fee.isFree ? (
              <p>Free</p>
            ) : (
              //  Fee Amount, Currency, Payment Method & Payment Link
              <p>
                {fee.amount} {fee.currency} via{" "}
                <span className="text-black">{fee.paymentMethod}</span>
              </p>
            )}
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-purple-400" />
          <div>
            <h3 className="font-semibold text-lg">Start / End Date</h3>
            <p>
              {startDate} - {endDate}
            </p>
          </div>
        </div>

        {/* Posted At */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          <div>
            <h3 className="font-semibold text-lg">Posted At</h3>
            <p>{new Date(postedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div>
        <h3 className="font-semibold text-xl mt-6 flex items-center gap-2 text-blue-600">
          <FaTools /> Required Skills
        </h3>
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
      </div>

      {/* Prerequisites / Soft Requirements */}
      <div>
        <h3 className="font-semibold text-xl mt-4 flex items-center gap-2 text-green-600">
          <FaTasks /> Prerequisites / Soft Requirements
        </h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          {prerequisites.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Skills Covered */}
      <div>
        <h3 className="font-semibold text-xl mt-4 flex items-center gap-2 text-purple-600">
          <FaTools /> Skills You Will Learn
        </h3>
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
      </div>

      {/* Attachments */}
      <div>
        <h3 className="font-semibold text-xl mt-4 flex items-center gap-2 text-orange-600">
          <FaBook /> Attachments
        </h3>
        <ul className="list-disc list-inside mt-2 text-gray-700">
          {attachments.map((file, idx) => (
            <li key={idx}>{file}</li>
          ))}
        </ul>
      </div>

      {/* Weekly Plan */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 flex items-center gap-2 text-teal-600">
          <FaTasks /> Weekly Plan
        </h3>

        {/* Weekly Plan */}
        <div className="space-y-4 mt-2">
          {weeklyPlan.map((week) => (
            <div
              key={week.weekNo}
              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              {/* Week Number & Topic */}
              <h4 className="font-semibold text-lg">
                Week {week.weekNo}: {week.topic}
              </h4>

              {/* Objectives */}
              <p className="text-gray-700 mt-1">
                <strong>Objectives:</strong> {week.objectives}
              </p>

              {/* Resources */}
              <p className="text-gray-700 mt-1">
                <strong>Resources:</strong> {week.resources}
              </p>

              {/* Notes */}
              <p className="text-gray-500 mt-1 text-sm">{week.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Communication */}
      <div>
        {/* Title */}
        <h3 className="font-semibold text-xl mt-4 flex items-center gap-2 text-red-600">
          <FaCommentDots /> Communication & Support
        </h3>

        {/* Preferred Method */}
        <p className="text-gray-700 mt-1">
          <strong>Preferred Method:</strong> {communication.preferredMethod}
        </p>

        {/* One-on-One Support */}
        <p className="text-gray-700 mt-1">
          <strong>One-on-One Support:</strong>{" "}
          {communication.oneOnOneSupport ? "Yes" : "No"}
        </p>

        {/* Group Chat */}
        <p className="text-gray-700 mt-1">
          <strong>Group Chat:</strong>{" "}
          {communication.groupChatEnabled ? "Enabled" : "Disabled"}
        </p>

        {/* Notes */}
        <p className="text-gray-700 mt-1 whitespace-pre-line">
          {communication.notes}
        </p>
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
      <p className="text-xs text-gray-400 mt-2">
        Posted on: {postedAt ? new Date(postedAt).toLocaleDateString() : "N/A"}
      </p>
    </div>
  );
};

MentorshipDetailsModal.propTypes = {
  isEditor: PropTypes.bool,
  selectedMentorshipID: PropTypes.string.isRequired,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default MentorshipDetailsModal;
