import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

import MentorMenteesCard from "./MentorMenteesCard/MentorMenteesCard";
import { FaSearch } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import MentorMenteesTable from "./MentorMenteesTable/MentorMenteesTable";

// Function to get all course IDs from all applications in MyCoursesData
const getAllCourseIds = (coursesData) => {
  if (!coursesData || typeof coursesData !== "object") return [];

  return Object.values(coursesData)
    .flat()
    .map((app) => app?.courseId)
    .filter(Boolean);
};

// Function to get all mentorship IDs from MyMentorshipData
const getAllMentorshipIds = (mentorshipData) => {
  if (!mentorshipData || typeof mentorshipData !== "object") return [];

  return Object.values(mentorshipData)
    .flat()
    .map((app) => app?.mentorshipId)
    .filter(Boolean);
};

const MentorMentees = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const statusFilter = "Accepted";

  // Fetching Active Courses
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

  // Assuming MyCoursesData is an array of objects
  const allCoursesIds = MyCoursesData?.map((item) => item._id);

  // Active Courses
  const {
    data: MyCoursesApplicationsData,
    isLoading: MyCoursesApplicationsIsLoading,
    refetch: MyCoursesApplicationsRefetch,
    error: MyCoursesApplicationsError,
  } = useQuery({
    queryKey: ["MyCoursesApplications", allCoursesIds, statusFilter],
    queryFn: () =>
      axiosPublic
        .get(
          `/CourseApplications/ByCourse?courseId=${allCoursesIds.join(
            ","
          )}&status=${statusFilter}`
        )
        .then((res) => res.data),
    enabled: allCoursesIds?.length > 0,
  });

  // Fetching Active Mentorship
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

  // Assuming MyMentorshipData is an array of objects
  const allMentorshipIds = MyMentorshipData?.map((item) => item._id);

  // Active Mentorship
  const {
    data: MyMentorshipApplicationsData,
    isLoading: MyMentorshipApplicationsIsLoading,
    refetch: MyMentorshipApplicationsRefetch,
    error: MyMentorshipApplicationsError,
  } = useQuery({
    queryKey: ["MyMentorshipApplications", allMentorshipIds, statusFilter],
    queryFn: () =>
      axiosPublic
        .get(
          `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds.join(
            ","
          )}&status=${statusFilter}`
        )
        .then((res) => res.data),
    enabled: allMentorshipIds?.length > 0,
  });

  const MyCourseIds = getAllCourseIds(MyCoursesApplicationsData);
  const MyMentorshipIds = getAllMentorshipIds(MyMentorshipApplicationsData);

  // Fetching Course Titles
  const {
    data: MyCourseTitles,
    isLoading: MyCourseTitlesIsLoading,
    refetch: MyCourseTitlesRefetch,
    error: MyCourseTitlesError,
  } = useQuery({
    queryKey: ["MyCourseTitles", MyCourseIds],
    queryFn: () =>
      axiosPublic
        .get(`/Courses/Title?ids=${JSON.stringify(MyCourseIds)}`)
        .then((res) => res.data),
    enabled: MyCourseIds?.length > 0,
  });

  // Fetching Mentorship Titles
  const {
    data: MyMentorshipTitles,
    isLoading: MyMentorshipTitlesIsLoading,
    refetch: MyMentorshipTitlesRefetch,
    error: MyMentorshipTitlesError,
  } = useQuery({
    queryKey: ["MyMentorshipTitles", MyMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship/Title?ids=${JSON.stringify(MyMentorshipIds)}`)
        .then((res) => res.data),
    enabled: MyMentorshipIds?.length > 0,
  });

  // Check for loading state
  if (
    loading ||
    MyCoursesIsLoading ||
    MyCourseTitlesError ||
    MyMentorshipIsLoading ||
    MyMentorshipTitlesError ||
    MyCoursesApplicationsIsLoading ||
    MyMentorshipApplicationsIsLoading
  )
    return <Loading />;

  // Check for error
  if (
    MyCoursesError ||
    MyMentorshipError ||
    MyCourseTitlesIsLoading ||
    MyCoursesApplicationsError ||
    MyMentorshipTitlesIsLoading ||
    MyMentorshipApplicationsError
  )
    return <Error />;

  // Refetch All
  const refetchAll = () => {
    MyCoursesRefetch();
    MyMentorshipRefetch();
    MyCourseTitlesRefetch();
    MyMentorshipTitlesRefetch();
    MyCoursesApplicationsRefetch();
    MyMentorshipApplicationsRefetch();
  };

  console.log("My Course Title :", MyCourseTitles);
  console.log("My Mentorship Title :", MyMentorshipTitles);

  // Flatten Course Applications
  const courseApplications = MyCoursesApplicationsData
    ? Object.values(MyCoursesApplicationsData).flat()
    : [];

  // Flatten Mentorship Applications
  const mentorshipApplications = MyMentorshipApplicationsData
    ? Object.values(MyMentorshipApplicationsData).flat()
    : [];

  return (
    <div>
      {/* Header */}
      <h3 className="text-black text-3xl font-bold py-7 px-9">
        All Mentors Mentees
      </h3>

      {/* Cards */}
      <MentorMenteesCard
        refetchAll={refetchAll}
        courseApplications={courseApplications}
        mentorshipApplications={mentorshipApplications}
      />

      {/* Filter */}
      <div className="mx-7 my-9">
        <div className="w-full flex flex-wrap items-center gap-4 rounded-xl bg-white border border-gray-300 p-5 shadow-sm">
          {/* Search By Mentees Name */}
          <div className="relative flex-1 min-w-[220px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              required
              placeholder="Search by Mentees Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500placeholder-gray-400 text-sm text-black transition duration-200"
            />
          </div>

          {/* Search By Course / Mentorship Name */}
          <div className="relative flex-1 min-w-[220px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              required
              placeholder="Search by Course / Mentorship Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-sm text-black transition duration-200"
            />
          </div>

          {/* Dropdown Filter */}
          <select
            name="filter"
            id="filter"
            className="min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          >
            <option value="">Select Option</option>
            <option value="courses">Courses</option>
            <option value="mentorship">Mentorship</option>
          </select>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 border border-blue-600 text-sm text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              <FaRegMessage className="text-base" />
              <span>Bulk Message</span>
              <span className="opacity-80">(None)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <MentorMenteesTable
        refetchAll={refetchAll}
        courseApplications={courseApplications}
        mentorshipApplications={mentorshipApplications}
      />
    </div>
  );
};

export default MentorMentees;
