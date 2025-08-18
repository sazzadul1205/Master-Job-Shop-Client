import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import EmployerDashboardKPI from "./EmployerDashboardKPI/EmployerDashboardKPI";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";


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

  // Daily Event Status Data
  const {
    data: DailyEventApplicationsStatusData = [],
    isLoading: DailyEventApplicationsStatusIsLoading,
    error: DailyEventApplicationsStatusError,
    refetch: DailyEventApplicationsStatusRefetch,
  } = useQuery({
    queryKey: ["DailyEventApplicationsStatusData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/eventApplications/DailyEventApplicationsPosted?eventIds=${EventIdsData}`);
        return res.data || [];
      } catch (error) {
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!user?.email,
  });

  console.log("Daily Event Applications Status Data :", DailyEventApplicationsStatusData);
  // console.log("Event Ids Data :", EventIdsData);

  // Refetch both datasets
  const refetch = async () => {
    await GigIdsRefetch();
    await EventIdsRefetch();
    await DailyGigStatusRefetch();
    await DailyEventStatusRefetch();
    await DailyEventApplicationsStatusRefetch();
  };

  // If Loading Show UI
  if (
    loading ||
    GigIdsIsLoading ||
    EventIdsIsLoading ||
    DailyGigStatusIsLoading ||
    DailyEventStatusIsLoading ||
    DailyEventApplicationsStatusIsLoading)
    return <Loading />;

  // If Error Show UI
  if (
    GigIdsError ||
    EventIdsError ||
    DailyGigStatusError ||
    DailyEventStatusError ||
    DailyEventApplicationsStatusError)
    return <Error />;

  return (
    <div>
      {/* Employer Dashboard KPI */}
      <EmployerDashboardKPI
        refetch={refetch}
        DailyGigStatusData={DailyGigStatusData}
        DailyEventStatusData={DailyEventStatusData}

      />


    </div>
  );
};

export default EmployerDashboard;