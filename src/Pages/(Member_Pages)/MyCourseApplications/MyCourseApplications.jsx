import { useEffect, useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { FaInfo } from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import Courses from "../../../assets/Navbar/Member/Courses.png";

// Modals
import MyCourseApplicationsModal from "./MyCourseApplicationsModal/MyCourseApplicationsModal";
import CourseDetailsModal from "../../(Public_Pages)/Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";
import { Link } from "react-router-dom";

const MyCourseApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Courses ID
  const [applicationsList, setApplicationsList] = useState([]);
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // Step 1: Fetch Courses Bids
  const {
    data: CourseApplicationsData = [],
    isLoading: CourseApplicationsIsLoading,
    error: CourseApplicationsError,
    refetch: refetchCourseApplications,
  } = useQuery({
    queryKey: ["CourseApplicationsData"],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications?email=${user?.email}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique CourseIds
  const courseIds = CourseApplicationsData.map((app) => app.courseId);
  const uniqueCourseIds = [...new Set(courseIds)];

  // Step 3: Fetch Courses Data
  const {
    data: CoursesData = [],
    isLoading: CoursesIsLoading,
    error: CoursesError,
    refetch: CoursesRefetch,
  } = useQuery({
    queryKey: ["CoursesData", uniqueCourseIds],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?eventIds=${uniqueCourseIds.join(",")}`)
        .then((res) => {
          const data = res.data;
          return Array.isArray(data) ? data : [data]; // normalize to array
        }),
    enabled: !!user?.email && uniqueCourseIds.length > 0,
  });

  // Sync fetched data to local state
  useEffect(() => {
    if (CourseApplicationsData.length > 0) {
      setApplicationsList(CourseApplicationsData);
    }
  }, [CourseApplicationsData]);

  // Delete Application Handler
  const handleDeleteCourseApplication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the Course Application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/CourseApplications/${id}`);

        if (res.status === 200) {
          // Optimistically update local state
          setApplicationsList((prev) => prev.filter((app) => app._id !== id));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The Course Application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Silent refetch
          await refetchCourseApplications({ throwOnError: false });
          await CoursesRefetch({ throwOnError: false });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to delete",
          text:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  // UI Loading / Error States
  if (loading || CourseApplicationsIsLoading || CoursesIsLoading)
    return <Loading />;
  if (CourseApplicationsError || CoursesError) return <Error />;

  // Merge Application with Course
  const mergedData = applicationsList
    .map((application) => {
      const course = CoursesData.find((c) => c._id === application.courseId);
      return {
        ...application,
        course,
      };
    })
    .filter((item) => item.course);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Course Applications
      </h3>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {mergedData.length > 0 ? (
          mergedData.map(({ course, appliedAt, status, _id }) => (
            <article
              key={_id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between p-6"
              style={{ minHeight: "340px" }}
            >
              {/* Course Info */}
              <div>
                <h4
                  className="text-2xl font-bold text-gray-900 mb-1 truncate"
                  title={course?.title}
                >
                  {course?.title || "Untitled Course"}
                </h4>
                <p
                  className="text-sm text-gray-500 font-medium mb-4 truncate"
                  title={course?.instructor?.name}
                >
                  Instructor: {course?.instructor?.name || "Unknown"}
                </p>

                {/* Details */}
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 mb-6">
                  <div>
                    <dt className="font-semibold text-gray-800">Category</dt>
                    <dd className="mt-0.5">{course?.category || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Level</dt>
                    <dd className="mt-0.5">{course?.level || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Modules</dt>
                    <dd className="mt-0.5">{course?.modules ?? "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Lessons</dt>
                    <dd className="mt-0.5">{course?.lessons ?? "N/A"}</dd>
                  </div>
                </dl>
              </div>

              {/* Applied & Status */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Applied{" "}
                  <time dateTime={appliedAt}>
                    {appliedAt
                      ? formatDistanceToNow(new Date(appliedAt), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </time>
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    status === "approved"
                      ? "bg-green-100 text-green-700"
                      : status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center gap-4">
                {/* View Application */}
                <button
                  id={`course-app-btn-${_id}`}
                  data-tooltip-content="View Application"
                  className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition"
                  onClick={() => {
                    setSelectedApplicationID(_id);
                    document
                      .getElementById("View_Course_Application_Modal")
                      .showModal();
                  }}
                  aria-label="View Application"
                >
                  <img src={Courses} alt="View" className="w-5" />
                </button>
                <Tooltip
                  anchorSelect={`#course-app-btn-${_id}`}
                  place="top"
                  className="!text-sm !bg-gray-900 !text-white !py-1 !px-3 !rounded"
                />

                {/* Delete */}
                <button
                  id={`course-app-cross-${_id}`}
                  data-tooltip-content="Cancel Application"
                  className="flex items-center justify-center w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition"
                  onClick={() => handleDeleteCourseApplication(_id)}
                  aria-label="Cancel Application"
                >
                  <ImCross size={18} />
                </button>
                <Tooltip
                  anchorSelect={`#course-app-cross-${_id}`}
                  place="top"
                  className="!text-sm !bg-gray-900 !text-white !py-1 !px-3 !rounded"
                />

                {/* View Details */}
                <button
                  id={`course-details-btn-${_id}`}
                  data-tooltip-content="View Course Details"
                  className="flex items-center justify-center w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
                  onClick={() => {
                    setSelectedCourseID(course?._id);
                    document.getElementById("Course_Details_Modal").showModal();
                  }}
                  aria-label="View Course Details"
                >
                  <FaInfo size={18} />
                </button>
                <Tooltip
                  anchorSelect={`#course-details-btn-${_id}`}
                  place="top"
                  className="!text-sm !bg-gray-900 !text-white !py-1 !px-3 !rounded"
                />
              </div>
            </article>
          ))
        ) : (
          // Fallback UI
          <div className="col-span-full mt-32 text-center px-6 max-w-xl mx-auto">
            <p className="text-3xl font-semibold text-white mb-4">
              No course applications found.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              You haven’t applied for any courses yet. Find courses that match
              your interests and grow your skills.
            </p>
            <Link
              to="/Courses"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-8 rounded shadow-lg transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* View Course Application Modal */}
      <dialog id="View_Course_Application_Modal" className="modal">
        <MyCourseApplicationsModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Course Details Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
    </section>
  );
};

export default MyCourseApplications;
