import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import InternshipData from "./InternshipData/InternshipData";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import ModalNewInternship from "./ModalNewInternship/ModalNewInternship";
import ModalEditInternship from "./ModalEditInternship/ModalEditInternship";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ManageMyInternship = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [editInternshipData, setEditInternshipData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false); // State for loading during delete

  const { register, handleSubmit, reset } = useForm();

  // Fetch Internship data
  const {
    data: MyInternship = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyInternship"],
    queryFn: () =>
      axiosPublic
        .get(`/Internship?postedBy=${user.email}`)
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

  // Check if no internships have been posted
  if (MyInternship.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-center text-gray-800 font-bold text-2xl mb-4">
              No Internship Posted Yet
            </p>
            <p className="text-center text-gray-600 mb-4">
              Please create an Internship profile to manage your Internship
              information.
            </p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document.getElementById("Create_New_Internship").showModal()
              }
            >
              Create Internship
            </button>
          </div>
        </div>

        {/* Modal Create New Internship */}
        <dialog id="Create_New_Internship" className="modal rounded-none">
          <ModalNewInternship refetch={refetch} />
        </dialog>
      </div>
    );
  }

  // Sample Internship for display; adjust index or logic if necessary
  const Internship = MyInternship[0]; // Display first internship by default

  // Handle Edit Internship
  const handleEditInternship = (internship) => {
    setEditInternshipData(internship);
    document.getElementById("Edit_Internship_Modal").showModal();
  };

  // Handle Delete Internship
  const handleDeleteInternship = (internshipId) => {
    setSelectedInternshipId(internshipId);
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
    const internshipToDelete = MyInternship.find(
      (internship) => internship._id === selectedInternshipId
    );

    if (!internshipToDelete) return;

    const deleteEventLogData = {
      DeletedBy: user.email,
      PostedBy: internshipToDelete.postedBy,
      DeletedDate: formattedDateTime,
      Type: "Internship",
      deletedContent: internshipToDelete.title,
      reason: data.deleteReason,
    };

    setLoadingDelete(true); // Start loading

    try {
      // Post log data to the Delete-Log server
      await axiosPublic.post(`/Delete-Log`, [deleteEventLogData]);
      // Delete internship by ID
      await axiosPublic.delete(`/Internship/${selectedInternshipId}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Internship successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset();
      setShowDeleteModal(false);
      setSelectedInternshipId(null);
      refetch();
    } catch (error) {
      console.error("Error deleting internship:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete internship. Please try again.",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoadingDelete(false); // End loading
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage My Internship
      </p>

      {/* Edit and Delete Buttons */}
      <div className="flex justify-between items-center px-5 pt-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleEditInternship(Internship)}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleDeleteInternship(Internship._id)}
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div>

      {/* Display Internship Data */}
      <InternshipData InternshipData={Internship} refetch={refetch} />

      {/* Edit Internship Modal */}
      <dialog id="Edit_Internship_Modal" className="modal">
        <ModalEditInternship
          InternshipData={editInternshipData}
          refetch={refetch}
        />
      </dialog>

      {/* Delete Internship Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Internship</h2>
            <p>Are you sure you want to delete this internship?</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className="textarea textarea-bordered w-full bg-white border-black h-40"
                placeholder="Enter the reason for deletion"
                {...register("deleteReason", { required: true })}
              ></textarea>
              <button
                type="submit"
                className={`bg-red-500 hover:bg-red-400 px-4 py-2 text-white font-bold mt-4 ${
                  loadingDelete ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={loadingDelete} // Disable button while loading
              >
                {loadingDelete ? "Deleting..." : "Confirm Delete"}
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

export default ManageMyInternship;
