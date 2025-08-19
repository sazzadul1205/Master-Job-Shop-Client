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
import EmployerDashboardRecentApplicant from "./EmployerDashboardRecentApplicant/EmployerDashboardRecentApplicant";
import EmployerDashboardUpcomingDeadline from "./EmployerDashboardUpcomingDeadline/EmployerDashboardUpcomingDeadline";

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

  // Daily Data
  // Daily Bids data
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

  // Daily Applications data
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


  // Fetch Latest Applications
  // Fetch Latest Gig Bids
  const {
    data: LatestGigBids = [],
    isLoading: LatestGigBidsLoading,
    error: LatestGigBidsError,
    refetch: LatestGigBidsRefetch,
  } = useQuery({
    queryKey: ["LatestGigBids", GigIdsData],
    queryFn: async () => {
      try {
        const cleanIds = GigIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");
        const limit = 5;

        const res = await axiosPublic.get(`/GigBids/LatestBids`, {
          params: { gigIds: cleanIds, limit },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!GigIdsData?.length,
  });

  // Fetch Latest Event Applications
  const {
    data: LatestEventApplications = [],
    isLoading: LatestEventApplicationsLoading,
    error: LatestEventApplicationsError,
    refetch: LatestEventApplicationsRefetch,
  } = useQuery({
    queryKey: ["LatestEventApplications", EventIdsData],
    queryFn: async () => {
      try {
        const cleanIds = EventIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");
        const limit = 5;

        const res = await axiosPublic.get(
          `/EventApplications/LatestApplications`,
          { params: { eventIds: cleanIds, limit } }
        );
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!EventIdsData?.length,
  });

  // Deadline's
  // Gigs Deadline
  const {
    data: GigDeadline = [],
    isLoading: GigDeadlineLoading,
    error: GigDeadlineError,
    refetch: GigDeadlineRefetch,
  } = useQuery({
    queryKey: ["GigDeadline", GigIdsData],
    queryFn: async () => {
      try {
        const cleanIds = GigIdsData.map((id) => id.trim()).filter(Boolean).join(",");
        const res = await axiosPublic.get(`/Gigs/Deadline`, {
          params: { gigIds: cleanIds, limit: 5 },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!GigIdsData?.length,
  });
  // Events Deadline
  const {
    data: EventsDeadline = [],
    isLoading: EventsDeadlineLoading,
    error: EventsDeadlineError,
    refetch: EventsDeadlineRefetch,
  } = useQuery({
    queryKey: ["EventsDeadline", EventIdsData],
    queryFn: async () => {
      try {
        const cleanIds = EventIdsData.map((id) => id.trim()).filter(Boolean).join(",");
        const res = await axiosPublic.get(`/Events/Deadline`, {
          params: { eventIds: cleanIds, limit: 5 },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!EventIdsData?.length,
  });

  // Refetch both datasets
  const refetch = async () => {
    await GigIdsRefetch();
    await EventIdsRefetch();
    await GigDeadlineRefetch();
    await LatestGigBidsRefetch();
    await DailyGigStatusRefetch();
    await EventsDeadlineRefetch();
    await DailyBidsStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyGigBidsStatusRefetch();
    await LatestEventApplicationsRefetch();
    await DailyApplicationsStatusRefetch();
    await DailyEventApplicationsStatusRefetch();
  };

  // If Loading Show UI
  if (
    loading ||
    GigIdsIsLoading ||
    EventIdsIsLoading ||
    GigDeadlineLoading ||
    LatestGigBidsLoading ||
    EventsDeadlineLoading ||
    DailyBidsStatusLoading ||
    DailyGigStatusIsLoading ||
    DailyEventStatusIsLoading ||
    DailyGigBidsStatusIsLoading ||
    DailyApplicationsStatusLoading ||
    LatestEventApplicationsLoading ||
    DailyEventApplicationsStatusIsLoading
  )
    return <Loading />;

  // If Error Show UI
  if (
    GigIdsError ||
    EventIdsError ||
    GigDeadlineError ||
    LatestGigBidsError ||
    DailyGigStatusError ||
    EventsDeadlineError ||
    DailyBidsStatusError ||
    DailyEventStatusError ||
    DailyGigBidsStatusError ||
    LatestEventApplicationsError ||
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

      {/* Activity & Deadlines */}
      <div className="px-5 py-6">
        {/* Title */}
        <h3 className="text-lg text-black font-bold">Activity & Deadlines</h3>

        {/* Content */}
        <div className="flex gap-2 items-stretch pt-3">
          {/* Recent Applicants */}
          <div className="w-1/2 bg-white border border-gray-300 rounded-lg py-5 px-5">
            <EmployerDashboardRecentApplicant
              LatestGigBids={LatestGigBids}
              LatestEventApplications={LatestEventApplications}
            />
          </div>

          {/* Upcoming Deadline */}
          <div className="w-1/2 bg-white border border-gray-300 rounded-lg py-5 px-5">
            <EmployerDashboardUpcomingDeadline
              GigDeadline={GigDeadline}
              EventsDeadline={EventsDeadline}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;