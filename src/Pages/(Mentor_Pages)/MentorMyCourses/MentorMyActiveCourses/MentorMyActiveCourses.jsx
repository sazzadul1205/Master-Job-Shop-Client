import {
  FaEdit,
  FaEye,
  FaPlus,
  FaRegStar,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";
import { GoDot } from "react-icons/go";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useState } from "react";
import Swal from "sweetalert2";
import CourseDetailsModal from "../../../(Public_Pages)/Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";

// Utility: Format Budget Display
const formatBudget = (amount, currency = "USD", isNegotiable = false) => {
  if (amount === 0 || amount === null || amount === undefined) return "Free";

  // Always show 2 decimals (e.g., 1500 -> 1500.00, 1500.5 -> 1500.50)
  const formattedAmount = amount.toFixed(2);

  return `${currency} ${formattedAmount}${isNegotiable ? " (Negotiable)" : ""}`;
};

// Utility: Posted Time
const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";
  const postedDate = new Date(isoString);
  const today = new Date();
  const diff = today - postedDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

const MentorMyActiveCourses = ({ error, refetch, CoursesData, isLoading }) => {
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [selectedCourseID, setSelectedCourseID] = useState(null);

  // keep track of starred Course's by ID
  const [starred, setStarred] = useState([]);

  // Optimistic Archive Toggle
  const toggleStar = async (id) => {
    // Optimistically toggle locally
    const isCurrentlyStarred = starred.includes(id);
    setStarred((prev) =>
      isCurrentlyStarred ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

    try {
      // Call backend to toggle archive
      const res = await axiosPublic.put(`/Courses/Archive/${id}`);

      if (res?.data?.archived === undefined) {
        throw new Error("Unexpected response from server");
      }

      // Refetch data
      refetch();

      // Show success toast
      Swal.fire({
        toast: true,
        position: "top-start",
        icon: "success",
        title: res.data.archived ? "Archived!" : "Un-Archived!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // If backend disagrees with local toggle, correct it
      if (res.data.archived !== !isCurrentlyStarred) {
        setStarred((prev) =>
          res.data.archived ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
      }
    } catch (error) {
      // Rollback local toggle
      setStarred((prev) =>
        isCurrentlyStarred ? [...prev, id] : prev.filter((sid) => sid !== id)
      );

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update archive status. Please try again!",
      });

      console.error("Failed to toggle archive:", error);
    }
  };

  // Sort Course's by postedAt (most recent first)
  const sortedCourse = CoursesData
    ? [...CoursesData].sort(
        (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
      )
    : [];

  // Loading State
  if (isLoading) return <Loading />;

  // Error State
  if (error) return <Error />;

  return (
    <div className="text-black">
      {/* Title */}
      <h3 className="text-2xl font-bold mb-6">
        Ongoing Courses ( {CoursesData?.length || 0} )
      </h3>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCourse && sortedCourse.length > 0 ? (
          sortedCourse.map((course, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 hover:shadow-2xl"
            >
              {/* Status Badge */}
              <span
                className={`absolute -top-3 -left-3 px-5 py-1 text-sm font-semibold rounded-full shadow-xl ${
                  ["active", "closed"].includes(course?.status?.toLowerCase())
                    ? "bg-red-500 text-white"
                    : course?.status?.toLowerCase() === "open"
                    ? "bg-green-500 text-white"
                    : course?.status?.toLowerCase() === "completed"
                    ? "bg-blue-500 text-white"
                    : course?.status?.toLowerCase() === "onhold"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {["active", "closed"].includes(course?.status?.toLowerCase())
                  ? "Closed"
                  : course?.status?.toLowerCase() === "open"
                  ? "Open"
                  : course?.status?.toLowerCase() === "completed"
                  ? "Completed"
                  : course?.status?.toLowerCase() === "onhold"
                  ? "On Hold"
                  : "Unknown"}
              </span>

              {/* Star Toggle */}
              <button
                onClick={() => toggleStar(course?._id)}
                className="absolute top-3 right-3 text-2xl cursor-pointer transition-colors group"
              >
                {course?.archived ? (
                  <FaStar className="text-yellow-400 drop-shadow-md" />
                ) : (
                  <FaRegStar className="text-gray-400 hover:text-yellow-400" />
                )}

                {/* Tooltip */}
                <span className="absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {course?.archived ? "Archived" : "Un-Archived"}
                </span>
              </button>

              {/* Course Info */}
              <div>
                {/* Title & Subtitle */}
                <div>
                  {/* Title */}
                  <h4 className="text-xl font-bold text-gray-900">
                    {course.title}
                  </h4>
                  {/* Subtitle */}
                  <p className="text-gray-600 text-sm">{course.subTitle}</p>

                  {/* Category & Subcategory */}
                  <p className="text-gray-600 text-sm">
                    {course.category} {">"} {course.subCategory}
                  </p>
                </div>

                {/* Level */}
                <p className="text-sm mt-1">
                  <span className="font-semibold">Level:</span> {course.level}
                </p>

                {/* Duration */}
                <p className="text-sm flex items-center gap-2">
                  <span className="font-semibold">Duration:</span>{" "}
                  <span>{course.durationHours} hrs</span>{" "}
                  <GoDot className="mt-1" />{" "}
                  <span>{course?.modulesNumber} Modules</span>
                </p>

                {/* Fee */}
                <p className="text-sm">
                  <span className="font-semibold">Fee:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    {course?.fee
                      ? formatBudget(
                          course?.fee?.amount,
                          course?.fee?.currency,
                          course?.fee?.isNegotiable
                        )
                      : "Not specified"}
                  </span>
                </p>

                {/* Posted Date */}
                <p className="text-sm text-gray-400 mt-1">
                  Posted:{" "}
                  {course?.postedAt
                    ? calculateDaysAgo(course.postedAt)
                    : "Unknown"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-4 gap-2">
                {/* View */}
                <button
                  onClick={() => {
                    document
                      .getElementById("Course_Details_Modal")
                      ?.showModal();
                    setSelectedCourseID(course?._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <FaEye /> View
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    document.getElementById("Edit_Course_Modal")?.showModal();
                    setSelectedCourseID(course?._id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600 transition-colors cursor-pointer"
                >
                  <FaEdit /> Edit
                </button>

                {/* Delete */}
                <button
                  // onClick={() => handleDelete(course?._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          // Fallback: Center Card for Creating Course
          <div className="col-span-full mx-auto max-w-3xl flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-10 text-center space-y-6">
            {/* Icon */}
            <div className="bg-blue-100 p-4 rounded-full">
              <FaPlus className="text-4xl text-blue-600" />
            </div>

            {/* Heading */}
            <h3 className="text-2xl font-bold text-gray-900">
              No Courses Created Yet
            </h3>

            {/* Description */}
            <p className="text-gray-600 font-semibold text-base">
              It looks like you haven’t created any courses yet. Courses are a
              great way to share your knowledge, structure learning content, and
              help others grow their skills effectively.
            </p>

            {/* Encouragement */}
            <p className="text-gray-500 text-sm">
              Click the button below to create your first course. You can define
              the curriculum, set up schedules, add modules, and start helping
              learners improve their expertise today!
            </p>

            {/* Create Course Button */}
            <button
              onClick={() =>
                document.getElementById("Create_Course_Modal").showModal()
              }
              className="flex items-center gap-3 bg-[#002242] hover:bg-[#00509e] text-white shadow hover:shadow-2xl font-semibold px-6 py-3 rounded-md transition-colors duration-500 cursor-pointer"
            >
              <FaPlus /> Create New Course
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* Course Details Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          isEditor={true}
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
    </div>
  );
};

export default MentorMyActiveCourses;
