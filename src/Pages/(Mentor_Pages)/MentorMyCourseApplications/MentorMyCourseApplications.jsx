import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import { IoSearchSharp } from "react-icons/io5";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import ApplicantInformationModal from "../../../Shared/ApplicantInformationModal/ApplicantInformationModal";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Component
import MyCourseApplicationsTable from "./MyCourseApplicationsTable/MyCourseApplicationsTable";
import MyCourseApplicationsModal from "../../(Member_Pages)/MyCourseApplications/MyCourseApplicationsModal/MyCourseApplicationsModal";

const MentorMyCourseApplications = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [selectedApplicantName, setSelectedApplicantName] = useState("");
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // States Variables
  const [pageMap, setPageMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Fetching Active Courses
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

  // Merge Courses with applications
  const mergedCourses =
    MyCoursesData?.map((course) => {
      return {
        ...course,
        applications: MyCoursesApplicationsData?.[course._id] || [],
      };
    }) || [];

  // Filter by search term (course title)
  const filteredCourse = mergedCourses.filter((course) => {
    const titleMatch = course.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    let statusMatch = true;

    if (statusFilter !== "all") {
      if (statusFilter === "closed") {
        // "closed" should match both "closed" and "active"
        statusMatch =
          course.status?.toLowerCase() === "closed" ||
          course.status?.toLowerCase() === "active";
      } else {
        statusMatch =
          course.status?.toLowerCase() === statusFilter.toLowerCase();
      }
    }

    return titleMatch && statusMatch;
  });

  // Page management
  const handlePageChange = (courseId, newPage) => {
    setPageMap((prev) => ({ ...prev, [courseId]: newPage }));
  };

  // Check for loading state
  if (MyCoursesIsLoading || MyCoursesApplicationsIsLoading) return <Loading />;

  // Check for error
  if (MyCoursesError || MyCoursesApplicationsError) return <Error />;

  // Refetch All
  const refetchAll = () => {
    MyCoursesRefetch();
    MyCoursesApplicationsRefetch();
  };

  return (
    <div className="py-7 px-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        {/* Title */}
        <h3 className="font-bold text-3xl text-gray-700">
          Course Applications Management
        </h3>
      </div>

      {/* Filters */}
      <div className="pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchSharp className="w-5 h-5 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search mentorship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="statusFilter"
            className="text-sm font-semibold text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
            <option value="onhold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Container for Course Applications */}
      <div className="my-6 space-y-6">
        {filteredCourse && filteredCourse.length > 0 ? (
          filteredCourse.map((course) => (
            <MyCourseApplicationsTable
              course={course}
              pageMap={pageMap}
              key={course?._id}
              refetchAll={refetchAll}
              handlePageChange={handlePageChange}
              setSelectedApplicantName={setSelectedApplicantName}
              setSelectedApplicationID={setSelectedApplicationID}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-md border border-gray-200">
            {/* Red Cross Icon */}
            <div className="text-red-500 bg-red-100 p-7 mb-4 rounded-full">
              <ImCross className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">
              No Courses or Applications Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* Course Application Modal */}
      <dialog id="View_Course_Application_Modal" className="modal">
        <MyCourseApplicationsModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* View Applicant Profile Modal */}
      <dialog id="View_Applicant_Profile_Modal" className="modal">
        <ApplicantInformationModal
          selectedApplicantName={selectedApplicantName}
          setSelectedApplicantName={setSelectedApplicantName}
        />
      </dialog>
    </div>
  );
};

export default MentorMyCourseApplications;
