// Assets
import { useQuery } from "@tanstack/react-query";
import Bid from "../../../assets/EmployerLayout/Bid/BidBlue.png";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

const ManageGigBids = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

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
        {/* {JobsWithApplicants?.map((job, index) => {})} */}
      </div>
    </>
  );
};

export default ManageGigBids;
