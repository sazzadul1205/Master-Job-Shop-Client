import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MentorScheduledSessions = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // --------- Courses APIs ---------

  // Fetching Active Courses
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

  // Fetching Active Mentorship
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

  console.log("My Courses Data :", MyCoursesData);
  console.log("My Mentorship Data :", MyMentorshipData);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-7 px-9">
        {/* Page Title */}
        <h3 className="text-black text-3xl font-bold">Sessions & Schedule</h3>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-xl mx-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4">
          {/* Prev Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            title="Previous Month"
          >
            <FaChevronLeft className="text-gray-600 text-lg" />
          </button>

          {/* Month + Today */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              September 2025
            </h3>
            <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
              Today
            </p>
          </div>

          {/* Next Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            title="Next Month"
          >
            <FaChevronRight className="text-gray-600 text-lg" />
          </button>
        </div>

        <p className="bg-gray-600 h-0.5 my-1 mx-8" />
      </div>
    </div>
  );
};

export default MentorScheduledSessions;
