import { ImCross } from "react-icons/im";
import Loading from "../../../../../Shared/Loading/Loading";
import Error from "../../../../../Shared/Error/Error";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

// Assess
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const GigDetailsModal = ({ selectedGigID, setSelectedGigID }) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: gig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedGigData", selectedGigID],
    queryFn: () =>
      axiosPublic.get(`/Gigs?id=${selectedGigID}`).then((res) => res.data),
    enabled: !!selectedGigID,
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!gig) return null;

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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{gig.title}</h2>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-6 whitespace-pre-line">
        {gig.description}
      </p>

      {/* Main Sections */}
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        {/* Left Column */}
        <div className="space-y-4">
            
          <div>
            <h4 className="font-semibold text-gray-700">Category</h4>
            <p className="text-gray-600">
              {gig.category} › {gig.subCategory}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Required Skills</h4>
            <ul className="list-disc list-inside text-gray-600">
              {gig.requiredSkills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {gig.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Delivery Deadline</h4>
            <p className="text-gray-600">{formatDate(gig.deliveryDeadline)}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Budget</h4>
            <p className="text-gray-600">
              {gig.budget.currency}
              {gig.budget.min} - {gig.budget.max}{" "}
              {gig.budget.isNegotiable && "(Negotiable)"}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700">Client</h4>
            <div className="flex items-center gap-3 mt-1">
              <img
                src={gig.postedBy.profileImage || DefaultUserLogo}
                alt="Client"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium text-gray-800">{gig.postedBy.name}</p>
                <p className="text-xs text-gray-500">
                  {gig.postedBy.jobsPosted} job
                  {gig.postedBy.jobsPosted > 1 ? "s" : ""} posted
                </p>
                <p className="text-xs text-yellow-600 font-medium">
                  ⭐ {gig.postedBy.rating}/5.0
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">
              Communication Preference
            </h4>
            <p className="text-gray-600">
              {gig.communication.preferredMethod}
              {gig.communication.allowCalls ? " (Calls allowed)" : ""}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Location</h4>
            <p className="text-gray-600">
              {gig.isRemote
                ? "Remote"
                : gig.location.city
                ? `${gig.location.city}, ${gig.location.country}`
                : "Not specified"}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Posted</h4>
            <p className="text-gray-600">{formatDate(gig.postedAt)}</p>
          </div>
        </div>
      </div>

      {/* Extra Notes */}
      {gig.extraNotes && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700">Extra Notes</h4>
          <p className="text-gray-600 whitespace-pre-line">{gig.extraNotes}</p>
        </div>
      )}
    </div>
  );
};

export default GigDetailsModal;
