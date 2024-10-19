import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import MentorshipData from "./MentorshipData/MentorshipData";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import ModalNewMentorship from "./ModalNewMentorship/ModalNewMentorship";
import ModalEditMentorship from "./ModalEditMentorship/ModalEditMentorship";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ManageMyMentorship = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [editMentorshipData, setEditMentorshipData] = useState(null);
  const [selectedMentorshipId, setSelectedMentorshipId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Fetch Mentorship data
  const {
    data: MyMentorship = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyMentorship"],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?postedBy=${user.email}`)
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

  // Check if there are no mentorship profiles available
  if (MyMentorship.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-center text-gray-800 font-bold text-2xl mb-4">
              No Mentorship Posted Yet
            </p>
            <p className="text-center text-gray-600 mb-4">
              Please create a Mentorship profile to manage your Mentorship
              information.
            </p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document.getElementById("Create_New_Mentorship").showModal()
              }
            >
              Create Mentorship
            </button>
          </div>
        </div>

        {/* Modal Create New Mentorship */}
        <dialog id="Create_New_Mentorship" className="modal rounded-none">
          <ModalNewMentorship refetch={refetch} />
        </dialog>
      </div>
    );
  }

  // Handle Edit Mentorship
  const handleEditMentorship = (mentor) => {
    setEditMentorshipData(mentor);
    document.getElementById("Edit_Mentorship_Modal").showModal();
  };

  // Handle Delete Mentorship
  const handleDeleteMentorship = (mentorId) => {
    setSelectedMentorshipId(mentorId);
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
    const mentorshipToDelete = MyMentorship.find(
      (mentor) => mentor._id === selectedMentorshipId
    );

    if (!mentorshipToDelete) return;

    const deleteEventLogData = {
      DeletedBy: user.email,
      PostedBy: mentorshipToDelete.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Mentorship",
      deletedContent: mentorshipToDelete.mentorName,
      reason: data.deleteReason,
    };

    try {
      // Post log data to the Delete-Log server
      await axiosPublic.post(`/Delete-Log`, [deleteEventLogData]);
      // Delete mentorship by ID
      await axiosPublic.delete(`/Mentorship/${selectedMentorshipId}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Mentorship successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset();
      setShowDeleteModal(false);
      setSelectedMentorshipId(null);
      refetch();
    } catch (error) {
      console.error("Error deleting mentorship:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete mentorship. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  const mentorData = MyMentorship[0];

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage My Mentorship
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex justify-between items-center px-5 pt-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleEditMentorship(mentorData)}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleDeleteMentorship(mentorData._id)}
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div>

      <MentorshipData mentorshipData={mentorData} refetch={refetch} />

      {/* Edit Mentorship Modal */}
      <dialog id="Edit_Mentorship_Modal" className="modal">
        <ModalEditMentorship
          MentorshipData={editMentorshipData}
          refetch={refetch}
        />
      </dialog>

      {/* Delete Mentorship Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Mentorship</h2>
            <p>Are you sure you want to delete this mentor?</p>
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

export default ManageMyMentorship;
