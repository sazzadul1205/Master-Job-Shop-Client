// Assets
import { useQuery } from "@tanstack/react-query";
import Bid from "../../../assets/EmployerLayout/Bid/BidBlue.png";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

const ManageGigBids = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management [ Expanded Gig Id , Page States ]
  const [pageStates, setPageStates] = useState({});
  const [expandedGigId, setExpandedGigId] = useState(null);

  // Fetching Gigs Data
  const {
    data: GigsData,
    isLoading: GigsIsLoading,
    error: GigsError,
    refetch: GigsRefetch,
  } = useQuery({
    queryKey: ["GigsData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Gigs?postedBy=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Getting Gig Ids
  const gigIds = GigsData?.map((gig) => gig._id) || [];

  // Fetching Bids Data
  const {
    data: GigBidsData,
    isLoading: GigBidsLoading,
    error: GigBidsError,
    refetch: GigBidsRefetch,
  } = useQuery({
    queryKey: ["GigBidsData", gigIds],
    queryFn: () => {
      const query = gigIds.map((id) => `gigIds[]=${id}`).join("&");
      return axiosPublic.get(`/GigBids?${query}`).then((res) => res.data);
    },
    enabled: gigIds.length > 0,
  });

  // Combining Gigs and Gig Applications Data
  const GigsWithBids = GigsData?.map((gig) => {
    const bids = GigBidsData?.filter((app) => app.gigId === gig._id) || [];
    return { ...gig, Bids: bids };
  });

  // Refetching Data
  const refetch = () => {
    GigsRefetch();
    GigBidsRefetch();
  };

  // Loading / Error UI Handling
  if (GigBidsLoading || GigsIsLoading || loading) return <Loading />;
  if (GigBidsError || GigsError) return <Error />;

  console.log("Gigs With Bids :", GigsWithBids);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-3 px-5">
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <img src={Bid} alt="Manage Job Applicant Icons" className="w-6 h-6" />
          Manage Gig Bids
        </h3>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Jobs Container */}
      <div className="px-4 pt-4 space-y-3">
        {GigsWithBids?.map((gig, index) => {
          return (
            <div
              key={gig._id}
              className="w-full border border-gray-200 rounded p-6 bg-white shadow hover:shadow-lg transition duration-300"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  # 0{index + 1}. {gig.title}
                </h2>
                <div className="text-sm text-gray-800">
                  {gig.category} {" > "} {gig.subCategory}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-4" />

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-800 mb-4">
                {/* Budget */}
                <div>
                  <span className="font-medium text-gray-900">Budget:</span>{" "}
                  {gig.budget?.min} - {gig.budget?.max} {gig.budget?.currency} (
                  {gig.budget?.type})
                </div>

                {/* Negotiable */}
                <div>
                  <span className="font-medium text-gray-900">Negotiable:</span>{" "}
                  {gig.budget?.isNegotiable ? "Yes" : "No"}
                </div>

                {/* Location */}
                <div>
                  <span className="font-medium text-gray-900">Location:</span>{" "}
                  {gig.isRemote ? "Remote" : gig.location}
                </div>

                {/* Communication */}
                <div>
                  <span className="font-medium text-gray-900">
                    Communication:
                  </span>{" "}
                  {gig.communication?.preferredMethod}
                </div>

                {/* Tags */}
                <div>
                  <span className="font-medium text-gray-900">Tags:</span>{" "}
                  {gig.tags?.slice(0, 3).join(", ")}
                  {gig.tags.length > 3 && " ..."}
                </div>

                {/* Posted At */}
                <div>
                  <span className="font-medium text-gray-900">Posted:</span>{" "}
                  {new Date(gig.postedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Applicants Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
                {/* Bids */}
                <div className="flex text-sm font-medium text-gray-700 gap-4">
                  <p>
                    Bids:{" "}
                    <span className="text-gray-900">
                      {gig.Bids?.length || 0}
                    </span>
                  </p>
                </div>

                {/* Open / Close Applicants Table Button */}
                {expandedGigId === gig._id ? (
                  <button
                    onClick={() => setExpandedGigId(null)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:underline transition cursor-pointer"
                  >
                    <FaChevronUp className="text-base" />
                    Close Bids
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setExpandedGigId(gig._id);
                      setPageStates((prev) => ({ ...prev, [gig._id]: 1 }));
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline transition cursor-pointer"
                  >
                    <FaChevronDown className="text-base" />
                    View Bids
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ManageGigBids;
