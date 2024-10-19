import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import CourseData from "./CourseData/CourseData";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext } from "react";
import ModalNewCourse from "./ModalNewCourse/ModalNewCourse";

const ManageMyCourse = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  // Fetch CompanyProfiles data
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

  const course = MyCourse[0];

  // Check if there are no company profiles available
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
                document
                  .getElementById("Create_New_Course")
                  .showModal()
              }
            >
              Create Course
            </button>
          </div>
        </div>

        {/* Modal Create a new Company Profile */}
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
          //   onClick={() => handleEditEvent(event)}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          //   onClick={() => handleDeleteEvent(event._id)} // Pass the event ID
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div>

      <CourseData courseData={course} />
    </div>
  );
};

export default ManageMyCourse;
