import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalViewCourse from "./ModalViewCourse/ModalViewCourse";
import ModalAddCourses from "./ModalAddCourses/ModalAddCourses";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ManageCourses = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [viewCourseData, setViewCourseData] = useState(null); // state to hold course details for modal
  const [searchTerm, setSearchTerm] = useState(""); // state for search input
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetching Courses Data
  const {
    data: CoursesData = [], // Default to empty array
    isLoading: CoursesDataIsLoading,
    error: CoursesDataError,
    refetch,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get(`/Courses`).then((res) => res.data),
  });

  // Loading state
  if (CoursesDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CoursesDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Handle viewing course details
  const handleViewCourse = (course) => {
    setViewCourseData(course); // Set the selected course details
    document.getElementById("Modal_Course_View").showModal(); // Show the modal
  };

  // Handle search
  const filteredCourses = CoursesData.filter((course) =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle single course deletion
  const handleSingleDelete = (courseID) => {
    setSelectedCourseId(courseID); // Set the selected course ID for deletion
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  // Current date for deletion log
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Input submission for deletion reason
  const onSubmit = async (data) => {
    const course = CoursesData.find(
      (course) => course._id === selectedCourseId
    );

    const deleteCourseLogData = {
      DeletedBy: user.email,
      PostedBy: course?.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Course",
      deletedContent: course?.courseTitle,
      reason: data.deleteReason,
    };

    try {
      // Post log data to the Delete-Log server, wrapping it in an array
      await axiosPublic.post(`/Delete-Log`, [deleteCourseLogData]); // Send as an array
      // Delete course by ID
      await axiosPublic.delete(`/Courses/${selectedCourseId}`);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Course successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset(); // Reset form
      setShowDeleteModal(false); // Close modal
      setSelectedCourseId(null); // Clear selected course ID
      refetch(); // Refetch courses after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete course. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Courses
      </p>

      {/* Search */}
      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch />
          </label>
        </div>
      </div>

      {/* Add new course button */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 px-10 py-2 text-white font-bold"
          onClick={() =>
            document.getElementById("Create_New_Courses").showModal()
          }
        >
          + Add New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Level</th>
              <th>Posted By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <tr key={course._id}>
                  <td>{index + 1}</td>
                  <td>{course?.courseTitle}</td>
                  <td>{course?.instructor}</td>
                  <td>{course?.level}</td>
                  <td>{course?.postedBy}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                        onClick={() => handleViewCourse(course)}
                      >
                        <CiViewBoard />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                        onClick={() => handleSingleDelete(course._id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View course modal */}
      <dialog id="Modal_Course_View" className="modal">
        {viewCourseData && <ModalViewCourse courseData={viewCourseData} />}
      </dialog>

      <dialog id="Create_New_Courses" className="modal">
        <ModalAddCourses refetch={refetch} />
      </dialog>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Course</h2>
            {selectedCourseId && (
              <p className="font-bold">
                Are you sure you want to delete this course?
              </p>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 font-bold">
                  Reason for Deletion:
                </label>
                <textarea
                  {...register("deleteReason", { required: true })}
                  className="textarea textarea-bordered w-full bg-white border-black h-40"
                  placeholder="Enter the reason for deletion"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-400 text-white px-5 py-2"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-400 text-white px-5 py-2"
                >
                  Confirm Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
