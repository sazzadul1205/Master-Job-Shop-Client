import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";

// Assets
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Clean string helper (remove leading/trailing quotes)
const cleanString = (str) => str?.replace(/^"(.*)"$/, "$1").trim();

// Format date helper
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const InternshipDetailsModal = ({
  selectedInternshipID,
  setSelectedInternshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected internship data
  const {
    data: SelectedInternshipData,
    isLoading: SelectedInternshipIsLoading,
    error: SelectedInternshipError,
  } = useQuery({
    queryKey: ["SelectedInternshipData", selectedInternshipID],
    queryFn: () =>
      axiosPublic
        .get(`/Internship?id=${selectedInternshipID}`)
        .then((res) => res.data),
    enabled: !!selectedInternshipID,
  });

  // Close modal helper
  const closeModal = () => {
    setSelectedInternshipID("");
    document.getElementById("Internship_Details_Modal")?.close();
  };

  // UI Error / Loading
  if (SelectedInternshipIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh] relative p-6">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Loading />
      </div>
    );
  if (SelectedInternshipError)
    return (
      <div className="min-w-5xl max-h-[90vh] relative p-6">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>
        <Error />
      </div>
    );

  // If no Data found, return null
  if (!SelectedInternshipData) return null;

  // Destructuring
  const {
    postedBy,
    title,
    description,
    category,
    subCategory,
    tags,
    requiredSkills,
    budget,
    deliveryDeadline,
    isRemote,
    location,
    communication,
    extraNotes,
    postedAt,
  } = SelectedInternshipData;

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Posted By */}
      <div className="flex items-center mb-6 gap-4">
        <img
          src={postedBy?.profileImage || DefaultUserLogo}
          alt={postedBy?.name || "Client"}
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {postedBy?.name || "Client"}
          </p>
          <p className="text-sm text-gray-600">
            Rating: {postedBy?.rating ?? "N/A"} | Jobs Posted:{" "}
            {postedBy?.jobsPosted ?? 0}
          </p>
          <p className="text-xs text-gray-500 italic">{postedBy?.email}</p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-black mb-4">
        {cleanString(title)}
      </h2>

      {/* Description */}
      <p className="text-gray-700 mb-6 whitespace-pre-line">
        {cleanString(description) || "No description provided."}
      </p>

      {/* Category & SubCategory */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 font-semibold">
          Category: <span className="font-normal">{category || "N/A"}</span> ›{" "}
          <span className="font-normal">{subCategory || "N/A"}</span>
        </p>
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-gray-700 mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Required Skills */}
      <div className="mb-4">
        <p className="font-semibold text-gray-700 mb-2">Required Skills:</p>
        {requiredSkills?.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {requiredSkills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No specific skills required.</p>
        )}
      </div>

      {/* Budget and Deadline */}
      <div className="mb-4 space-y-1">
        <p className="text-gray-700 font-semibold">
          Budget:{" "}
          <span className="font-normal">
            {budget?.currency || "USD"}
            {budget?.min || "N/A"} - {budget?.max || "N/A"}{" "}
            {budget?.isNegotiable ? "(Negotiable)" : ""}
          </span>
        </p>
        <p className="text-gray-700 font-semibold">
          Deadline:{" "}
          <span className="font-normal">{formatDate(deliveryDeadline)}</span>
        </p>
      </div>

      {/* Location */}
      <div className="mb-4">
        <p className="text-gray-700 font-semibold">
          Location:{" "}
          <span className="font-normal">
            {isRemote ? "Remote" : location || "Not specified"}
          </span>
        </p>
      </div>

      {/* Communication */}
      <div className="mb-4 space-y-1">
        <p className="text-gray-700 font-semibold">
          Preferred Communication:{" "}
          <span className="font-normal">
            {communication?.preferredMethod || "Not specified"}
          </span>
        </p>
        <p className="text-gray-700 font-semibold">
          Calls Allowed:{" "}
          <span className="font-normal">
            {communication?.allowCalls ? "Yes" : "No"}
          </span>
        </p>
      </div>

      {/* Extra Notes */}
      {extraNotes && (
        <div className="mb-4">
          <p className="font-semibold text-gray-700 mb-1">Extra Notes:</p>
          <p className="text-gray-700 whitespace-pre-line">
            {cleanString(extraNotes)}
          </p>
        </div>
      )}

      {/* Posted At */}
      <p className="text-xs text-gray-400 text-right mb-4">
        Posted on: {formatDate(postedAt)}
      </p>

      {/* Apply Button */}
      <div className="flex justify-end">
        <Link to={`/Internship/Apply/${SelectedInternshipData._id}`}>
          <CommonButton
            text="Apply Now"
            textColor="text-white"
            bgColor="blue"
            px="px-6"
            py="py-3"
            width="auto"
            className="text-base font-semibold"
          />
        </Link>
      </div>
    </div>
  );
};

InternshipDetailsModal.propTypes = {
  selectedInternshipID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setSelectedInternshipID: PropTypes.func.isRequired,
};

export default InternshipDetailsModal;
