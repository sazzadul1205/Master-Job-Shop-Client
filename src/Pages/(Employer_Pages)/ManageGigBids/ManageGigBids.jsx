import { useState } from "react";

// Icons
import { useQuery } from "@tanstack/react-query";

//Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// Assets
import Bid from "../../../assets/EmployerLayout/Bid/BidBlue.png";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Components - Table
import GigBidsTable from "./GigBidsTable/GigBidsTable";

// Modals
import AcceptGigBidsModal from "./AcceptGigBidsModal/AcceptGigBidsModal";
import ViewBidInterviewModal from "./ViewBidInterviewModal/ViewBidInterviewModal";
import MyGigBidsModal from "../../(Member_Pages)/MyGigBids/MyGigBidsModal/MyGigBidsModal";

const ManageGigBids = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management [ Expanded Gig Id , Page States ]
  const [pageStates, setPageStates] = useState({});
  const [expandedGigId, setExpandedGigId] = useState(null);
  const [selectedBidID, setSelectedBidID] = useState(null);

  // Items Per Page
  const ITEMS_PER_PAGE = 5;

  // Fetching Gigs Data
  const {
    data: GigsData,
    isLoading: GigsIsLoading,
    error: GigsError,
    refetch: GigsRefetch,
  } = useQuery({
    queryKey: ["GigsData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Gigs?postedBy=${user?.email}`);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data];
      return [];
    },
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
      <div className="px-4 py-4 space-y-3">
        {GigsWithBids?.length > 0 ? (
          GigsWithBids?.map((gig, index) => {
            // Get the current page number for this job from the pageStates object
            // If there’s no entry yet, default to page 1
            const currentPage = pageStates[gig._id] || 1;

            // Sort the job's applicants by their status
            // Order: No status first → Accepted → Rejected → Everything else
            const sortedBids = [...gig.Bids].sort((a, b) => {
              // Helper function to assign a numeric "rank" to each status
              const getOrder = (status) => {
                if (!status) return 0; // No status → highest priority
                if (status === "Accepted") return 1; // Accepted comes second
                if (status === "Rejected") return 2; // Rejected comes last
                return 3; // Any other status after that
              };

              // Compare two applicants based on their status order
              return getOrder(a.status) - getOrder(b.status);
            });

            // Slice the sorted list to get only the applicants for the current page
            const paginatedBids = sortedBids.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            );

            // Calculate the total number of pages based on the number of applicants
            const totalPages = Math.ceil(sortedBids.length / ITEMS_PER_PAGE);

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
                    {gig.budget?.min} - {gig.budget?.max} {gig.budget?.currency}{" "}
                    ({gig.budget?.type})
                  </div>

                  {/* Negotiable */}
                  <div>
                    <span className="font-medium text-gray-900">
                      Negotiable:
                    </span>{" "}
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

                    {gig?.Bids.filter((app) => app.status === "Accepted")
                      .length > 0 && (
                      <>
                        {" | "}
                        <p>
                          Accepted:{" "}
                          <span className="text-green-600 font-semibold">
                            {
                              gig?.Bids.filter(
                                (app) => app.status === "Accepted"
                              ).length
                            }
                          </span>
                        </p>
                      </>
                    )}

                    {gig?.Bids.filter((app) => app.status === "Rejected")
                      .length > 0 && (
                      <>
                        {" | "}
                        <p>
                          Rejected:{" "}
                          <span className="text-red-600 font-semibold">
                            {
                              gig?.Bids.filter(
                                (app) => app.status === "Rejected"
                              ).length
                            }
                          </span>
                        </p>
                      </>
                    )}
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

                {/* Applicants Table */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    expandedGigId === gig._id
                      ? "max-h-[1000px] pt-4"
                      : "max-h-0"
                  }`}
                >
                  {/* Applicants Container */}
                  <GigBidsTable
                    refetch={refetch}
                    currentPage={currentPage}
                    paginatedBids={paginatedBids}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    setSelectedBidID={setSelectedBidID}
                  />

                  {/* Pagination Controls */}
                  {gig.Bids.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-center pt-2">
                      <div className="join">
                        {/* Left Button */}
                        <button
                          className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setPageStates((prev) => ({
                              ...prev,
                              [gig._id]: currentPage - 1,
                            }))
                          }
                        >
                          <FaAngleLeft />
                        </button>

                        {/* Page Count */}
                        <button className="join-item bg-white text-black border border-gray-400 px-3 py-2 cursor-default">
                          Page {currentPage}
                        </button>

                        {/* Right Button */}
                        <button
                          className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setPageStates((prev) => ({
                              ...prev,
                              [gig._id]: currentPage + 1,
                            }))
                          }
                        >
                          <FaAngleRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-16 px-4">
            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              No Gig Posted Yet
            </p>
            <p className="text-sm text-gray-500 max-w-xs text-center">
              Looks like you haven&apos;t posted any gigs yet. Start by creating
              a new gig to attract talented freelancers!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* View Bids Modal */}
      <dialog id="View_Gig_Bids_Modal" className="modal">
        <MyGigBidsModal
          refetch={refetch}
          selectedBidID={selectedBidID}
          setSelectedBidID={setSelectedBidID}
        />
      </dialog>

      {/* Accepted Bid Modal */}
      <dialog id="Accepted_Bid_Modal" className="modal">
        <AcceptGigBidsModal
          refetch={refetch}
          selectedBidID={selectedBidID}
          setSelectedBidID={setSelectedBidID}
        />
      </dialog>

      {/* View Bid Interview Modal */}
      <dialog id="View_Bid_Interview_Modal" className="modal">
        <ViewBidInterviewModal
          refetch={refetch}
          selectedBidID={selectedBidID}
          setSelectedBidID={setSelectedBidID}
        />
      </dialog>
    </>
  );
};

export default ManageGigBids;
