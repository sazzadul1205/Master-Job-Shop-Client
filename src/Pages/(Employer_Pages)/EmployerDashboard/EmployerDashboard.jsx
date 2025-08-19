// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Components
import EmployerDashboardKPI from "./EmployerDashboardKPI/EmployerDashboardKPI";
import EmployerDashboardApplicationOverview from "./EmployerDashboardApplicationOverview/EmployerDashboardApplicationOverview";

const EmployerDashboard = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Daily Gig Status Data
  const {
    data: DailyGigStatusData = [],
    isLoading: DailyGigStatusIsLoading,
    error: DailyGigStatusError,
    refetch: DailyGigStatusRefetch,
  } = useQuery({
    queryKey: ["DailyGigStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Gigs/DailyGigPosted?postedBy=${user.email}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!user?.email,
  });

  // Daily Event Status Data
  const {
    data: DailyEventStatusData = [],
    isLoading: DailyEventStatusIsLoading,
    error: DailyEventStatusError,
    refetch: DailyEventStatusRefetch,
  } = useQuery({
    queryKey: ["DailyEventStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Events/DailyEventsPosted?postedBy=${user.email}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!user?.email,
  });

  // GET Ids
  // Gig Ids Data
  const {
    data: GigIdsData = [],
    isLoading: GigIdsIsLoading,
    error: GigIdsError,
    refetch: GigIdsRefetch,
  } = useQuery({
    queryKey: ["GigIdsData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Gigs/Ids?postedBy=${user.email}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!user?.email,
  });

  // Event Ids Data
  const {
    data: EventIdsData = [],
    isLoading: EventIdsIsLoading,
    error: EventIdsError,
    refetch: EventIdsRefetch,
  } = useQuery({
    queryKey: ["EventIdsData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Events/Ids?postedBy=${user.email}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!user?.email,
  });

  // Daily Event Applications Status Data
  const {
    data: DailyEventApplicationsStatusData = [],
    isLoading: DailyEventApplicationsStatusIsLoading,
    error: DailyEventApplicationsStatusError,
    refetch: DailyEventApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyEventApplicationsStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/EventApplications/DailyEventApplicationsPosted?eventIds=${EventIdsData}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!EventIdsData,
  });

  // Daily Gig Bids Status Data
  const {
    data: DailyGigBidsStatusData = [],
    isLoading: DailyGigBidsStatusIsLoading,
    error: DailyGigBidsStatusError,
    refetch: DailyGigBidsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyGigBidsStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/GigBids/DailyGigBidsPosted?gigIds=${GigIdsData}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!GigIdsData,
  });

  // Daily  Bids data
  const {
    data: DailyBidsStatus = [],
    isLoading: DailyBidsStatusLoading,
    error: DailyBidsStatusError,
    refetch: DailyBidsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyBidsStatus", GigIdsData],
    queryFn: async () => {
      try {
        const cleanIds = GigIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");

        const res = await axiosPublic.get(`/GigBids/DailyStatus`, {
          params: { gigIds: cleanIds },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!GigIdsData?.length,
  });
  // Daily  Applications data
  const {
    data: DailyApplicationsStatus = [],
    isLoading: DailyApplicationsStatusLoading,
    error: DailyApplicationsStatusError,
    refetch: DailyApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyApplicationsStatus", EventIdsData],
    queryFn: async () => {
      try {
        const cleanIds = EventIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");

        const res = await axiosPublic.get(`/EventApplications/DailyStatus`, {
          params: { eventIds: cleanIds },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!EventIdsData?.length,
  });

  console.log("Daily Bids Status :", DailyBidsStatus);
  console.log("Daily Applications Status :", DailyApplicationsStatus);

  // Refetch both datasets
  const refetch = async () => {
    await GigIdsRefetch();
    await EventIdsRefetch();
    await DailyGigStatusRefetch();
    await DailyBidsStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyGigBidsStatusRefetch();
    await DailyApplicationsStatusRefetch();
    await DailyEventApplicationsStatusRefetch();
  };

  // If Loading Show UI
  if (
    loading ||
    GigIdsIsLoading ||
    EventIdsIsLoading ||
    DailyBidsStatusLoading ||
    DailyGigStatusIsLoading ||
    DailyEventStatusIsLoading ||
    DailyGigBidsStatusIsLoading ||
    DailyApplicationsStatusLoading ||
    DailyEventApplicationsStatusIsLoading
  )
    return <Loading />;

  // If Error Show UI
  if (
    GigIdsError ||
    EventIdsError ||
    DailyGigStatusError ||
    DailyBidsStatusError ||
    DailyEventStatusError ||
    DailyGigBidsStatusError ||
    DailyApplicationsStatusError ||
    DailyEventApplicationsStatusError
  )
    return <Error />;

  return (
    <div>
      {/* Employer Dashboard KPI */}
      <EmployerDashboardKPI
        refetch={refetch}
        DailyGigStatusData={DailyGigStatusData}
        DailyEventStatusData={DailyEventStatusData}
        DailyGigBidsStatusData={DailyGigBidsStatusData}
        DailyEventApplicationsStatusData={DailyEventApplicationsStatusData}
      />

      <EmployerDashboardApplicationOverview
        DailyBidsStatus={DailyBidsStatus}
        DailyApplicationsStatus={DailyApplicationsStatus}
      />
    </div>
  );
};

export default EmployerDashboard;