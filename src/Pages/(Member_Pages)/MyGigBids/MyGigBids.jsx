import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { ImCross } from "react-icons/im";

// Assets
import GigBids from "../../../assets/Navbar/Member/GigBids.png";

// Modals
import MyGigBidsModal from "./MyGigBidsModal/MyGigBidsModal";
import Swal from "sweetalert2";

const MyGigBids = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Gigs ID
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
      axiosPublic.get(`/GigBids?email=${user?.email}`).then((res) => res.data),
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
      axiosPublic
        .get(`/Gigs?gigIds=${uniqueGigIds.join(",")}`)
        .then((res) => res.data),
    enabled: !!user?.email && uniqueGigIds.length > 0,
  });

  // Refetch All
  const refetchAll = async () => {
    await refetchGigBids();
    await GigsRefetch();
  };

  // UI Error / Loading
  if (loading || GigBidsIsLoading || GigsIsLoading) return <Loading />;
  if (GigBidsError || GigsError) return <Error />;

  // Merge application & gig data
  const mergedData = GigBidsData.map((application) => {
    const gig = GigsData.find((gig) => gig._id === application.gigId);
    return {
      ...application,
      gig,
    };
  }).filter((item) => item.gig);

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
          // Refetch updated data
          await refetchAll();

          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Bid has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
        // Show detailed error
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

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Gig Bids
      </h3>

      {/* Divider */}
      <p className="bg-white py-[2px] w-1/3 mx-auto" />

      {/* Table */}
      <div className="overflow-x-auto shadow mt-5">
        <table className="min-w-full text-sm text-gray-800">
          {/* Table Header */}
          <thead className="bg-gray-500 border-b text-xs text-white border border-black uppercase tracking-wide cursor-default">
            <tr>
              <th className="px-3 py-4 text-left">Gig Title</th>
              <th className="px-3 py-4 text-left">Category</th>
              <th className="px-3 py-4 text-left">Bid Amount</th>
              <th className="px-3 py-4 text-left">Delivery Days</th>
              <th className="px-3 py-4 text-left">Bided Ago</th>
              <th className="px-3 py-4 text-left">Posted By</th>
              <th className="px-3 py-4 text-left">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {mergedData.length > 0 ? (
              mergedData.map((item) => {
                // Calculate bidedAgo based on submittedAt
                const bidedAgo = formatDistanceToNow(
                  new Date(item.submittedAt),
                  { addSuffix: true }
                );

                return (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    {/* Gig Details */}
                    <td className="px-5 py-4 font-medium">
                      {item.gig.title || "Gig not available"}
                    </td>

                    {/* Category - Subcategory */}
                    <td className="px-5 py-4">
                      {item.gig.category} &gt; {item.gig.subCategory}
                    </td>

                    {/* Bid Amount */}
                    <td className="px-5 py-4">$ {item.bidAmount}</td>

                    {/* Delivery Days */}
                    <td className="px-5 py-4">{item.deliveryDays} Days</td>

                    {/* Bided Ago */}
                    <td className="px-5 py-4">{bidedAgo}</td>

                    {/* Posted By */}
                    <td className="px-5 py-4">
                      {item.gig?.postedBy?.name || "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 flex items-center gap-2">
                      {/* View Bid Button */}
                      <div className="relative">
                        <button
                          id={`view-bid-${item?._id}`}
                          data-tooltip-content="View Bid Data"
                          onClick={() => {
                            setSelectedGigID(item?._id);
                            document
                              .getElementById("View_Gig_Bids_Modal")
                              .showModal();
                          }}
                          className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 transition cursor-pointer"
                        >
                          <img src={GigBids} alt="gig app" className="w-5" />
                        </button>
                        <Tooltip
                          anchorSelect={`#view-bid-${item?._id}`}
                          place="top"
                          className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                        />
                      </div>

                      {/* Delete Application Button */}
                      <div className="relative">
                        <div
                          id={`delete-bid-${item._id}`}
                          data-tooltip-content="Cancel Bid"
                          onClick={() => handleDeleteBid(item._id)}
                          className="p-3 text-lg rounded-full border-2 border-red-500 hover:bg-red-200 cursor-pointer"
                        >
                          <ImCross />
                        </div>
                        <Tooltip
                          anchorSelect={`#delete-bid-${item._id}`}
                          place="top"
                          className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No bids found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="View_Gig_Bids_Modal" className="modal">
        <MyGigBidsModal
          selectedGigID={selectedGigID}
          setSelectedGigID={setSelectedGigID}
        />
      </dialog>
    </section>
  );
};

export default MyGigBids;
