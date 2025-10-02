import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import MentorDashboardCards from "./MentorDashboardCards/MentorDashboardCards";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import MentorDashboardGraphs from "./MentorDashboardGraphs/MentorDashboardGraphs";
import MentorDashboardInsights from "./MentorDashboardInsights/MentorDashboardInsights";

const MentorDashboard = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // ---------- My Courses API ----------
  const {
    data: MyCoursesData,
    isLoading: MyCoursesIsLoading,
    refetch: MyCoursesRefetch,
    error: MyCoursesError,
  } = useQuery({
    queryKey: ["MyCoursesData"],
    queryFn: () =>
      axiosPublic.get(`/Courses?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        // Ensure the result is always an array
        return Array.isArray(data) ? data : [data];
      }),
  });

  // ---------- My Mentorship API ----------
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    refetch: MyMentorshipRefetch,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData"],
    queryFn: () =>
      axiosPublic.get(`/Mentorship?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        // Ensure the result is always an array
        return Array.isArray(data) ? data : [data];
      }),
  });

  // Destructuring Courses & Mentorship Ids
  const allCoursesIds = MyCoursesData?.map((item) => item._id);
  const allMentorshipIds = MyMentorshipData?.map((item) => item._id);

  // ---------- My Courses Status API ----------
  const {
    data: MyCoursesStatusData,
    isLoading: MyCoursesStatusIsLoading,
    refetch: MyCoursesStatusRefetch,
    error: MyCoursesStatusError,
  } = useQuery({
    queryKey: ["MyCoursesStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Courses/Status?mentorEmail=${user?.email}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ---------- My Mentorship Status API ----------
  const {
    data: MyMentorshipStatusData,
    isLoading: MyMentorshipStatusIsLoading,
    refetch: MyMentorshipStatusRefetch,
    error: MyMentorshipStatusError,
  } = useQuery({
    queryKey: ["MyMentorshipStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship/Status?mentorEmail=${user?.email}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ---------- My Courses Applications Status API ----------
  const {
    data: MyCoursesApplicationsStatusData,
    isLoading: MyCoursesApplicationsStatusIsLoading,
    refetch: MyCoursesApplicationsStatusRefetch,
    error: MyCoursesApplicationsStatusError,
  } = useQuery({
    queryKey: ["MyCoursesApplicationsStatusData", allCoursesIds],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications/Status?ids=${allCoursesIds}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
    enabled: !!allCoursesIds?.length, // Only run the query if All Courses Ids is not empty
  });

  // ---------- My Mentorship Applications Status API ----------
  const {
    data: MyMentorshipApplicationsStatusData,
    isLoading: MyMentorshipApplicationsStatusIsLoading,
    refetch: MyMentorshipApplicationsStatusRefetch,
    error: MyMentorshipApplicationsStatusError,
  } = useQuery({
    queryKey: ["MyMentorshipApplicationsStatusData", allMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(`/MentorshipApplications/Status?ids=${allMentorshipIds}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
    enabled: !!allMentorshipIds?.length, // Only run the query if All Mentorship Ids is not empty
  });

  // ---------- My Courses Applications API ----------
  const {
    data: MyCoursesApplicationsData,
    isLoading: MyCoursesApplicationsIsLoading,
    refetch: MyCoursesApplicationsRefetch,
    error: MyCoursesApplicationsError,
  } = useQuery({
    queryKey: ["MyCoursesApplications", allCoursesIds],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications/ByCourse?courseId=${allCoursesIds}`)
        .then((res) => {
          const data = res.data;
          return data;
        }),
    enabled: !!allCoursesIds,
  });

  // ---------- My Mentorship Applications API ----------
  const {
    data: MyMentorshipApplicationsData,
    isLoading: MyMentorshipApplicationsIsLoading,
    refetch: MyMentorshipApplicationsRefetch,
    error: MyMentorshipApplicationsError,
  } = useQuery({
    queryKey: ["MyMentorshipApplications", allMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(
          `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds}`
        )
        .then((res) => {
          const data = res.data;
          return data;
        }),
    enabled: !!allMentorshipIds,
  });

  // ---------- My Notifications Status API ----------
  const {
    data: MyNotificationsStatusData,
    isLoading: MyNotificationsStatusIsLoading,
    refetch: MyNotificationsStatusRefetch,
    error: MyNotificationsStatusError,
  } = useQuery({
    queryKey: ["MyNotificationsStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/Notifications/Status?mentorEmail=${user?.email}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ---------- My Mentor Emails Status API ----------
  const {
    data: MyMentorEmailsStatusData,
    isLoading: MyMentorEmailsStatusIsLoading,
    refetch: MyMentorEmailsStatusRefetch,
    error: MyMentorEmailsStatusError,
  } = useQuery({
    queryKey: ["MyMentorEmailsStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/MentorEmails/Status?email=${user?.email}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ---------- My Mentor Messages Status API ----------
  const {
    data: MyMentorMessagesStatusData,
    isLoading: MyMentorMessagesStatusIsLoading,
    refetch: MyMentorMessagesStatusRefetch,
    error: MyMentorMessagesStatusError,
  } = useQuery({
    queryKey: ["MyMentorMessagesStatusData"],
    queryFn: () =>
      axiosPublic
        .get(`/MentorMessages/Status?email=${user?.email}`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // Check for loading state
  if (
    MyCoursesIsLoading ||
    MyMentorshipIsLoading ||
    MyCoursesStatusIsLoading ||
    MyMentorshipStatusIsLoading ||
    MyMentorEmailsStatusIsLoading ||
    MyNotificationsStatusIsLoading ||
    MyCoursesApplicationsIsLoading ||
    MyMentorMessagesStatusIsLoading ||
    MyMentorshipApplicationsIsLoading ||
    MyCoursesApplicationsStatusIsLoading ||
    MyMentorshipApplicationsStatusIsLoading
  )
    return <Loading />;

  // Check for error
  if (
    MyCoursesError ||
    MyMentorshipError ||
    MyCoursesStatusError ||
    MyMentorshipStatusError ||
    MyMentorEmailsStatusError ||
    MyNotificationsStatusError ||
    MyCoursesApplicationsError ||
    MyMentorMessagesStatusError ||
    MyMentorshipApplicationsError ||
    MyCoursesApplicationsStatusError ||
    MyMentorshipApplicationsStatusError
  )
    return <Error />;

  // Refetch All
  const refetchAll = () => {
    MyCoursesRefetch();
    MyMentorshipRefetch();
    MyCoursesStatusRefetch();
    MyMentorEmailsStatusData();
    MyMentorshipStatusRefetch();
    MyNotificationsStatusData();
    MyMentorMessagesStatusData();
    MyMentorEmailsStatusRefetch();
    MyNotificationsStatusRefetch();
    MyCoursesApplicationsRefetch();
    MyMentorMessagesStatusRefetch();
    MyMentorshipApplicationsRefetch();
    MyCoursesApplicationsStatusRefetch();
    MyMentorshipApplicationsStatusRefetch();
  };

  return (
    <div>
      {/* Title */}
      <h3 className="text-2xl text-black font-bold mb-4 px-5 py-5">
        Mentor Dashboard
      </h3>
      {/* Cards */}
      <MentorDashboardCards
        refetchAll={refetchAll}
        MyCoursesStatusData={MyCoursesStatusData}
        MyMentorshipStatusData={MyMentorshipStatusData}
        MyMentorEmailsStatusData={MyMentorEmailsStatusData}
        MyNotificationsStatusData={MyNotificationsStatusData}
        MyMentorMessagesStatusData={MyMentorMessagesStatusData}
        MyCoursesApplicationsStatusData={MyCoursesApplicationsStatusData}
        MyMentorshipApplicationsStatusData={MyMentorshipApplicationsStatusData}
      />

      {/* Graphs */}
      <MentorDashboardGraphs
        MyCoursesApplicationsStatusData={MyCoursesApplicationsStatusData}
        MyMentorshipApplicationsStatusData={MyMentorshipApplicationsStatusData}
      />

      <MentorDashboardInsights
        MyCoursesData={MyCoursesData}
        MyMentorshipData={MyMentorshipData}
        MyCoursesApplicationsData={MyCoursesApplicationsData}
        MyMentorshipApplicationsData={MyMentorshipApplicationsData}
      />
    </div>
  );
};

export default MentorDashboard;
