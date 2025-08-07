import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import GigBids from "../../../assets/EmployerLayout/Bid/BidWhite.png";

// Modals
import MyGigBidsModal from "./MyGigBidsModal/MyGigBidsModal";
import GigDetailsModal from "../../(Public_Pages)/Home/FeaturedGigs/GigDetailsModal/GigDetailsModal";

const MyGigBids = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Gigs ID
  const [bidsList, setBidsList] = useState([]);
  const [selectedBidID, setSelectedBidID] = useState(null);
  const [selectedGigID, setSelectedGigID] = useState(null);

  // Step 1: Fetch Gig Bids
  const {
    data: GigBidsData = [],
    isLoading: GigBidsIsLoading,
    error: GigBidsError,
    refetch: refetchGigBids,
  } = useQuery({
    queryKey: ["GigBidsData"],
    queryFn: () =>
      axiosPublic.get(`/GigBids?email=${user?.email}`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data]; // normalize to array
      }),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique gigIds
  const gigIds = GigBidsData.map((app) => app.gigId);
  const uniqueGigIds = [...new Set(gigIds)];

  // Step 3: Fetch gigs
  const {
    data: GigsData = [],
    isLoading: GigsIsLoading,
    error: GigsError,
    refetch: GigsRefetch,
  } = useQuery({
    queryKey: ["GigsData", uniqueGigIds],
    queryFn: () =>
      axiosPublic.get(`/Gigs?gigIds=${uniqueGigIds.join(",")}`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data]; 
      }),
    enabled: !!user?.email && uniqueGigIds.length > 0,
  });

  useEffect(() => {
    if (GigBidsData.length > 0) {
      setBidsList(GigBidsData);
    }
  }, [GigBidsData]);

  // Delete Bid Handler
  const handleDeleteBid = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Bid.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/GigBids/${id}`);

        if (res.status === 200) {
          // Optimistically update state
          setBidsList((prev) => prev.filter((bid) => bid._id !== id));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Bid has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Silent refetch
          await refetchGigBids({ throwOnError: false });
          await GigsRefetch({ throwOnError: false });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to delete",
          text:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  // UI Error / Loading
  if (loading || GigBidsIsLoading || GigsIsLoading) return <Loading />;
  if (GigBidsError || GigsError) return <Error />;

  // Merge bids with gigs
  const mergedData = bidsList
    .map((application) => {
      const gig = GigsData.find((gig) => gig._id === application.gigId);
      return {
        ...application,
        gig,
      };
    })
    .filter((item) => item.gig);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Gig Bids
      </h3>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Bids Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-3">
        {mergedData.length > 0 ? (
          mergedData.map((item) => {
            const bidedAgo = formatDistanceToNow(new Date(item.submittedAt), {
              addSuffix: true,
            });
            const deliveryDeadline = item.gig?.deliveryDeadline
              ? new Date(item.gig.deliveryDeadline).toLocaleDateString()
              : "N/A";

            const budget = item.gig?.budget;
            const budgetRange = budget
              ? `${budget.min?.toLocaleString()} - ${budget.max?.toLocaleString()} ${
                  budget.currency || ""
                }`
              : "Not specified";

            return (
              <article
                key={item._id}
                className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-6 min-h-[360px]"
              >
                {/* Title & Category */}
                <div>
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-1 truncate"
                    title={item.gig?.title}
                  >
                    {item.gig?.title || "Gig Title Not Available"}
                  </h3>
                  <p
                    className="text-sm text-gray-600"
                    title={`${item.gig?.category} > ${item.gig?.subCategory}`}
                  >
                    {item.gig?.category} &gt; {item.gig?.subCategory}
                  </p>
                </div>

                {/* Bid Info */}
                <dl className="mt-4 text-gray-700 text-sm grid grid-cols-2 gap-y-2 gap-x-6">
                  <div>
                    <dt className="font-semibold text-gray-800">Bid Amount</dt>
                    <dd className="mt-1">${item.bidAmount?.toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">
                      Delivery Time
                    </dt>
                    <dd className="mt-1">{item.deliveryDays} Days</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Submitted</dt>
                    <dd className="mt-1">{bidedAgo}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Posted By</dt>
                    <dd
                      className="mt-1 truncate"
                      title={item.gig?.postedBy?.name || "N/A"}
                    >
                      {item.gig?.postedBy?.name || "N/A"}
                    </dd>
                  </div>

                  {/* Added Budget Range */}
                  <div>
                    <dt className="font-semibold text-gray-800">
                      Budget Range
                    </dt>
                    <dd className="mt-1">{budgetRange}</dd>
                  </div>

                  {/* Delivery Deadline */}
                  <div>
                    <dt className="font-semibold text-gray-800">Deadline</dt>
                    <dd className="mt-1">{deliveryDeadline}</dd>
                  </div>

                  {/* Remote or Not */}
                  <div className="flex items-center gap-2">
                    <dt className="font-semibold text-gray-800">Remote : </dt>
                    <dd>
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          item.gig?.isRemote
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.gig?.isRemote ? "Yes" : "No"}
                      </span>
                    </dd>
                  </div>

                  {/* Tags */}
                  <div className="col-span-2">
                    <dt className="font-semibold text-gray-800">Tags</dt>
                    <dd className="mt-1 flex flex-wrap gap-2 items-center">
                      {item.gig?.tags?.length > 0 ? (
                        <>
                          {item.gig.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}

                          {item.gig.tags.length > 5 && (
                            <span className="text-gray-600 text-xs font-medium">
                              +{item.gig.tags.length - 5} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">No tags</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {/* Actions */}
                <div className="flex justify-end items-center gap-4 mt-6">
                  {/* View Bid */}
                  <button
                    id={`view-bid-${item._id}`}
                    data-tooltip-content="View Bid Details"
                    onClick={() => {
                      setSelectedBidID(item._id);
                      document
                        .getElementById("View_Gig_Bids_Modal")
                        .showModal();
                    }}
                    className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                    aria-label="View Bid Details"
                  >
                    <img src={GigBids} alt="View Bid" className="w-6" />
                  </button>
                  <Tooltip
                    anchorSelect={`#view-bid-${item._id}`}
                    place="top"
                    className="!text-sm !bg-gray-900 !text-white !py-1 !px-3 !rounded"
                  />

                  {/* Cancel Bid */}
                  <button
                    id={`delete-bid-${item._id}`}
                    data-tooltip-content="Cancel Bid"
                    onClick={() => handleDeleteBid(item._id)}
                    className="flex items-center justify-center w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                    aria-label="Cancel Bid"
                  >
                    <ImCross size={20} />
                  </button>
                  <Tooltip
                    anchorSelect={`#delete-bid-${item._id}`}
                    place="top"
                    className="!text-sm !bg-gray-900 !text-white !py-1 !px-3 !rounded"
                  />

                  {/* Gig Details */}
                  <button
                    id={`gig-details-btn-${item._id}`}
                    data-tooltip-content="View Gig Details"
                    onClick={() => {
                      setSelectedGigID(item.gig?._id);
                      document.getElementById("Gig_Details_Modal").showModal();
                    }}
                    className="flex items-center justify-center w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                    aria-label="View Gig Details"
                  >
                    <FaInfo size={20} />
                  </button>
                  <Tooltip
                    anchorSelect={`#gig-details-btn-${item._id}`}
                    place="top"
                    className="!text-sm !bg-gray-900 !text-white !py-1 !px-3 !rounded"
                  />
                </div>
              </article>
            );
          })
        ) : (
          <div className="text-center col-span-full mt-24 px-6 max-w-xl mx-auto">
            <p className="text-2xl font-medium text-white mb-3">
              No Gig Bids Found
            </p>
            <p className="text-gray-200 font-semibold text-lg mb-5">
              You haven’t placed any bids yet. Browse available gigs and start
              submitting your proposals to get hired.
            </p>
            <Link
              to="/Gigs"
              className="inline-block bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 text-black font-semibold py-3 px-10 shadow-lg hover:shadow-xl rounded transition"
            >
              Explore Gigs
            </Link>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* View Bid Modal */}
      <dialog id="View_Gig_Bids_Modal" className="modal">
        <MyGigBidsModal
          selectedBidID={selectedBidID}
          setSelectedBidID={setSelectedBidID}
        />
      </dialog>

      {/* Gigs Modal */}
      <dialog id="Gig_Details_Modal" className="modal">
        <GigDetailsModal
          selectedGigID={selectedGigID}
          setSelectedGigID={setSelectedGigID}
        />
      </dialog>
    </section>
  );
};

export default MyGigBids;
