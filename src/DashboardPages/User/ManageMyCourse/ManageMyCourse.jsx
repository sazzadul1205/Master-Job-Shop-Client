import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import CourseData from "./CourseData/CourseData";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import ModalNewCourse from "./ModalNewCourse/ModalNewCourse";
import ModalEditCourse from "./ModalEditCourse/ModalEditCourse";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const ManageMyCourse = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const [editCourseData, setEditCourseData] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch Courses data
  const {
    data: MyCourse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyCourse"],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?postedBy=${user.email}`)
        .then((res) => res.data),
  });

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
  if (error) {
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

  // Handle Edit Course
  const handleEditCourse = (course) => {
    setEditCourseData(course);
    document.getElementById("Edit_Course_Modal").showModal();
  };

  // Handle Delete Course
  const handleDeleteCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setShowDeleteModal(true);
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

  // Form submission for deletion reason
  const onSubmit = async (data) => {
    const courseToDelete = MyCourse.find(
      (course) => course._id === selectedCourseId
    );
    if (!courseToDelete) return;

    const deleteEventLogData = {
      DeletedBy: user.email,
      PostedBy: courseToDelete.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Course",
      deletedContent: courseToDelete.eventTitle,
      reason: data.deleteReason,
    };

    try {
      // Post log data to the Delete-Log server
      await axiosPublic.post(`/Delete-Log`, [deleteEventLogData]);
      // Delete event by ID
      await axiosPublic.delete(`/Courses/${selectedCourseId}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Course successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset();
      setShowDeleteModal(false);
      setSelectedCourseId(null);
      refetch();
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete course. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  const course = MyCourse[0];

  // Check if there are no course profiles available
  if (MyCourse.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-center text-gray-800 font-bold text-2xl mb-4">
              No Courses Posted yet
            </p>
            <p className="text-center text-gray-600 mb-4">
              Please create a Course profile to manage your Course information.
            </p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document.getElementById("Create_New_Course").showModal()
              }
            >
              Create Course
            </button>
          </div>
        </div>

        {/* Modal Create a new Course */}
        <dialog id="Create_New_Course" className="modal rounded-none">
          <ModalNewCourse refetch={refetch} />
        </dialog>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Course
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex justify-between items-center px-5 pt-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleEditCourse(course)}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleDeleteCourse(course._id)}
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div>

      <CourseData courseData={course} />

      {/* Edit Course Modal */}
      <dialog id="Edit_Course_Modal" className="modal">
        <ModalEditCourse CourseData={editCourseData} refetch={refetch} />
      </dialog>

      {/* Delete Course Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[1000px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Course</h2>
            <p>Are you sure you want to delete this course?</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className="textarea textarea-bordered w-full bg-white border-black h-40"
                placeholder="Enter the reason for deletion"
                {...register("deleteReason", { required: true })}
              ></textarea>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-400 px-4 py-2 text-white font-bold mt-4"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 hover:bg-gray-400 px-4 py-2 text-white font-bold mt-4 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMyCourse;
