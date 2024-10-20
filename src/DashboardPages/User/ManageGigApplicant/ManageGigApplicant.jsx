import React, { useContext, useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa";
import { CiViewBoard } from "react-icons/ci";
import ModalAddGig from "../../Admin/ManageGigs/ModalAddGig/ModalAddGig";
import ModalEditGig from "../../Admin/ManageGigs/ModalEditGig/ModalEditGig";
import ModalViewGigs from "../../Admin/ManageGigs/ModalViewGigs/ModalViewGigs";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ManageGigApplicant = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [expandedGigId, setExpandedGigId] = useState(null);
  const [viewGigData, setViewGigData] = useState(null);
  const [editGigData, setEditGigData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGigs, setSelectedGigs] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  // Fetch Gigs data
  const {
    data: MyPostedGigs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyPostedGigs"],
    queryFn: () =>
      axiosPublic
        .get(`/Posted-Gig?postedBy=${user?.email}`)
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

  // Handle View Gig
  const handleViewGig = (gig) => {
    setViewGigData(gig); // Set the selected gig details
    document.getElementById("Modal_Gig_View").showModal(); // Show the modal
  };

  // Handle Edit Gig
  const handleEditGig = (gig) => {
    setEditGigData(gig); // Set the Gig data for editing
    document.getElementById("Edit_Gig").showModal(); // Show the modal
  };

  // Handle Single Delete
  const handleSingleDelete = (gigId) => {
    setSelectedGigs([gigId]);
    setShowDeleteModal(true);
  };

  // Toggle function to expand/collapse the Gig details
  const toggleGigDetails = (gigId) => {
    if (expandedGigId === gigId) {
      setExpandedGigId(null); // Collapse if already expanded
    } else {
      setExpandedGigId(gigId); // Expand if not already expanded
    }
  };

  // Date and Time
  const formattedDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Delete On Submit part
  const onSubmit = async (data) => {
    const deleteGigLogData = selectedGigs.map((gigId) => {
      const gig = MyPostedGigs.find((gig) => gig._id === gigId);

      return {
        DeletedBy: user.email, // Assuming user is defined elsewhere
        PostedBy: gig?.postedBy,
        DeletedDate: formattedDateTime,
        Type: "Posted-Gig",
        deletedContent: gig?.gigTitle,
        reason: data.deleteReason,
      };
    });

    try {
      // Post log data to the Delete-Log server
      await axiosPublic.post(`/Delete-Log`, deleteGigLogData);

      // Delete gigs by ID
      await axiosPublic.delete(`/Posted-Gig/delete`, {
        data: { gigsToDelete: selectedGigs },
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Gigs successfully deleted.",
        confirmButtonText: "Okay",
      });

      reset();
      setShowDeleteModal(false);
      setSelectedGigs([]);
      refetch();
    } catch (error) {
      console.error("Error deleting gigs:", error);
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete gigs. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  // Applicant Delete Function
  const handleDeleteApplicant = (gigId, biderEmail) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete applicant ${biderEmail} from this job. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion logic here, e.g., call the API to delete the applicant
        axiosPublic
          .delete(`/Posted-Gig/${gigId}/bidder`, {
            data: { email: biderEmail }, // Pass the email in the request body
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: `Applicant ${biderEmail} has been deleted successfully.`,
              confirmButtonText: "Okay",
            });

            // Optionally, refetch data or update UI after deletion
            if (typeof refetch === "function") {
              refetch(); // Refresh the data after deletion
            }
          })
          .catch((error) => {
            console.error("Error deleting applicant:", error);

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Please try again later.",
              confirmButtonText: "Okay",
            });
          });
      }
    });
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Gig Applicant
      </p>

      {/* New Gig Button */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 w-48 py-1 text-lg text-white font-bold"
          onClick={() => document.getElementById("Create_New_Gig").showModal()}
        >
          + Add New Gig
        </button>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-gray-300">
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Gig Title</th>
              <th>Client Name</th>
              <th>Gig Type</th>
              <th>Posted Date</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MyPostedGigs.map((gig, index) => (
              <React.Fragment key={gig._id}>
                {/* Main Table Row */}
                <tr>
                  <td>{index + 1}</td>
                  <td>{gig?.gigTitle}</td>
                  <td>{gig?.clientName}</td>
                  <td>{gig?.gigType}</td>
                  <td>{new Date(gig.postedDate).toLocaleDateString()}</td>
                  <td>{gig?.state}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      {/* Edit Gig Button */}
                      <button
                        className="bg-green-500 hover:bg-green-400 p-2 text-white text-xl"
                        aria-label="Edit Gig"
                        onClick={() => handleEditGig(gig)}
                      >
                        <FaEdit />
                      </button>

                      {/* View Gig Button */}
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-xl"
                        aria-label="View Gig"
                        onClick={() => handleViewGig(gig)}
                      >
                        <CiViewBoard />
                      </button>

                      {/* Delete Gig Button */}
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-xl"
                        aria-label="Delete Gig"
                        onClick={() => handleSingleDelete(gig._id)}
                      >
                        <MdDelete />
                      </button>

                      {/* Toggle Up/Down Arrow Button */}
                      <button
                        className="bg-blue-300 hover:bg-blue-500 p-2 text-white text-xl"
                        onClick={() => toggleGigDetails(gig._id)}
                      >
                        {expandedGigId === gig._id ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Applicants Table */}
                {expandedGigId === gig._id && (
                  <tr>
                    <td colSpan="6" className="py-1 px-1">
                      <div className="overflow-x-auto">
                        {gig.peopleBided?.length > 0 ? (
                          <table className="table border border-gray-300 w-full">
                            <thead className="bg-blue-200 text-black">
                              <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>About Bider</th>
                                <th>Applied Date</th>
                                <th>Resume</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {gig.peopleBided.map((applicant, i) => (
                                <tr key={i}>
                                  <td>
                                    <img
                                      src={applicant.biderImage}
                                      alt={applicant.biderName}
                                      className="w-12 h-12"
                                    />
                                  </td>
                                  <td>{applicant.biderName}</td>
                                  <td>{applicant.biderEmail}</td>
                                  <td>{applicant.AboutBider}</td>
                                  <td>{applicant.appliedDate}</td>
                                  <td>
                                    <a
                                      href={applicant.resumeLink}
                                      className="text-blue-500 underline"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Resume
                                    </a>
                                  </td>
                                  <td>
                                    <button
                                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-xl"
                                      onClick={() =>
                                        handleDeleteApplicant(
                                          gig._id,
                                          applicant.biderEmail
                                        )
                                      } // Use applicant.biderEmail as the email field in your data
                                      aria-label="Delete Applicant"
                                    >
                                      <MdDelete />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center text-red-500 font-bold text-lg">
                            No applicants yet.
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Gigs Modal */}
      <dialog id="Create_New_Gig" className="modal">
        <ModalAddGig refetch={refetch}></ModalAddGig>
      </dialog>

      {/* View Gig Modal  */}
      <dialog id="Modal_Gig_View" className="modal">
        <ModalViewGigs GigData={viewGigData} />
      </dialog>

      {/* Edit Gig Modal */}
      <dialog id="Edit_Gig" className="modal">
        <ModalEditGig editGigData={editGigData} refetch={refetch} />
      </dialog>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Gigs</h2>
            <p className="font-bold">Selected Gigs:</p>
            <ul className="mb-4 w-[400px]">
              {selectedGigs.map((gigId) => {
                const gig = MyPostedGigs.find((gig) => gig._id === gigId);
                return (
                  <li
                    key={gigId}
                    className="mt-2 border border-gray-200 p-2 hover:bg-gray-200 hover:text-lg"
                  >
                    <p className="flex">
                      <span className="font-bold w-24">Gig Name: </span>
                      {gig?.gigTitle}
                    </p>
                    <p className="flex">
                      <span className="font-bold w-24">Client Name:</span>
                      {gig?.clientName}
                    </p>
                  </li>
                );
              })}
            </ul>
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

export default ManageGigApplicant;
