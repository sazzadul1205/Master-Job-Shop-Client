import { useQuery } from "@tanstack/react-query";
import Bid from "../../../assets/EmployerLayout/Bid/BidBlue.png";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaEye,
} from "react-icons/fa";
import { useState } from "react";
import { ImCross } from "react-icons/im";
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
          const currentPage = pageStates[gig._id] ?? 1;
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;

          const paginatedBids = gig.Bids.slice(start, end);

          const totalPages = Math.ceil(gig.Bids.length / ITEMS_PER_PAGE);

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

              {/* Applicants Table */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedGigId === gig._id ? "max-h-[1000px] pt-4" : "max-h-0"
                }`}
              >
                {/* Applicants Container */}
                <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
                  {/* Applicants Table */}
                  <table className="min-w-full bg-white text-sm text-gray-800">
                    <thead className="bg-gray-100 border-b text-gray-900 text-left">
                      <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Profile</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Phone</th>
                        <th className="px-4 py-2">Bid Amount</th>
                        <th className="px-4 py-2">Delivery Days</th>
                        <th className="px-4 py-2">Submitted</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>

                    {/* Applicants Table - Body */}
                    <tbody className="divide-y divide-gray-200">
                      {[
                        // Sort paginatedBids: Accepted first (0), others middle (1), Rejected last (2)
                        ...[...paginatedBids].sort((a, b) => {
                          const getOrder = (status) => {
                            if (status === "Accepted") return 0;
                            if (status === "Rejected") return 2;
                            return 1; // everything else goes in the middle
                          };
                          return getOrder(a.status) - getOrder(b.status);
                        }),
                      ].map((applicant, idx) => {
                        const interviewDate = applicant?.interview
                          ?.interviewTime
                          ? new Date(applicant.interview.interviewTime)
                          : null;
                        const now = new Date();

                        const timeLeftMs = interviewDate
                          ? interviewDate - now
                          : 0;
                        const msInMinute = 1000 * 60;
                        const msInHour = msInMinute * 60;
                        const msInDay = msInHour * 24;
                        const msInMonth = msInDay * 30;

                        let timeLeft = "";

                        if (!interviewDate || timeLeftMs <= 0) {
                          timeLeft = "Interview time passed";
                        } else {
                          const months = Math.floor(timeLeftMs / msInMonth);
                          const days = Math.floor(
                            (timeLeftMs % msInMonth) / msInDay
                          );
                          const hours = Math.floor(
                            (timeLeftMs % msInDay) / msInHour
                          );
                          const minutes = Math.floor(
                            (timeLeftMs % msInHour) / msInMinute
                          );

                          timeLeft =
                            (months > 0 ? `${months}mo ` : "") +
                            (days > 0 ? `${days}d ` : "") +
                            (hours > 0 ? `${hours}h ` : "") +
                            (minutes > 0 ? `${minutes}m` : "");

                          if (!timeLeft.trim())
                            timeLeft = "Less than a minute left";
                        }

                        return (
                          <tr
                            key={applicant._id}
                            className={`${"hover:bg-gray-50"}`}
                          >
                            {/* Email */}
                            <td className="px-4 py-2">
                              {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1} .
                            </td>

                            {/* Basic Information */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {/* Image */}
                                <img
                                  src={applicant.profileImage}
                                  alt={applicant.name}
                                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                                />
                                {/* Name */}
                                <span className="font-medium">
                                  {applicant.name}
                                </span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-4 py-2">{applicant?.email}</td>

                            {/* Phone */}
                            <td className="px-4 py-2">{applicant?.phone}</td>

                            {/* Bid Amount */}
                            <td className="px-4 py-2">
                              {applicant?.bidAmount}
                            </td>

                            {/* Delivery Days */}
                            <td className="px-4 py-2">
                              {applicant?.deliveryDays}{" "}
                              {applicant?.deliveryDays === 1 ? "Day" : "Days"}
                            </td>

                            {/* Submitted Date */}
                            <td className="px-4 py-2">
                              {new Date(
                                "2025-08-07T04:03:55.886Z"
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>

                            {/* // Pending Status */}
                            <td className="px-4 py-3 flex justify-end items-center gap-2 whitespace-nowrap flex-shrink-0">
                              {/* View Button */}
                              <button
                                onClick={() => {
                                  setSelectedBidID(applicant?._id);
                                  document
                                    .getElementById("View_Gig_Bids_Modal")
                                    .showModal();
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 font-medium text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 rounded transition cursor-pointer"
                              >
                                <FaEye />
                                View
                              </button>

                              {/* Reject Button */}
                              <button
                                onClick={() => {
                                  //   handleRejectApplicant(applicant._id);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 font-medium text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded transition cursor-pointer"
                              >
                                <ImCross />
                                Reject
                              </button>

                              {/* Accept Button */}
                              <button
                                onClick={() => {
                                  //   setSelectedApplicationID(applicant?._id);
                                  document
                                    .getElementById(
                                      "Accepted_Application_Modal"
                                    )
                                    .showModal();
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 font-medium text-green-500 hover:text-white border border-green-500 hover:bg-green-500 rounded transition cursor-pointer"
                              >
                                <FaCheck />
                                Accept
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

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
        })}
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
    </>
  );
};

export default ManageGigBids;
