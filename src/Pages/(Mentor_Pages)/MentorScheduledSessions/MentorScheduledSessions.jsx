// Icons
import { FiRefreshCcw } from "react-icons/fi";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Components
import MentorScheduleTable from "./MentorScheduleTable/MentorScheduleTable";
import MentorScheduleCalender from "./MentorScheduleCalender/MentorScheduleCalender";

const MentorScheduledSessions = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // --------- Courses APIs ---------
  const {
    data: MyCoursesData,
    isLoading: MyCoursesIsLoading,
    refetch: MyCoursesRefetch,
    error: MyCoursesError,
  } = useQuery({
    queryKey: ["MyCoursesData"],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?mentorEmail=${user?.email}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  // --------- Mentorship APIs ---------
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    refetch: MyMentorshipRefetch,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData"],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?mentorEmail=${user?.email}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  // Loading State
  if (loading || MyCoursesIsLoading || MyMentorshipIsLoading)
    return <Loading />;

  // Error State
  if (MyCoursesError || MyMentorshipError) return <Error />;

  // Refetch All
  const RefetchAll = () => {
    MyCoursesRefetch();
    MyMentorshipRefetch();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-7 px-9">
        {/* Page Title */}
        <h3 className="text-black text-3xl font-bold">Sessions & Schedule</h3>

        {/* Refresh Button */}
        <button
          onClick={RefetchAll}
          className={`flex items-center gap-2 bg-white border border-gray-300 
                hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
                px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer`}
        >
          <FiRefreshCcw className="w-5 h-5" />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Calendar */}
      <MentorScheduleCalender
        MyCoursesData={MyCoursesData}
        MyMentorshipData={MyMentorshipData}
      />

      {/* Table */}
      <MentorScheduleTable
        MyCoursesData={MyCoursesData}
        MyMentorshipData={MyMentorshipData}
      />
    </div>
  );
};

export default MentorScheduledSessions;
