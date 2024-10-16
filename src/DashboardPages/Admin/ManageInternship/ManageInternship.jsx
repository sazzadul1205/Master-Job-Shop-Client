import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import ModalViewInternship from "./ModalViewInternship/ModalViewInternship";
import Swal from "sweetalert2"; // Assuming Swal is imported for alerts
import { useForm } from "react-hook-form";

const ManageInternship = () => {
  const axiosPublic = useAxiosPublic();
  const [viewInternshipData, setViewInternshipData] = useState(null);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // Fetch Internship data
  const {
    data: InternshipData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: () => axiosPublic.get(`/Internship`).then((res) => res.data),
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

  // View internship details
  const handleViewInternship = (intern) => {
    setViewInternshipData(intern);
    document.getElementById("Modal_Internship_View").showModal();
  };

  // Show delete confirmation modal
  const handleSingleDelete = (internshipID) => {
    setSelectedInternshipId(internshipID);
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
      const internship = InternshipData.find(
        (intern) => intern._id === selectedInternshipId
      );
      const deleteLogData = {
        DeletedBy: "user@example.com", // Replace with dynamic user email
        PostedBy: internship?.postedBy,
        DeletedDate: formattedDateTime,
        Type: "Internship",
        deletedContent: internship?.companyName,
        reason: data.deleteReason,
      };

      // Log deletion and delete the internship
      await axiosPublic.post(`/Delete-Log`, [deleteLogData]);
      await axiosPublic.delete(`/Internship/${selectedInternshipId}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Internship deleted successfully.",
        confirmButtonText: "Okay",
      });

      refetch();
      reset();
      setShowDeleteModal(false);
      setSelectedInternshipId(null);
    } catch (error) {
      console.error("Error deleting internship:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete internship. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Internship
      </p>

      {/* Search Bar */}
      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch />
        </label>
      </div>

      {/* Internship Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th>No</th>
              <th>Company Name</th>
              <th>Position</th>
              <th>Duration</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {InternshipData.length > 0 ? (
              InternshipData.map((intern, index) => (
                <tr key={intern._id}>
                  <td>{index + 1}</td>
                  <td>{intern?.companyName}</td>
                  <td>{intern?.position}</td>
                  <td>{intern?.duration}</td>
                  <td>{intern?.postedBy}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                        onClick={() => handleViewInternship(intern)}
                      >
                        <CiViewBoard />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                        onClick={() => handleSingleDelete(intern._id)}
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
                  No internships found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Internship Modal */}
      <dialog id="Modal_Internship_View" className="modal">
        {viewInternshipData && (
          <ModalViewInternship internshipData={viewInternshipData} />
        )}
      </dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Internship</h2>
            <p className="font-bold mb-4">
              Are you sure you want to delete this internship?
            </p>
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

export default ManageInternship;
