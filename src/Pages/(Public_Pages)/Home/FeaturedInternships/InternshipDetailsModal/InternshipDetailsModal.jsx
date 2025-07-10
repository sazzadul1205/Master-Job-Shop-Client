import PropTypes from "prop-types";

// Packages
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Assess
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Icons
import { ImCross } from "react-icons/im";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const InternshipDetailsModal = ({
  selectedInternshipID,
  setSelectedInternshipID,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetching Selected Internship Data
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
    enabled: !!selectedInternshipID, // Only run when selectedInternshipID is truthy
  });

  // Loading
  if (SelectedInternshipIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedInternshipID("");
            document.getElementById("Internship_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error
  if (SelectedInternshipError)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedInternshipID("");
            document.getElementById("Internship_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // No Data Fetched
  if (!SelectedInternshipData) return null;

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <div
        onClick={() => {
          setSelectedInternshipID("");
          document.getElementById("Internship_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Posted By */}
      <div className="flex items-center mb-4">
        <img
          src={
            SelectedInternshipData?.postedBy?.profileImage || DefaultUserLogo
          }
          alt="Poster"
          className="w-12 h-12 rounded-full mr-3 object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {SelectedInternshipData?.postedBy?.name || "Client"}
          </p>
          <p className="text-xs text-gray-500">
            Rating: {SelectedInternshipData?.postedBy?.rating || "N/A"} | Jobs
            Posted: {SelectedInternshipData?.postedBy?.jobsPosted || 0}
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-black mb-4">
        {SelectedInternshipData?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-700 mb-6">
        {SelectedInternshipData?.description}
      </p>

      {/* Category & Tags */}
      <div className="mb-4">
        {/* Categories */}
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Category:</span>{" "}
          {SelectedInternshipData?.category} ›{" "}
          {SelectedInternshipData?.subCategory}
        </p>

        {/* Tags */}
        <div>
          <h4 className="font-semibold text-gray-700 pb-1">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {SelectedInternshipData?.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
              >
                # {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Required */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800 mb-1">Required Skills:</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {SelectedInternshipData?.requiredSkills?.length > 0 ? (
            SelectedInternshipData?.requiredSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))
          ) : (
            <li>None specified</li>
          )}
        </ul>
      </div>

      {/* Budget & Deadline */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Budget:</span>{" "}
          {SelectedInternshipData?.budget?.currency}
          {SelectedInternshipData?.budget?.min} -{" "}
          {SelectedInternshipData?.budget?.max}{" "}
          {SelectedInternshipData?.budget?.isNegotiable && "(Negotiable)"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Deadline:</span>{" "}
          {new Date(
            SelectedInternshipData?.deliveryDeadline
          ).toLocaleDateString()}
        </p>
      </div>

      {/* Location Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Location:</span>{" "}
          {location?.city
            ? `${location.city}, ${location.country}`
            : SelectedInternshipData?.isRemote
            ? "Remote"
            : "Not specified"}
        </p>
      </div>

      {/* Communication */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Preferred Communication:</span>{" "}
          {SelectedInternshipData?.communication?.preferredMethod ||
            "Not specified"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Calls Allowed:</span>{" "}
          {SelectedInternshipData?.communication?.allowCalls ? "Yes" : "No"}
        </p>
      </div>

      {/* Extra Notes */}
      {SelectedInternshipData?.extraNotes && (
        <div className="mb-4">
          <p className="font-semibold text-gray-800 mb-1">Extra Notes:</p>
          <p className="text-sm text-gray-700">
            {SelectedInternshipData?.extraNotes}
          </p>
        </div>
      )}

      {/* Action Area */}
      <div className="flex justify-between items-center mt-6">
        <Link to={`/Internships/${SelectedInternshipData?._id}`}>
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
        <p className="text-xs text-gray-400">
          Posted on:{" "}
          {new Date(SelectedInternshipData?.postedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

// Prop Validation
InternshipDetailsModal.propTypes = {
  selectedInternshipID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  setSelectedInternshipID: PropTypes.func.isRequired,
};

export default InternshipDetailsModal;
