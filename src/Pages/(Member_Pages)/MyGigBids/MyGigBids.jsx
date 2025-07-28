import { useEffect, useState } from "react";

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
import GigBids from "../../../assets/Navbar/Member/GigBids.png";

// Modals
import MyGigBidsModal from "./MyGigBidsModal/MyGigBidsModal";
import GigDetailsModal from "../../(Public_Pages)/Home/FeaturedGigs/GigDetailsModal/GigDetailsModal";
import { Link } from "react-router-dom";

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
        return Array.isArray(data) ? data : [data]; // normalize to array
      }),
    enabled: !!user?.email && uniqueGigIds.length > 0,
  });

  useEffect(() => {
    if (GigBidsData.length > 0) {
      setBidsList(GigBidsData);
    }
  }, [GigBidsData]);

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

      {/* Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {mergedData.length > 0 ? (
          mergedData.map((item) => {
            const bidedAgo = formatDistanceToNow(new Date(item.submittedAt), {
              addSuffix: true,
            });

            return (
              <div
                key={item._id}
                className="bg-white border rounded-xl shadow hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between"
              >
                {/* Title & Category */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.gig.title || "Gig not available"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.gig.category} &gt; {item.gig.subCategory}
                  </p>
                </div>

                {/* Bid Info */}
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Bid:</span> ${item.bidAmount}
                  </p>
                  <p>
                    <span className="font-medium">Delivery:</span>{" "}
                    {item.deliveryDays} Days
                  </p>
                  <p>
                    <span className="font-medium">Bided:</span> {bidedAgo}
                  </p>
                  <p>
                    <span className="font-medium">Posted By:</span>{" "}
                    {item.gig?.postedBy?.name || "N/A"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-3">
                  {/* View Bid */}
                  <>
                    <button
                      id={`view-bid-${item?._id}`}
                      data-tooltip-content="View Bid Data"
                      onClick={() => {
                        setSelectedBidID(item?._id);
                        document
                          .getElementById("View_Gig_Bids_Modal")
                          .showModal();
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-shadow shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <img src={GigBids} alt="gig app" className="w-5" />
                    </button>
                    <Tooltip
                      anchorSelect={`#view-bid-${item?._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                    />
                  </>

                  {/* Cancel Bid */}
                  <>
                    <div
                      id={`delete-bid-${item._id}`}
                      data-tooltip-content="Cancel Bid"
                      onClick={() => handleDeleteBid(item._id)}
                      className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-shadow shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <ImCross />
                    </div>
                    <Tooltip
                      anchorSelect={`#delete-bid-${item._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                    />
                  </>

                  {/* Gig Details */}
                  <>
                    <div
                      id={`gig-details-btn-${item?._id}`}
                      data-tooltip-content="View Gig Details"
                      className="flex items-center justify-center w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full transition-shadow shadow-md hover:shadow-lg cursor-pointer"
                      onClick={() => {
                        setSelectedGigID(item?.gig?._id);
                        document
                          .getElementById("Gig_Details_Modal")
                          .showModal();
                      }}
                    >
                      <FaInfo />
                    </div>
                    <Tooltip
                      anchorSelect={`#gig-details-btn-${item?._id}`}
                      place="top"
                      className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                    />
                  </>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center col-span-full mt-20 px-4">
            <p className="text-2xl font-semibold text-white mb-4">
              No Bids Found
            </p>
            <p className="text-lg text-gray-300 mb-6">
              You haven’t placed any bids yet. Browse available gigs and start
              submitting your proposals to get hired.
            </p>
            <Link 
              to={"/Gigs"}
              className="inline-block bg-linear-to-bl hover:bg-linear-to-tl from-white to-gray-300 hover:bg-blue-700 text-black font-semibold py-3 px-10 rounded shadow-md transition cursor-pointer hover:shadow-lg"
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
