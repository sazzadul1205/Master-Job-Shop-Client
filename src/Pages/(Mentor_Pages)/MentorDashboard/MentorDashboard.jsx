import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import MentorDashboardCards from "./MentorDashboardCards/MentorDashboardCards";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import MentorDashboardGraphs from "./MentorDashboardGraphs/MentorDashboardGraphs";
import MentorDashboardInsights from "./MentorDashboardInsights/MentorDashboardInsights";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import MyMentorshipIcon from "../../../assets/MentorLayoutIcons/MyMentorshipIcon";
import MyCoursesIcon from "../../../assets/MentorLayoutIcons/MyCoursesIcon";
import ApplicationsIcon from "../../../assets/MentorLayoutIcons/ApplicationsIcon";
import { useNavigate } from "react-router-dom";

const MentorDashboard = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Navigation
  const navigate = useNavigate();

  // Rotating Loader
  const [isRotating, setIsRotating] = useState(false);

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

  const refetchAll = async () => {
    await Promise.all([
      MyCoursesRefetch(),
      MyMentorshipRefetch(),
      MyCoursesStatusRefetch(),
      MyMentorshipStatusRefetch(),
      MyMentorEmailsStatusRefetch(),
      MyNotificationsStatusRefetch(),
      MyMentorMessagesStatusRefetch(),
      MyCoursesApplicationsRefetch(),
      MyMentorshipApplicationsRefetch(),
      MyCoursesApplicationsStatusRefetch(),
      MyMentorshipApplicationsStatusRefetch(),
    ]);
  };

  const handleRefresh = async () => {
    setIsRotating(true); // start spinning
    try {
      await refetchAll(); // wait until all Refetch complete
    } catch (err) {
      console.error("Error refetching data:", err);
    } finally {
      // keep spin class for full duration (3.5s) then stop
      setTimeout(() => setIsRotating(false), 3500);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-5 py-5">
        {/* Title */}
        <h3 className="text-2xl text-black font-bold">Mentor Dashboard</h3>

        {/* Refresh Button */}
        <button
          onClick={() => handleRefresh()}
          className="flex items-center gap-2 bg-white border border-gray-300 
                 hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
                 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
        >
          <FiRefreshCw
            id="refresh-icon"
            className={`w-5 h-5 ${isRotating ? "spin" : ""}`}
          />
          Refresh
        </button>
      </div>

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

      {/* Quick Access Links */}
      <div className="pb-5">
        {/* Title */}
        <h3 className="text-2xl text-black text-center font-bold py-3 px-5">
          -- Quick Access Links --
        </h3>

        {/* Manage Buttons Row */}
        <div className="flex justify-around gap-4 my-5">
          {/* My Mentorship Button */}
          <button
            onClick={() => navigate("/Mentor/MyMentorship's")}
            className="flex w-[330px] justify-center items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-2xl cursor-pointer"
          >
            <MyMentorshipIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Manage Courses</span>
          </button>

          {/* My Courses Button */}
          <button
            onClick={() => navigate("/Mentor/MyCourses")}
            className="flex w-[330px] justify-center items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-2xl cursor-pointer"
          >
            <MyCoursesIcon className="w-6 h-6" />
            <span className="text-sm font-medium">
              Manage Mentorship&apos;s
            </span>
          </button>

          {/* My Mentorship Applications Button */}
          <button
            onClick={() => navigate("/Mentor/MentorshipApplications")}
            className="flex w-[330px] justify-center items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-2xl cursor-pointer"
          >
            <ApplicationsIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Course Applications</span>
          </button>

          {/* My Courses Applications Button */}
          <button
            onClick={() => navigate("/Mentor/CourseApplications")}
            className="flex w-[330px] justify-center items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-2xl cursor-pointer"
          >
            <ApplicationsIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Mentorship Applications</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
