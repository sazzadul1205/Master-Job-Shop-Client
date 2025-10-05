import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa6";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Components
import CreateCourseModal from "./CreateCourseModal/CreateCourseModal";

// Modals
import MentorMyActiveCourses from "./MentorMyActiveCourses/MentorMyActiveCourses";
import MentorMyArchivedCourses from "./MentorMyArchivedCourses/MentorMyArchivedCourses";
import MentorMyCompletedCourses from "./MentorMyCompletedCourses/MentorMyCompletedCourses";

const MentorMyCourses = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Track active tab
  const [activeTab, setActiveTab] = useState("active");

  // ----------- Fetching Active Course API -----------
  const {
    data: ActiveCoursesData,
    isLoading: ActiveCoursesIsLoading,
    refetch: ActiveCoursesRefetch,
    error: ActiveCoursesError,
  } = useQuery({
    queryKey: ["CoursesData", "active"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Courses?mentorEmail=${user?.email}&status=active,open,closed,onHold&archived=false`
        )
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ----------- Fetching Completed Course API -----------
  const {
    data: CompletedCoursesData,
    isLoading: CompletedCoursesIsLoading,
    refetch: CompletedCoursesRefetch,
    error: CompletedCoursesError,
  } = useQuery({
    queryKey: ["CoursesData", "completed"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Courses?mentorEmail=${user?.email}&status=completed&archived=false`
        )
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ----------- Fetching Archived Course API -----------
  const {
    data: ArchivedCourseData,
    isLoading: ArchivedCourseIsLoading,
    refetch: ArchivedCourseRefetch,
    error: ArchivedCourseError,
  } = useQuery({
    queryKey: ["CourseData", "archived"],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?mentorEmail=${user?.email}&archived=true`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // Refetch All
  const RefetchAll = () => {
    ActiveCoursesRefetch();
    ArchivedCourseRefetch();
    CompletedCoursesRefetch();
  };

  // Tabs Data
  const tabs = [
    { id: "active", label: "Active Courses" },
    { id: "completed", label: "Completed Courses" },
    { id: "archived", label: "Archived Courses" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-8">
        {/* Title */}
        <h3 className="text-2xl text-black font-bold">My Courses</h3>

        {/* Create New Course Button */}
        <button
          onClick={() =>
            document.getElementById("Create_Course_Modal").showModal()
          }
          className="flex items-center gap-4 bg-[#002242] hover:bg-[#00509e] text-white shadow hover:shadow-2xl font-semibold px-5 py-3 rounded-md transition-colors duration-500 cursor-pointer"
        >
          <FaPlus /> Create New Course
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 py-1 px-1 mx-8 bg-gray-200 rounded-md">
        {tabs?.map((tab) => (
          <p
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-center font-semibold py-2 cursor-pointer rounded transition-colors duration-300 ${
              activeTab === tab.id
                ? "bg-white text-gray-800 shadow"
                : "text-black hover:text-gray-800 hover:bg-white"
            }`}
          >
            {tab.label}
          </p>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-8">
        {/* Active Tab Content */}
        {activeTab === "active" && (
          <MentorMyActiveCourses
            error={ActiveCoursesError}
            refetch={ActiveCoursesRefetch}
            CoursesData={ActiveCoursesData}
            isLoading={ActiveCoursesIsLoading}
          />
        )}
        {/* Completed Tab Content */}
        {activeTab === "completed" && (
          <MentorMyCompletedCourses
            refetch={RefetchAll}
            error={CompletedCoursesError}
            CoursesData={CompletedCoursesData}
            isLoading={CompletedCoursesIsLoading}
          />
        )}
        {/* Archived Tab Content */}
        {activeTab === "archived" && (
          <MentorMyArchivedCourses
            refetch={RefetchAll}
            error={ArchivedCourseError}
            isLoading={ArchivedCourseIsLoading}
            CoursesData={ArchivedCourseData}
          />
        )}
      </div>

      {/* Modals */}
      {/* Create Course Modal */}
      <dialog id="Create_Course_Modal" className="modal">
        <CreateCourseModal refetch={RefetchAll} />
      </dialog>
    </div>
  );
};

export default MentorMyCourses;
