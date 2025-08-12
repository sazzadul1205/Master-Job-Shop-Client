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

  // Refetch both datasets
  const refetch = async () => {
    await JobIdsRefetch();
    await GigIdsRefetch();
    await EventIdsRefetch();
    await InternshipIdsRefetch();
    await DailyJobStatusRefetch();
    await DailyGigStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyInternshipStatusRefetch();
  };

  // Loading / Error UI
  if (
    JobIdsIsLoading ||
    GigIdsIsLoading ||
    EventIdsIsLoading ||
    InternshipIdsIsLoading ||
    DailyJobStatusIsLoading ||
    DailyGigStatusIsLoading ||
    DailyEventStatusIsLoading ||
    DailyInternshipStatusIsLoading ||
    loading
  )
    return <Loading />;
  if (
    JobIdsError ||
    GigIdsError ||
    EventIdsError ||
    InternshipIdsError ||
    DailyJobStatusError ||
    DailyGigStatusError ||
    DailyEventStatusError ||
    DailyInternshipStatusError
  )
    return <Error />;

  console.log("Job Ids Data : - ", JobIdsData);
  console.log("Gig Ids Data : - ", GigIdsData);
  console.log("Event Ids Data : - ", EventIdsData);
  console.log("Internship Ids Data : - ", InternshipIdsData);

  return (
    <div>
      <CompanyDashboardKPI
        refetch={refetch}
        DailyJobStatusData={DailyJobStatusData}
        DailyGigStatusData={DailyGigStatusData}
        DailyEventStatusData={DailyEventStatusData}
        DailyInternshipStatusData={DailyInternshipStatusData}
      />
    </div>
  );
};

export default CompanyDashboard;
