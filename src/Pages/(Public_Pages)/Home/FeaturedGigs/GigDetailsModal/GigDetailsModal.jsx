import { ImCross } from "react-icons/im";
import Loading from "../../../../../Shared/Loading/Loading";
import Error from "../../../../../Shared/Error/Error";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

// Assess
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const GigDetailsModal = ({ selectedGigID, setSelectedGigID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetching Selected Gig Data
  const {
    data: SelectedGigData,
    isLoading: SelectedGigIsLoading,
    error: SelectedGigError,
  } = useQuery({
    queryKey: ["SelectedGigData", selectedGigID],
    queryFn: () =>
      axiosPublic.get(`/Gigs?id=${selectedGigID}`).then((res) => res.data),
    enabled: !!selectedGigID, // Only run when selectedGigID is truthy
  });

  // Loading
  if (SelectedGigIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedGigID("");
            document.getElementById("Gig_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error
  if (SelectedGigError)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedGigID("");
            document.getElementById("Gig_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // No Data Fetched
  if (!SelectedGigData) return null;

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <div
        onClick={() => {
          setSelectedGigID("");
          document.getElementById("Gig_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {SelectedGigData?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-6 whitespace-pre-line">
        {SelectedGigData?.description}
      </p>

      {/* Main Sections */}
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Category & Sub Category */}
          <div>
            <h4 className="font-semibold text-gray-700">Category</h4>
            <p className="text-gray-600">
              {SelectedGigData?.category} › {SelectedGigData?.subCategory}
            </p>
          </div>

          {/* Required Sills */}
          <div>
            <h4 className="font-semibold text-gray-700">Required Skills</h4>
            <ul className="list-disc list-inside text-gray-600">
              {SelectedGigData?.requiredSkills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <h4 className="font-semibold text-gray-700 pb-1">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {SelectedGigData?.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  # {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Delivery Deadline */}
          <div>
            <h4 className="font-semibold text-gray-700">Delivery Deadline</h4>
            <p className="text-gray-600">
              {formatDate(SelectedGigData?.deliveryDeadline)}
            </p>
          </div>

          {/* Budgets */}
          <div>
            <h4 className="font-semibold text-gray-700">Budget</h4>
            <p className="text-gray-600">
              {SelectedGigData?.budget.currency}
              {SelectedGigData?.budget.min} - {SelectedGigData?.budget.max}{" "}
              {SelectedGigData?.budget.isNegotiable && "(Negotiable)"}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Cents */}
          <div>
            <h4 className="font-semibold text-gray-700">Client</h4>
            <div className="flex items-center gap-3 mt-1">
              <img
                src={SelectedGigData?.postedBy.profileImage || DefaultUserLogo}
                alt="Client"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {SelectedGigData?.postedBy.name}
                </p>
                <p className="text-xs text-gray-500">
                  {SelectedGigData?.postedBy.GigsPosted} Gig
                  {SelectedGigData?.postedBy.GigsPosted > 1 ? "s" : ""} posted
                </p>
                <p className="text-xs text-yellow-600 font-medium">
                  ⭐ {SelectedGigData?.postedBy.rating}/5.0
                </p>
              </div>
            </div>
          </div>

          {/*  Communication Preference */}
          <div>
            <h4 className="font-semibold text-gray-700">
              Communication Preference
            </h4>
            <p className="text-gray-600">
              {SelectedGigData?.communication.preferredMethod}
              {SelectedGigData?.communication.allowCalls
                ? " (Calls allowed)"
                : ""}
            </p>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-gray-700">Location</h4>
            <p className="text-gray-600">
              {SelectedGigData?.isRemote
                ? "Remote"
                : SelectedGigData?.location.city
                ? `${SelectedGigData?.location.city}, ${SelectedGigData?.location.country}`
                : "Not specified"}
            </p>
          </div>

          {/* Posted */}
          <div>
            <h4 className="font-semibold text-gray-700">Posted</h4>
            <p className="text-gray-600">
              {formatDate(SelectedGigData?.postedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Extra Notes */}
      {SelectedGigData?.extraNotes && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Extra Notes</h4>
          <p className="text-gray-600 whitespace-pre-line">
            {SelectedGigData?.extraNotes}
          </p>
        </div>
      )}

      {/* Apply Now Button */}
      <section className="pt-5">
        <Link
          to={`/external-apply?url=${encodeURIComponent(
            SelectedGigData?.title
          )}`}
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

// Prop Validation
GigDetailsModal.propTypes = {
  selectedGigID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedGigID: PropTypes.func.isRequired,
};

export default GigDetailsModal;
