// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Components
import CompanyDashboardKPI from "./CompanyDashboardKPI/CompanyDashboardKPI";
import CompanyDashboardQuickAction from "./CompanyDashboardQuickAction/CompanyDashboardQuickAction";
import CompanyDashboardRecentApplicant from "./CompanyDashboardRecentApplicant/CompanyDashboardRecentApplicant";
import CompanyDashboardUpcomingDeadline from "./CompanyDashboardUpcomingDeadline/CompanyDashboardUpcomingDeadline";
import CompanyDashboardApplicationOverview from "./CompanyDashboardApplicationOverview/CompanyDashboardApplicationOverview";

const CompanyDashboard = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Daily Status Data - Jobs, Gigs, Events, Internship
  // Daily Job Status Data
  const {
    data: DailyJobStatusData = [],
    isLoading: DailyJobStatusIsLoading,
    error: DailyJobStatusError,
    refetch: DailyJobStatusRefetch,
  } = useQuery({
    queryKey: ["DailyJobStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Jobs/DailyJobPosted?postedBy=${user.email}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!user?.email,
  });

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

  // Daily Internship Status Data
  const {
    data: DailyInternshipStatusData = [],
    isLoading: DailyInternshipStatusIsLoading,
    error: DailyInternshipStatusError,
    refetch: DailyInternshipStatusRefetch,
  } = useQuery({
    queryKey: ["DailyInternshipStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Internship/DailyInternshipPosted?postedBy=${user.email}`);
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


  // GET Ids Data - Jobs, Gigs, Events, Internship
  // Job Ids Data
  const {
    data: JobIdsData = [],
    isLoading: JobIdsIsLoading,
    error: JobIdsError,
    refetch: JobIdsRefetch,
  } = useQuery({
    queryKey: ["JobIdsData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Jobs/Ids?postedBy=${user.email}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return []; // 👈 fallback to empty array
        throw error;
      }
    },
    enabled: !!user?.email,
  });

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

  // Internship Ids Data
  const {
    data: InternshipIdsData = [],
    isLoading: InternshipIdsIsLoading,
    error: InternshipIdsError,
    refetch: InternshipIdsRefetch,
  } = useQuery({
    queryKey: ["InternshipIdsData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Internship/Ids?postedBy=${user.email}`);
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


  // Fetch Applications / Bids Status - Jobs, Gigs, Events, Internship
  // Daily Job Applications data
  const {
    data: DailyJobApplicationsStatus = [],
    isLoading: DailyJobApplicationsStatusLoading,
    error: DailyJobApplicationsStatusError,
    refetch: DailyJobApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyJobApplicationsStatus", JobIdsData],
    queryFn: async () => {
      try {
        const cleanIds = JobIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");

        const res = await axiosPublic.get(`/JobApplications/DailyStatus`, {
          params: { jobIds: cleanIds },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!JobIdsData?.length,
  });

  // Daily Gig Bids data
  const {
    data: DailyGigBidsStatus = [],
    isLoading: DailyGigBidsStatusLoading,
    error: DailyGigBidsStatusError,
    refetch: DailyGigBidsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyGigBidsStatus", GigIdsData],
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

  // Daily Internship Applications data
  const {
    data: DailyInternshipApplicationsStatus = [],
    isLoading: DailyInternshipApplicationsStatusLoading,
    error: DailyInternshipApplicationsStatusError,
    refetch: DailyInternshipApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyInternshipApplicationsStatus", InternshipIdsData],
    queryFn: async () => {
      try {
        const cleanIds = InternshipIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");

        const res = await axiosPublic.get(`/InternshipApplications/DailyStatus`, {
          params: { internshipIds: cleanIds },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!InternshipIdsData?.length,
  });

  // Daily Event Applications data
  const {
    data: DailyEventApplicationsStatus = [],
    isLoading: DailyEventApplicationsStatusLoading,
    error: DailyEventApplicationsStatusError,
    refetch: DailyEventApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyEventApplicationsStatus", EventIdsData],
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


  // Fetch Latest Applications - Jobs, Gigs, Events, Internship
  // Fetch Latest Job Applications
  const {
    data: LatestJobApplications = [],
    isLoading: LatestJobApplicationsLoading,
    error: LatestJobApplicationsError,
    refetch: LatestJobApplicationsRefetch,
  } = useQuery({
    queryKey: ["LatestJobApplications", JobIdsData],
    queryFn: async () => {
      try {
        const cleanIds = JobIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");
        const limit = 5;

        const res = await axiosPublic.get(`/JobApplications/LatestApplications`, {
          params: { jobIds: cleanIds, limit },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!JobIdsData?.length,
  });

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

  // Fetch Latest Internship Applications
  const {
    data: LatestInternshipApplications = [],
    isLoading: LatestInternshipApplicationsLoading,
    error: LatestInternshipApplicationsError,
    refetch: LatestInternshipApplicationsRefetch,
  } = useQuery({
    queryKey: ["LatestInternshipApplications", InternshipIdsData],
    queryFn: async () => {
      try {
        const cleanIds = InternshipIdsData.map((id) => id.trim())
          .filter(Boolean)
          .join(",");
        const limit = 5;

        const res = await axiosPublic.get(
          `/InternshipApplications/LatestApplications`,
          { params: { internshipIds: cleanIds, limit } }
        );
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!InternshipIdsData?.length,
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


  // Fetch Deadline Data - Jobs, Gigs, Events, Internship
  // Jobs Deadline
  const {
    data: JobDeadline = [],
    isLoading: JobDeadlineLoading,
    error: JobDeadlineError,
    refetch: JobDeadlineRefetch,
  } = useQuery({
    queryKey: ["JobDeadline", JobIdsData],
    queryFn: async () => {
      try {
        const cleanIds = JobIdsData.map((id) => id.trim()).filter(Boolean).join(",");
        const res = await axiosPublic.get(`/Jobs/Deadline`, {
          params: { jobIds: cleanIds, limit: 5 },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!JobIdsData?.length,
  });

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

  // Internship Deadline
  const {
    data: InternshipDeadline = [],
    isLoading: InternshipDeadlineLoading,
    error: InternshipDeadlineError,
    refetch: InternshipDeadlineRefetch,
  } = useQuery({
    queryKey: ["InternshipDeadline", InternshipIdsData],
    queryFn: async () => {
      try {
        const cleanIds = InternshipIdsData.map((id) => id.trim()).filter(Boolean).join(",");
        const res = await axiosPublic.get(`/Internship/Deadline`, {
          params: { internshipIds: cleanIds, limit: 5 },
        });
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        return [];
      }
    },
    enabled: !!InternshipIdsData?.length,
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
    await JobIdsRefetch();
    await GigIdsRefetch();
    await EventIdsRefetch();
    await JobDeadlineRefetch();
    await GigDeadlineRefetch();
    await LatestGigBidsRefetch();
    await InternshipIdsRefetch();
    await EventsDeadlineRefetch();
    await DailyJobStatusRefetch();
    await DailyGigStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyGigBidsStatusRefetch();
    await InternshipDeadlineRefetch();
    await DailyInternshipStatusRefetch();
    await LatestJobApplicationsRefetch();
    await LatestEventApplicationsRefetch();
    await DailyJobApplicationsStatusRefetch();
    await DailyEventApplicationsStatusRefetch();
    await LatestInternshipApplicationsRefetch();
    await DailyInternshipApplicationsStatusRefetch();
  };

  // If Loading Show UI
  if (
    loading ||
    JobIdsIsLoading ||
    GigIdsIsLoading ||
    EventIdsIsLoading ||
    JobDeadlineLoading ||
    GigDeadlineLoading ||
    LatestGigBidsLoading ||
    EventsDeadlineLoading ||
    InternshipIdsIsLoading ||
    DailyJobStatusIsLoading ||
    DailyGigStatusIsLoading ||
    InternshipDeadlineLoading ||
    DailyGigBidsStatusLoading ||
    DailyEventStatusIsLoading ||
    LatestJobApplicationsLoading ||
    DailyInternshipStatusIsLoading ||
    LatestEventApplicationsLoading ||
    DailyJobApplicationsStatusLoading ||
    LatestInternshipApplicationsLoading ||
    DailyEventApplicationsStatusLoading ||
    DailyInternshipApplicationsStatusLoading
  )
    return <Loading />;

  // If Error Show UI
  if (
    JobIdsError ||
    GigIdsError ||
    EventIdsError ||
    JobDeadlineError ||
    GigDeadlineError ||
    InternshipIdsError ||
    LatestGigBidsError ||
    EventsDeadlineError ||
    DailyJobStatusError ||
    DailyGigStatusError ||
    DailyEventStatusError ||
    InternshipDeadlineError ||
    DailyGigBidsStatusError ||
    LatestJobApplicationsError ||
    DailyInternshipStatusError ||
    LatestEventApplicationsError ||
    DailyJobApplicationsStatusError ||
    LatestInternshipApplicationsError ||
    DailyEventApplicationsStatusError ||
    DailyInternshipApplicationsStatusError
  )
    return <Error />;

  return (
    <div>
      {/* Company Dashboard KPI */}
      <CompanyDashboardKPI
        refetch={refetch}
        DailyJobStatusData={DailyJobStatusData}
        DailyGigStatusData={DailyGigStatusData}
        DailyEventStatusData={DailyEventStatusData}
        DailyInternshipStatusData={DailyInternshipStatusData}
      />

      {/* Company Dashboard Application Overview */}
      <CompanyDashboardApplicationOverview
        DailyGigBidsStatus={DailyGigBidsStatus}
        DailyJobApplicationsStatus={DailyJobApplicationsStatus}
        DailyEventApplicationsStatus={DailyEventApplicationsStatus}
        DailyInternshipApplicationsStatus={DailyInternshipApplicationsStatus}
      />

      {/* Activity & Deadlines */}
      <div className="px-5 py-6">
        {/* Title */}
        <h3 className="text-lg text-black font-bold">Activity & Deadlines</h3>

        {/* Content */}
        <div className="flex gap-2 items-stretch pt-3">
          {/* Recent Applicants */}
          <div className="w-1/2 bg-white border border-gray-300 rounded-lg py-5 px-5">
            <CompanyDashboardRecentApplicant
              LatestGigBids={LatestGigBids}
              LatestJobApplications={LatestJobApplications}
              LatestEventApplications={LatestEventApplications}
              LatestInternshipApplications={LatestInternshipApplications}
            />
          </div>

          {/* Upcoming Deadline */}
          <div className="w-1/2 bg-white border border-gray-300 rounded-lg py-5 px-5">
            <CompanyDashboardUpcomingDeadline
              JobDeadline={JobDeadline}
              GigDeadline={GigDeadline}
              EventsDeadline={EventsDeadline}
              InternshipDeadline={InternshipDeadline}
            />
          </div>
        </div>
      </div>

      <CompanyDashboardQuickAction />
    </div>
  );
};

export default CompanyDashboard;
