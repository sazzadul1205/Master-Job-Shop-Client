import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Assets
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Icons
import { ImCross } from "react-icons/im";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const MentorshipDetailsModal = ({
  selectedMentorshipID,
  setSelectedMentorshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetching Selected Mentorship Data
  const {
    data: SelectedMentorshipData,
    isLoading: SelectedMentorshipIsLoading,
    error: SelectedMentorshipError,
  } = useQuery({
    queryKey: ["SelectedMentorshipData", selectedMentorshipID],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?id=${selectedMentorshipID}`)
        .then((res) => res.data),
    enabled: !!selectedMentorshipID, // Only run when selectedMentorshipID is truthy
  });

  // Loading
  if (SelectedMentorshipIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedMentorshipID("");
            document.getElementById("Mentorship_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error
  if (SelectedMentorshipError)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedMentorshipID("");
            document.getElementById("Mentorship_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // No Data Fetched
  if (!SelectedMentorshipData) return null;

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <div
        onClick={() => {
          setSelectedMentorshipID("");
          document.getElementById("Mentorship_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Mentor Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={SelectedMentorshipData?.mentor?.profileImage || DefaultUserLogo}
          alt="Mentor"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {SelectedMentorshipData?.mentor?.name}
          </p>
          <p className="text-sm text-gray-500">
            Rating: {SelectedMentorshipData?.mentor?.rating} | Mentees:{" "}
            {SelectedMentorshipData?.mentor?.totalMentees}
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-800 mb-2">
        {SelectedMentorshipData?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-700 mb-4">
        {SelectedMentorshipData?.description}
      </p>

      {/* Category & Tags */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <strong>Category:</strong> {SelectedMentorshipData?.category} ›{" "}
          {SelectedMentorshipData?.subCategory}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Tags:</strong>{" "}
          {SelectedMentorshipData?.tags?.length
            ? SelectedMentorshipData?.tags.join(", ")
            : "None"}
        </p>
      </div>

      {/* Skills & Prerequisites */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800">Skills Covered:</p>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
          {SelectedMentorshipData?.skillsCovered.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
        <p className="font-semibold text-gray-800">Prerequisites:</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {SelectedMentorshipData?.prerequisites.length > 0 ? (
            SelectedMentorshipData?.prerequisites.map((p, i) => (
              <li key={i}>{p}</li>
            ))
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      {/* Schedule */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800">Schedule:</p>
        <p className="text-sm text-gray-700">
          {SelectedMentorshipData?.schedule.sessionsPerWeek} sessions/week •{" "}
          {SelectedMentorshipData?.schedule.sessionLength} • Days:{" "}
          {SelectedMentorshipData?.schedule.days.join(", ")} • Time Zone:{" "}
          {SelectedMentorshipData?.schedule.timeZone}
        </p>
      </div>

      {/* Fee & Dates */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <strong>Fee:</strong> {SelectedMentorshipData?.fee.currency}
          {SelectedMentorshipData?.fee.amount}{" "}
          {SelectedMentorshipData?.fee.isNegotiable ? "(Negotiable)" : ""}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Start Date:</strong>{" "}
          {new Date(SelectedMentorshipData?.startDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Application Deadline:</strong>{" "}
          {new Date(
            SelectedMentorshipData?.applicationDeadline
          ).toLocaleDateString()}
        </p>
      </div>

      {/* Communication */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800">Communication:</p>
        <p className="text-sm text-gray-700">
          Preferred: {SelectedMentorshipData?.communication.preferredMethod}
        </p>
        <p className="text-sm text-gray-700">
          Group Chat:{" "}
          {SelectedMentorshipData?.communication.groupChatEnabled
            ? "Enabled"
            : "Disabled"}
        </p>
        <p className="text-sm text-gray-700">
          One-on-One Support:{" "}
          {SelectedMentorshipData?.communication.oneOnOneSupport ? "Yes" : "No"}
        </p>
      </div>

      {/* Location */}
      <p className="text-sm text-gray-700 mb-4">
        <strong>Location:</strong>{" "}
        {SelectedMentorshipData?.location?.city
          ? `${SelectedMentorshipData?.location.city}, ${SelectedMentorshipData?.location.country}`
          : SelectedMentorshipData?.isRemote
          ? "Remote"
          : "Not specified"}
      </p>

      {/* Notes */}
      {SelectedMentorshipData?.extraNotes && (
        <div className="mb-4">
          <p className="font-semibold text-gray-800">Extra Notes:</p>
          <p className="text-sm text-gray-700">
            {SelectedMentorshipData?.extraNotes}
          </p>
        </div>
      )}

      {/* Actions */}
      <Link to={`/Mentorship/${selectedMentorshipID}`}>
        <CommonButton
          text="Apply Now"
          textColor="text-white"
          bgColor="blue"
          px="px-4"
          py="py-2"
          width="auto"
          className="text-sm font-medium"
        />
      </Link>

      <p className="text-xs text-gray-400 mt-4">
        Posted on:{" "}
        {new Date(SelectedMentorshipData?.postedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

MentorshipDetailsModal.propTypes = {
  selectedMentorshipID: PropTypes.string.isRequired,
  setSelectedMentorshipID: PropTypes.func.isRequired,
};

export default MentorshipDetailsModal;
