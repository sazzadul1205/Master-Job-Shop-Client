import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useContext, useState } from "react";
import ModalViewMentorship from "./ModalViewMentorship/ModalViewMentorship";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";

const ManageMentorship = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [viewMentorshipData, setViewMentorshipData] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null); // Store entire mentor instead of ID
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // Fetch mentorship data
  const {
    data: mentorshipData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MentorshipData"],
    queryFn: () => axiosPublic.get(`/Mentorship`).then((res) => res.data),
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

  // View mentorship details
  const handleViewMentorship = (mentor) => {
    setViewMentorshipData(mentor);
    document.getElementById("Modal_Mentorship_View").showModal();
  };

  // Show delete confirmation modal
  const handleSingleDelete = (mentor) => {
    setSelectedMentor(mentor); // Store the entire mentor object
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

  // Handle form submission for deletion
  const onSubmit = async (data) => {
    try {
      const deleteLogData = {
        DeletedBy: user.email, // Dynamic user email
        PostedBy: selectedMentor?.postedBy,
        DeletedDate: formattedDateTime,
        Type: "Mentorship",
        deletedContent: selectedMentor?.mentorName,
        reason: data.deleteReason,
      };

      // Log deletion and delete the mentor
      await axiosPublic.post(`/Delete-Log`, [deleteLogData]);
      await axiosPublic.delete(`/Mentorship/${selectedMentor._id}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Mentor deleted successfully.",
        confirmButtonText: "Okay",
      });

      reset();
      refetch();
      setShowDeleteModal(false);
      setSelectedMentor(null);
    } catch (error) {
      console.error("Error deleting mentor:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete mentor. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Mentorship
      </p>

      {/* Search Bar */}
      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch />
        </label>
      </div>

      {/* Mentorship Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th>No</th>
              <th>Mentor Name</th>
              <th>Expertise</th>
              <th>Duration</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mentorshipData.length > 0 ? (
              mentorshipData.map((mentor, index) => (
                <tr key={mentor._id}>
                  <td>{index + 1}</td>
                  <td>{mentor?.mentorName}</td>
                  <td>{mentor?.expertise}</td>
                  <td>{mentor?.duration}</td>
                  <td>{mentor?.postedBy}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                        onClick={() => handleViewMentorship(mentor)}
                      >
                        <CiViewBoard />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                        onClick={() => handleSingleDelete(mentor)}
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
                  No mentors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Mentor Modal */}
      <dialog id="Modal_Mentorship_View" className="modal">
        {viewMentorshipData && (
          <ModalViewMentorship mentorData={viewMentorshipData} />
        )}
      </dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Mentor</h2>
            <div className="w-[400px]">
              <p className="font-bold">
                Are you sure you want to delete this mentor?
              </p>
              <div className="mt-2 border border-gray-200 p-2 hover:bg-gray-200 hover:text-lg">
                <p className="flex">
                  <span className="font-bold w-44">Mentor Name: </span>
                  {selectedMentor?.mentorName}
                </p>
                <p className="flex">
                  <span className="font-bold w-44">Expertise: </span>
                  {selectedMentor?.expertise}
                </p>
              </div>
            </div>
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
              <div className="flex justify-end gap-2 mt-5">
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

export default ManageMentorship;
