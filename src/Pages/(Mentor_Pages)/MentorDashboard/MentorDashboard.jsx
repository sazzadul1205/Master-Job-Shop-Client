import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FiRefreshCw } from "react-icons/fi";
import MyCoursesIcon from "../../../assets/MentorLayoutIcons/MyCoursesIcon";
import MyMentorshipIcon from "../../../assets/MentorLayoutIcons/MyMentorshipIcon";
import ApplicationsIcon from "../../../assets/MentorLayoutIcons/ApplicationsIcon";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Functions
import { safeArray } from "../../../Functions/safeArray";

// Components
import MentorDashboardCards from "./MentorDashboardCards/MentorDashboardCards";
import MentorDashboardGraphs from "./MentorDashboardGraphs/MentorDashboardGraphs";
import MentorDashboardInsights from "./MentorDashboardInsights/MentorDashboardInsights";

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
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(`/Courses?mentorEmail=${user?.email}`);
      return safeArray(res.data);
    },
  });

  // ---------- My Mentorship API ----------
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    refetch: MyMentorshipRefetch,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData"],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(
        `/Mentorship?mentorEmail=${user?.email}`
      );
      return safeArray(res.data);
    },
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
    queryKey: ["MyCoursesStatusData", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(
        `/Courses/Status?mentorEmail=${user?.email}`
      );
      return safeArray(res.data);
    },
  });

  // ---------- My Mentorship Status API ----------
  const {
    data: MyMentorshipStatusData,
    isLoading: MyMentorshipStatusIsLoading,
    refetch: MyMentorshipStatusRefetch,
    error: MyMentorshipStatusError,
  } = useQuery({
    queryKey: ["MyMentorshipStatusData", user?.email],
    queryFn: async () => {
      if (!user?.email) return []; // Return empty array if no email
      const res = await axiosPublic.get(
        `/Mentorship/Status?mentorEmail=${user?.email}`
      );
      return safeArray(res.data); // Always return array
    },
  });

  // ---------- My Courses Applications Status API ----------
  const {
    data: MyCoursesApplicationsStatusData,
    isLoading: MyCoursesApplicationsStatusIsLoading,
    refetch: MyCoursesApplicationsStatusRefetch,
    error: MyCoursesApplicationsStatusError,
  } = useQuery({
    queryKey: ["MyCoursesApplicationsStatusData", allCoursesIds],
    queryFn: async () => {
      if (!allCoursesIds?.length) return [];
      const res = await axiosPublic.get(
        `/CourseApplications/Status?ids=${allCoursesIds}`
      );
      return safeArray(res.data);
    },
    enabled: !!allCoursesIds?.length,
  });

  // ---------- My Mentorship Applications Status API ----------
  const {
    data: MyMentorshipApplicationsStatusData,
    isLoading: MyMentorshipApplicationsStatusIsLoading,
    refetch: MyMentorshipApplicationsStatusRefetch,
    error: MyMentorshipApplicationsStatusError,
  } = useQuery({
    queryKey: ["MyMentorshipApplicationsStatusData", allMentorshipIds],
    queryFn: async () => {
      if (!allMentorshipIds?.length) return [];
      const res = await axiosPublic.get(
        `/MentorshipApplications/Status?ids=${allMentorshipIds}`
      );
      return safeArray(res.data);
    },
    enabled: !!allMentorshipIds?.length,
  });

  // ---------- My Courses Applications API ----------
  const {
    data: MyCoursesApplicationsData,
    isLoading: MyCoursesApplicationsIsLoading,
    refetch: MyCoursesApplicationsRefetch,
    error: MyCoursesApplicationsError,
  } = useQuery({
    queryKey: ["MyCoursesApplications", allCoursesIds],
    queryFn: async () => {
      if (!allCoursesIds) return [];
      const res = await axiosPublic.get(
        `/CourseApplications/ByCourse?courseId=${allCoursesIds}`
      );
      return safeArray(res.data);
    },
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
    queryFn: async () => {
      if (!allMentorshipIds) return [];
      const res = await axiosPublic.get(
        `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds}`
      );
      return safeArray(res.data);
    },
    enabled: !!allMentorshipIds,
  });

  // ---------- My Notifications Status API ----------
  const {
    data: MyNotificationsStatusData,
    isLoading: MyNotificationsStatusIsLoading,
    refetch: MyNotificationsStatusRefetch,
    error: MyNotificationsStatusError,
  } = useQuery({
    queryKey: ["MyNotificationsStatusData", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(
        `/Notifications/Status?mentorEmail=${user?.email}`
      );
      return safeArray(res.data);
    },
  });

  // ---------- My Mentor Emails Status API ----------
  const {
    data: MyMentorEmailsStatusData,
    isLoading: MyMentorEmailsStatusIsLoading,
    refetch: MyMentorEmailsStatusRefetch,
    error: MyMentorEmailsStatusError,
  } = useQuery({
    queryKey: ["MyMentorEmailsStatusData", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(
        `/MentorEmails/Status?email=${user?.email}`
      );
      return safeArray(res.data);
    },
  });

  // ---------- My Mentor Messages Status API ----------
  const {
    data: MyMentorMessagesStatusData,
    isLoading: MyMentorMessagesStatusIsLoading,
    refetch: MyMentorMessagesStatusRefetch,
    error: MyMentorMessagesStatusError,
  } = useQuery({
    queryKey: ["MyMentorMessagesStatusData", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(
        `/MentorMessages/Status?email=${user?.email}`
      );
      return safeArray(res.data);
    },
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
      <div className="flex flex-row  items-center justify-between px-4 sm:px-5 py-4">
        {/* Title */}
        <h3 className="text-xl sm:text-2xl text-black font-bold">
          Mentor Dashboard
        </h3>

        {/* Refresh Button */}
        <button
          onClick={() => handleRefresh()}
          className="flex items-center gap-2 bg-white border border-gray-300 
               hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
               px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
        >
          <FiRefreshCw
            id="refresh-icon"
            className={`w-4 sm:w-5 h-4 sm:h-5 ${isRotating ? "spin" : ""}`}
          />
          <span className="text-sm sm:text-base">Refresh</span>
        </button>
      </div>

      {/* Divider */}
      <p className="bg-gray-500 w-[90%] mx-auto h-[1px] mb-4" />

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

      {/* Insights */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-8 mt-5 pb-20 md:pb-0">
          {/* My Mentorship Button */}
          <button
            onClick={() => navigate("/Mentor/MyMentorship's")}
            className="flex justify-center items-center gap-2 text-gray-700 hover:text-blue-600 transition-all p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg cursor-pointer"
          >
            <MyMentorshipIcon className="w-6 h-6" />
            <span className="text-sm font-medium text-center">
              Manage Courses
            </span>
          </button>

          {/* My Courses Button */}
          <button
            onClick={() => navigate("/Mentor/MyCourses")}
            className="flex justify-center items-center gap-2 text-gray-700 hover:text-blue-600 transition-all p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg cursor-pointer"
          >
            <MyCoursesIcon className="w-6 h-6" />
            <span className="text-sm font-medium text-center">
              Manage Mentorship&apos;s
            </span>
          </button>

          {/* My Mentorship Applications Button */}
          <button
            onClick={() => navigate("/Mentor/MentorshipApplications")}
            className="flex justify-center items-center gap-2 text-gray-700 hover:text-blue-600 transition-all p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg cursor-pointer"
          >
            <ApplicationsIcon className="w-6 h-6" />
            <span className="text-sm font-medium text-center">
              Course Applications
            </span>
          </button>

          {/* My Courses Applications Button */}
          <button
            onClick={() => navigate("/Mentor/CourseApplications")}
            className="flex justify-center items-center gap-2 text-gray-700 hover:text-blue-600 transition-all p-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg cursor-pointer"
          >
            <ApplicationsIcon className="w-6 h-6" />
            <span className="text-sm font-medium text-center">
              Mentorship Applications
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
