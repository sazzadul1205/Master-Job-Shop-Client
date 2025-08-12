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
        .get(`/Jobs/DailyJobPosted?postedBy=${user?.email}`)
        .then((res) => res.data),
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
        .get(`/Gigs/DailyGigPosted?postedBy=${user?.email}`)
        .then((res) => res.data),
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
        .get(`/Internship/DailyInternshipPosted?postedBy=${user?.email}`)
        .then((res) => res.data),
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
        .get(`/Events/DailyEventsPosted?postedBy=${user?.email}`)
        .then((res) => res.data),
  });

  // Refetch both datasets
  const refetch = async () => {
    await DailyJobStatusRefetch();
    await DailyGigStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyInternshipStatusRefetch();
  };

  // Loading / Error UI
  if (
    DailyJobStatusIsLoading ||
    DailyGigStatusIsLoading ||
    DailyEventStatusIsLoading ||
    DailyInternshipStatusIsLoading ||
    loading
  )
    return <Loading />;
  if (
    DailyJobStatusError ||
    DailyGigStatusError ||
    DailyEventStatusError ||
    DailyInternshipStatusError
  )
    return <Error />;

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
