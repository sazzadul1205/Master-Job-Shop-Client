import { Link } from "react-router-dom";

// Package
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";

// Assets
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Format ISO date string to "dd MMM yyyy"
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

const GigDetailsModal = ({ selectedGigID, setSelectedGigID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetch the selected gig data by ID when selectedGigID is truthy
  const {
    data: SelectedGigData,
    isLoading: SelectedGigIsLoading,
    error: SelectedGigError,
  } = useQuery({
    queryKey: ["SelectedGigData", selectedGigID],
    queryFn: () =>
      axiosPublic.get(`/Gigs?id=${selectedGigID}`).then((res) => res.data),
    enabled: !!selectedGigID,
  });

  // Close modal helper function
  const closeModal = () => {
    setSelectedGigID("");
    document.getElementById("Gig_Details_Modal")?.close();
  };

  // Loading State
  if (SelectedGigIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh] relative">
        {/* Close Button */}
        <div
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error State
  if (SelectedGigError)
    return (
      <div className="min-w-5xl max-h-[90vh] relative">
        {/* Close Button */}
        <div
          onClick={closeModal}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // If no data, don't render anything
  if (!SelectedGigData) return null;

  // Safe destructuring with fallback defaults
  const {
    title = "Untitled Gig",
    description = "No description provided.",
    category = "N/A",
    subCategory = "N/A",
    tags = [],
    deliveryDeadline,
    requiredSkills = [],
    budget = {},
    communication = {},
    isRemote = false,
    location,
    postedBy = {},
    postedAt,
    extraNotes,
  } = SelectedGigData;

  // Location can be a string or an object with city/country
  let displayLocation = "Not specified";
  if (isRemote) {
    displayLocation = "Remote";
  } else if (typeof location === "string" && location.trim()) {
    displayLocation = location;
  } else if (location && (location.city || location.country)) {
    displayLocation = `${location.city || ""}${
      location.city && location.country ? ", " : ""
    }${location.country || ""}`;
  }

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <div
        onClick={closeModal}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-6 whitespace-pre-line">
        {description}
      </p>

      {/* Main Sections */}
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Category & Sub Category */}
          <div>
            <h4 className="font-semibold text-gray-700">Category</h4>
            <p className="text-gray-600">
              {category} › {subCategory}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="font-semibold text-gray-700">Required Skills</h4>
            {requiredSkills.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600">
                {requiredSkills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No skills specified.</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <h4 className="font-semibold text-gray-700 pb-1">Tags</h4>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                  >
                    # {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tags added.</p>
            )}
          </div>

          {/* Delivery Deadline */}
          <div>
            <h4 className="font-semibold text-gray-700">Delivery Deadline</h4>
            <p className="text-gray-600">{formatDate(deliveryDeadline)}</p>
          </div>

          {/* Budget */}
          <div>
            <h4 className="font-semibold text-gray-700">Budget</h4>
            <p className="text-gray-600">
              {budget.currency || ""} {budget.min || "N/A"} -{" "}
              {budget.max || "N/A"} {budget.isNegotiable ? "(Negotiable)" : ""}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Client Info */}
          <div>
            <h4 className="font-semibold text-gray-700">Client</h4>
            <div className="flex items-center gap-3 mt-1">
              <img
                src={postedBy.profileImage || DefaultUserLogo}
                alt="Client"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {postedBy.name || "Unknown Client"}
                </p>
                <p className="text-xs text-gray-500">
                  {postedBy.GigsPosted || 0} Gig
                  {(postedBy.GigsPosted || 0) !== 1 ? "s" : ""} posted
                </p>
                <p className="text-xs text-yellow-600 font-medium">
                  ⭐ {postedBy.rating != null ? postedBy.rating : "N/A"}/5.0
                </p>
              </div>
            </div>
          </div>

          {/* Communication Preference */}
          <div>
            <h4 className="font-semibold text-gray-700">
              Communication Preference
            </h4>
            <p className="text-gray-600">
              {communication.preferredMethod || "Not specified"}
              {communication.allowCalls ? " (Calls allowed)" : ""}
            </p>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-gray-700">Location</h4>
            <p className="text-gray-600">{displayLocation}</p>
          </div>

          {/* Posted Date */}
          <div>
            <h4 className="font-semibold text-gray-700">Posted</h4>
            <p className="text-gray-600">{formatDate(postedAt)}</p>
          </div>
        </div>
      </div>

      {/* Extra Notes Section */}
      {extraNotes && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Extra Notes</h4>
          <p className="text-gray-600 whitespace-pre-line">{extraNotes}</p>
        </div>
      )}

      {/* Attachments Section */}
      {SelectedGigData?.attachments &&
        SelectedGigData.attachments.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2">Attachments</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {SelectedGigData.attachments.map(({ url, label, type }, i) => (
                <li key={i}>
                  <strong>{label || "Attachment"}</strong> ({type || "file"}):{" "}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Apply Now / Bid Now Button */}
      <section className="pt-5">
        <Link
          to={`/external-apply?url=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 text-sm"
        >
          Bid Now
        </Link>
      </section>
    </div>
  );
};

GigDetailsModal.propTypes = {
  selectedGigID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedGigID: PropTypes.func.isRequired,
};

export default GigDetailsModal;
