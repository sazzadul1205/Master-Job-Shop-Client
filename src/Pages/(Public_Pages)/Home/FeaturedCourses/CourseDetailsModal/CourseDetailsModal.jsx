import { useEffect, useRef, useState } from "react";

// Packages
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Assets
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Icons
import { ImCross } from "react-icons/im";
import { FaCalendarAlt, FaUserTie } from "react-icons/fa";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Utilities
const formatPrice = (fee) => {
  if (!fee || fee.isFree) return "Free";
  const finalAmount = fee.amount - (fee.discount || 0);
  return `${fee.currency} ${finalAmount}${
    fee.discount ? ` (−${fee.discount}%)` : ""
  } ${fee.negotiable ? "(Negotiable)" : ""}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CourseDetailsModal = ({
  isEditor = false,
  selectedCourseID,
  setSelectedCourseID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Refs
  const bioRef = useRef(null);

  // States Variables
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioHeight, setBioHeight] = useState(0);

  // Fetching Selected Course Data
  const {
    data: SelectedCourseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedCourseData", selectedCourseID],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?id=${selectedCourseID}`)
        .then((res) => res.data),
    enabled: !!selectedCourseID,
  });

  const handleClose = () => {
    setSelectedCourseID("");
    document.getElementById("Course_Details_Modal")?.close();
  };

  // Adjust bio height on load and when bio changes
  useEffect(() => {
    if (bioRef.current && SelectedCourseData?.Mentor?.bio) {
      setBioHeight(bioRef.current.scrollHeight);
    }
  }, [SelectedCourseData?.Mentor?.bio]);

  // Loading
  if (isLoading)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        <div
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error
  if (error)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        <div
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // If no data
  if (!SelectedCourseData)
    return (
      <div
        id="Course_Details_Modal"
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
            We couldn’t find any Course details to display right now. Please
            check back later or refresh the page.
          </p>
        </div>
      </div>
    );

  return (
    <div
      id="Course_Details_Modal"
      className="modal-box min-w-5xl relative bg-white rounded-2xl shadow-2xl w-full mx-auto overflow-y-auto max-h-[90vh] p-8 transition-all"
    >
      {/* Close Button */}
      <div
        onClick={handleClose}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer transition"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Course Info */}
      <div className="flex items-center space-x-4">
        {/* SelectedCourseData Image */}
        <img
          src={SelectedCourseData?.Mentor?.profileImage || DefaultUserLogo}
          alt={SelectedCourseData?.Mentor?.name || "SelectedCourseData"}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
        />

        {/* SelectedCourseData Details */}
        <div>
          {/* Name */}
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaUserTie className="text-blue-500" />{" "}
            {SelectedCourseData?.Mentor?.name || "N/A"}
          </h2>

          {/* Position */}
          <p className="text-sm text-gray-500">
            {SelectedCourseData?.Mentor?.position || "N/A"}
          </p>

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
              {SelectedCourseData?.Mentor?.bio || "No bio available."}
            </div>
          </div>
        </div>
      </div>

      {/* Program Title & Description */}
      <div>
        {/* Title */}
        <h1 className="text-3xl font-bold mt-4 text-black">
          {SelectedCourseData?.title || "Untitled Mentorship Program"}
        </h1>
        {/* Sub Title */}
        <h1 className="text-xl font-bold text-gray-700">
          {SelectedCourseData?.subTitle || "Untitled Mentorship Program"}
        </h1>
      </div>

      {/* Description */}
      <div className="mb-6 mt-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Description
        </h3>

        {/* Description */}
        <p className="text-md text-gray-700 leading-relaxed">
          {SelectedCourseData.description}
        </p>
      </div>

      {/* Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
        {/* Category */}
        <p>
          <strong>Category:</strong> {SelectedCourseData?.category ?? "N/A"} ›{" "}
          {SelectedCourseData?.subCategory ?? "N/A"}
        </p>

        {/* Level */}
        <p>
          <strong>Level:</strong> {SelectedCourseData?.level ?? "N/A"}
        </p>

        {/* Duration */}
        <p>
          <strong>Duration:</strong>{" "}
          {SelectedCourseData?.durationHours
            ? `${SelectedCourseData.durationHours} hours`
            : "Not specified"}
        </p>

        {/* Modules */}
        <p>
          <strong>Modules:</strong>{" "}
          {SelectedCourseData?.modulesNumber ?? "Not specified"}
        </p>

        {/* Language */}
        <p>
          <strong>Language:</strong> {SelectedCourseData?.language ?? "N/A"}
        </p>

        {/* Certificates */}
        <p>
          <strong>Certificate:</strong>{" "}
          {SelectedCourseData?.certificateAvailability
            ? "Available"
            : "Not included"}
        </p>

        {/* Sessions/Week */}
        <p>
          <strong>Sessions/Week:</strong>{" "}
          {SelectedCourseData?.sessionsPerWeek
            ? `${SelectedCourseData.sessionsPerWeek} • ${
                SelectedCourseData?.sessionDays?.join(", ") ||
                "Days not specified"
              }`
            : "Not specified"}
        </p>

        {/* Time */}
        <p>
          <strong>Time:</strong>{" "}
          {SelectedCourseData?.startTime && SelectedCourseData?.endTime
            ? `${SelectedCourseData.startTime} - ${SelectedCourseData.endTime}`
            : "Not specified"}
        </p>

        {/* Schedule */}
        <p>
          <strong>Schedule:</strong>{" "}
          {SelectedCourseData?.startDate && SelectedCourseData?.endDate
            ? `${formatDate(SelectedCourseData.startDate)} → ${formatDate(
                SelectedCourseData.endDate
              )}`
            : "Not scheduled"}
        </p>

        {/* Fee */}
        <p>
          <strong>Fee:</strong>{" "}
          <span className="text-green-700 font-medium">
            {SelectedCourseData?.fee
              ? formatPrice(SelectedCourseData.fee)
              : "Free / Not specified"}
          </span>
        </p>
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skills Covered */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Skills Covered
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {SelectedCourseData.skillsCovered?.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Modules */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Modules</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {SelectedCourseData.modules?.map((module, idx) => (
              <li key={idx}>{module}</li>
            ))}
          </ul>
        </div>

        {/* Learning Activities */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Learning Activities
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {SelectedCourseData.learningActivity?.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Prerequisites
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {SelectedCourseData.prerequisites?.map((pre, idx) => (
              <li key={idx}>{pre}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      {SelectedCourseData.tags?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {SelectedCourseData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex items-center justify-between mt-8">
        {SelectedCourseData.fee?.paymentLink && (
          <a href={SelectedCourseData.fee.paymentLink} target="_blank">
            <CommonButton
              text="Enroll Now"
              textColor="text-white"
              bgColor="blue"
              px="px-6"
              py="py-3"
              width="auto"
              className="text-sm font-medium"
            />
          </a>
        )}

        {/* Apply Button */}
        {!isEditor && (
          <Link to={`/Course/Apply/${SelectedCourseData?._id}`}>
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
              {SelectedCourseData?.postedAt
                ? new Date(SelectedCourseData?.postedAt).toLocaleString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )
                : "Not specified"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

CourseDetailsModal.propTypes = {
  isEditor: PropTypes.bool,
  selectedCourseID: PropTypes.string,
  setSelectedCourseID: PropTypes.func.isRequired,
};

export default CourseDetailsModal;
