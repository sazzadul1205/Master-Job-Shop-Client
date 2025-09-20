import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mergedData.length > 0 ? (
          mergedData.map(({ course, appliedAt, status, _id }) => (
            <article
              key={_id}
              className="relative bg-white border border-gray-200 rounded-xl shadow hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between p-6"
              style={{ minHeight: "250px" }}
            >
              {/* Status Badge */}
              <span
                className={`absolute -top-3 -left-3 px-4 py-1 text-sm font-semibold rounded-full shadow-xl ${
                  status === "accepted"
                    ? "bg-green-500 text-white"
                    : status === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>

              {/* Course Info */}
              <div className="mt-2">
                <h4
                  className="text-xl font-bold text-gray-900 mb-1 truncate"
                  title={course?.title}
                >
                  {course?.title || "Untitled Course"}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Instructor: {course?.Mentor?.name || "Unknown"}
                </p>

                {/* Applied Date */}
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

                {/* Course Category & Level */}
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {course?.category} › {course?.subCategory}
                  </p>
                  <p>
                    <span className="font-semibold">Level:</span>{" "}
                    {course?.level}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-3 mt-2">
                {/* View Application */}
                <button
                  id={`course-app-btn-${_id}`}
                  data-tooltip-content="View Application"
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition cursor-pointer"
                  onClick={() => {
                    setSelectedApplicationID(_id);
                    document
                      .getElementById("View_Course_Application_Modal")
                      ?.showModal();
                  }}
                >
                  <img src={Courses} alt="View" className="w-5" />
                </button>
                <Tooltip anchorSelect={`#course-app-btn-${_id}`} place="top" />

                {/* Cancel Application */}
                <button
                  id={`course-app-cross-${_id}`}
                  data-tooltip-content="Cancel Application"
                  className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition cursor-pointer"
                  onClick={() => handleDeleteCourseApplication(_id)}
                >
                  <ImCross size={16} />
                </button>
                <Tooltip
                  anchorSelect={`#course-app-cross-${_id}`}
                  place="top"
                />

                {/* View Course Details */}
                <button
                  id={`course-details-btn-${_id}`}
                  data-tooltip-content="View Course Details"
                  className="flex items-center justify-center w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow transition cursor-pointer"
                  onClick={() => {
                    setSelectedCourseID(course?._id);
                    document
                      .getElementById("Course_Details_Modal")
                      ?.showModal();
                  }}
                >
                  <FaInfo size={16} />
                </button>
                <Tooltip
                  anchorSelect={`#course-details-btn-${_id}`}
                  place="top"
                />
              </div>
            </article>
          ))
        ) : (
          // Fallback UI
          <div className="text-center col-span-full mt-24 px-6 max-w-xl mx-auto">
            <p className="text-2xl font-medium text-white mb-3">
              No course applications found.
            </p>
            <p className="text-gray-200 font-semibold text-lg mb-5">
              You haven’t applied for any courses yet. Find courses that match
              your interests and grow your skills.
            </p>
            <Link
              to="/Courses"
              className="inline-block bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 text-black font-semibold py-3 px-10 shadow-lg hover:shadow-xl rounded transition"
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
