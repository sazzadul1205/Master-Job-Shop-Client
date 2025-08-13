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
import CompanyDashboardApplicationOverview from "./CompanyDashboardApplicationOverview/CompanyDashboardApplicationOverview";

const CompanyDashboard = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Daily Job Status Data
  const {
    data: DailyJobStatusData,
    isLoading: DailyJobStatusIsLoading,
    error: DailyJobStatusError,
    refetch: DailyJobStatusRefetch,
  } = useQuery({
    queryKey: ["DailyJobStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Jobs/DailyJobPosted?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run when user.email exists
  });

  // Daily Gig Status Data
  const {
    data: DailyGigStatusData,
    isLoading: DailyGigStatusIsLoading,
    error: DailyGigStatusError,
    refetch: DailyGigStatusRefetch,
  } = useQuery({
    queryKey: ["DailyGigStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Gigs/DailyGigPosted?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Daily Internship Status Data
  const {
    data: DailyInternshipStatusData,
    isLoading: DailyInternshipStatusIsLoading,
    error: DailyInternshipStatusError,
    refetch: DailyInternshipStatusRefetch,
  } = useQuery({
    queryKey: ["DailyInternshipStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Internship/DailyInternshipPosted?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Daily Event Status Data
  const {
    data: DailyEventStatusData,
    isLoading: DailyEventStatusIsLoading,
    error: DailyEventStatusError,
    refetch: DailyEventStatusRefetch,
  } = useQuery({
    queryKey: ["DailyEventStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Events/DailyEventsPosted?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Job Ids Data
  const {
    data: JobIdsData,
    isLoading: JobIdsIsLoading,
    error: JobIdsError,
    refetch: JobIdsRefetch,
  } = useQuery({
    queryKey: ["JobIdsData"],
    queryFn: () =>
      axiosPublic
        .get(`/Jobs/Ids?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  console.log(JobIdsData);

  // Gig Ids Data
  const {
    data: GigIdsData,
    isLoading: GigIdsIsLoading,
    error: GigIdsError,
    refetch: GigIdsRefetch,
  } = useQuery({
    queryKey: ["GigIdsData"],
    queryFn: () =>
      axiosPublic
        .get(`/Gigs/Ids?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Internship Ids Data
  const {
    data: InternshipIdsData,
    isLoading: InternshipIdsIsLoading,
    error: InternshipIdsError,
    refetch: InternshipIdsRefetch,
  } = useQuery({
    queryKey: ["InternshipIdsData"],
    queryFn: () =>
      axiosPublic
        .get(`/Internship/Ids?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Event Ids Data
  const {
    data: EventIdsData,
    isLoading: EventIdsIsLoading,
    error: EventIdsError,
    refetch: EventIdsRefetch,
  } = useQuery({
    queryKey: ["EventIdsData"],
    queryFn: () =>
      axiosPublic
        .get(`/Events/Ids?postedBy=${user.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Daily Job Applications data
  const {
    data: DailyJobApplicationsStatus,
    isLoading: DailyJobApplicationsStatusLoading,
    error: DailyJobApplicationsStatusError,
    refetch: DailyJobApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyJobApplicationsStatus", JobIdsData],
    queryFn: () => {
      // Trim each ID and remove any empty values
      const cleanIds = JobIdsData.map((id) => id.trim())
        .filter((id) => id)
        .join(",");

      return axiosPublic
        .get(`/JobApplications/DailyStatus`, { params: { jobIds: cleanIds } })
        .then((res) => res.data);
    },
    enabled: !!JobIdsData?.length,
  });

  // Daily Gig Bids data
  const {
    data: DailyGigBidsStatus,
    isLoading: DailyGigBidsStatusLoading,
    error: DailyGigBidsStatusError,
    refetch: DailyGigBidsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyGigBidsStatus", GigIdsData],
    queryFn: () => {
      const cleanIds = GigIdsData.map((id) => id.trim())
        .filter(Boolean)
        .join(",");
      return axiosPublic
        .get(`/GigBids/DailyStatus`, { params: { gigIds: cleanIds } })
        .then((res) => res.data);
    },
    enabled: !!GigIdsData?.length,
  });

  // Daily Internship Applications data
  const {
    data: DailyInternshipApplicationsStatus,
    isLoading: DailyInternshipApplicationsStatusLoading,
    error: DailyInternshipApplicationsStatusError,
    refetch: DailyInternshipApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyInternshipApplicationsStatus", InternshipIdsData],
    queryFn: () => {
      const cleanIds = InternshipIdsData.map((id) => id.trim())
        .filter(Boolean)
        .join(",");
      return axiosPublic
        .get(`/InternshipApplications/DailyStatus`, {
          params: { internshipIds: cleanIds },
        })
        .then((res) => res.data);
    },
    enabled: !!InternshipIdsData?.length,
  });

  // Daily Event Applications data
  const {
    data: DailyEventApplicationsStatus,
    isLoading: DailyEventApplicationsStatusLoading,
    error: DailyEventApplicationsStatusError,
    refetch: DailyEventApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyEventApplicationsStatus", EventIdsData],
    queryFn: () => {
      const cleanIds = EventIdsData.map((id) => id.trim())
        .filter(Boolean)
        .join(",");
      return axiosPublic
        .get(`/EventApplications/DailyStatus`, {
          params: { eventIds: cleanIds },
        })
        .then((res) => res.data);
    },
    enabled: !!EventIdsData?.length,
  });

  // Refetch both datasets
  const refetch = async () => {
    await JobIdsRefetch();
    await GigIdsRefetch();
    await EventIdsRefetch();
    await InternshipIdsRefetch();
    await DailyJobStatusRefetch();
    await DailyGigStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyGigBidsStatusRefetch();
    await DailyInternshipStatusRefetch();
    await DailyJobApplicationsStatusRefetch();
    await DailyEventApplicationsStatusRefetch();
    await DailyInternshipApplicationsStatusRefetch();
  };

  // If Loading Show UI
  if (
    loading ||
    JobIdsIsLoading ||
    GigIdsIsLoading ||
    EventIdsIsLoading ||
    InternshipIdsIsLoading ||
    DailyJobStatusIsLoading ||
    DailyGigStatusIsLoading ||
    DailyGigBidsStatusLoading ||
    DailyEventStatusIsLoading ||
    DailyInternshipStatusIsLoading ||
    DailyJobApplicationsStatusLoading ||
    DailyEventApplicationsStatusLoading ||
    DailyInternshipApplicationsStatusLoading
  )
    return <Loading />;

  // If Error Show UI
  if (
    JobIdsError ||
    GigIdsError ||
    EventIdsError ||
    InternshipIdsError ||
    DailyJobStatusError ||
    DailyGigStatusError ||
    DailyEventStatusError ||
    DailyGigBidsStatusError ||
    DailyInternshipStatusError ||
    DailyJobApplicationsStatusError ||
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
    </div>
  );
};

export default CompanyDashboard;
