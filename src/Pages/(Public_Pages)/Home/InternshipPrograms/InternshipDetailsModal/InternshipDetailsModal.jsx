// Assess
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

import { ImCross } from "react-icons/im";
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
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
        .get(`/Internships?id=${selectedInternshipID}`)
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

      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        {SelectedInternshipData?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-700 mb-6">
        {SelectedInternshipData?.description}
      </p>

      {/* Category & Tags */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Category:</span>{" "}
          {SelectedInternshipData?.category} ›{" "}
          {SelectedInternshipData?.subCategory}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Tags:</span>{" "}
          {SelectedInternshipData?.tags?.length
            ? SelectedInternshipData?.tags.join(", ")
            : "None"}
        </p>
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

      {/* Posted By */}
      <div className="flex items-center mt-6 border-t pt-4">
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
        <p className="ml-auto text-xs text-gray-400">
          Posted on:{" "}
          {new Date(SelectedInternshipData?.postedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default InternshipDetailsModal;
