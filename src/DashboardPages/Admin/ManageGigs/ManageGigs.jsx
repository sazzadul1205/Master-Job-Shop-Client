import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaEdit, FaSearch } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalViewGigs from "./ModalViewGigs/ModalViewGigs";
import ModalAddGig from "./ModalAddGig/ModalAddGig";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import ModalEditGig from "./ModalEditGig/ModalEditGig";

const ManageGigs = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useContext(AuthContext);
  const [selectedGigs, setSelectedGigs] = useState([]);
  const [viewGigData, setViewGigData] = useState(null);
  const [editGigData, setEditGigData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [loadingDelay, setLoadingDelay] = useState(true); // New state for loading delay

  // Fetch user data to check the role
  const {
    data: usersData = [],
    isLoading: usersDataIsLoading,
    error: usersDataError,
  } = useQuery({
    queryKey: ["MyUsersData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email, // Only run this query if user.email is defined
  });

  // Fetch job data based on user role
  const jobQueryKey =
    usersData?.role === "Admin" || usersData?.role === "Manager"
      ? "/Posted-Gig"
      : `/Posted-Gig?postedBy=${user?.email}`;

  const {
    data: postedGigData = [],
    isLoading: postedGigDataIsLoading,
    error: postedGigDataError,
    refetch,
  } = useQuery({
    queryKey: ["PostedGigData", jobQueryKey],
    queryFn: () => axiosPublic.get(jobQueryKey).then((res) => res.data),
    enabled: !!user?.email, // Only run this query if user.email is defined
  });

  // Use effect to simulate loading delay
  useEffect(() => {
    if (!usersDataIsLoading && !postedGigDataIsLoading) {
      const timer = setTimeout(() => {
        setLoadingDelay(false); // Set loadingDelay to false after 1 second
      }, 1000); // Adjust the time as needed

      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [usersDataIsLoading, postedGigDataIsLoading]);

  if (loading || loadingDelay) {
    return <Loader />; // Show loader while loading
  }

  // Handle errors gracefully
  if (postedGigDataError || usersDataError) {
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

  // If user is not logged in, display a message
  if (!user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          You must be logged in to manage jobs.
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

  // Handle checkbox click
  const handleCheckboxClick = (id) => {
    setSelectedGigs((prevSelectedGigs) =>
      prevSelectedGigs.includes(id)
        ? prevSelectedGigs.filter((gigId) => gigId !== id)
        : [...prevSelectedGigs, id]
    );
  };

  // Handle single gig deletion (opens the same modal)
  const handleSingleDelete = (gigID) => {
    setSelectedGigs([gigID]); // Set the single gig as the only selected gig
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  // Current date for deletion log
  const formattedDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const onSubmit = async (data) => {
    const deleteGigLogData = selectedGigs.map((gigId) => {
      const gig = postedGigData.find((gig) => gig._id === gigId);

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

  const handleViewGig = (gig) => {
    setViewGigData(gig); // Set the selected gig details
    document.getElementById("Modal_Gig_View").showModal(); // Show the modal
  };

  const handleEditJob = (gig) => {
    setEditGigData(gig); // Set the job data for editing
    document.getElementById("Edit_Gig").showModal(); // Show the modal
  };
  
  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Gigs
      </p>

      {/* Search */}
      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input type="text" className="grow" placeholder="Search" />
            <FaSearch />
          </label>
        </div>
      </div>

      {/* Add and Delete selected Gigs button */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 px-10 py-2 text-white font-bold"
          onClick={() => document.getElementById("Create_New_Gig").showModal()}
        >
          + Add New Gigs
        </button>
        <button
          className="bg-red-500 hover:bg-red-300 px-10 py-2 text-white font-bold"
          onClick={() => {
            if (selectedGigs.length > 0) {
              setShowDeleteModal(true);
            } else {
              Swal.fire({
                icon: "warning",
                title: "No Gigs Selected",
                text: "Please select at least one gig to delete.",
                confirmButtonText: "Okay",
              });
            }
          }}
        >
          Delete
        </button>
      </div>

      {/* Gig Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Check</th>
              <th>Gig Title</th>
              <th>Client Name</th>
              <th>Gig Type</th>
              <th>Posted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through fetched gigs */}
            {postedGigData.map((gig, index) => (
              <tr
                key={gig._id}
                className={selectedGigs.includes(gig._id) ? "bg-red-50" : ""}
              >
                <td>{index + 1}</td>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox border border-black w-5 h-5"
                      checked={selectedGigs.includes(gig._id)}
                      onChange={() => handleCheckboxClick(gig._id)}
                    />
                  </label>
                </th>
                <td>{gig?.gigTitle}</td>
                <td>{gig?.clientName}</td>
                <td>{gig?.gigType}</td>
                <td>{new Date(gig.postedDate).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    {usersData?.role === "Admin" ||
                    usersData?.role === "Manager" ? null : (
                      <button
                        className="bg-green-500 hover:bg-green-400 p-2 text-white text-2xl"
                        onClick={() => handleEditJob(gig)}
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                      onClick={() => handleViewGig(gig)}
                    >
                      <CiViewBoard />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                      onClick={() => handleSingleDelete(gig._id)}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View gig modal */}
      <dialog id="Modal_Gig_View" className="modal">
        <ModalViewGigs GigData={viewGigData} />
      </dialog>

      <dialog id="Create_New_Gig" className="modal">
        <ModalAddGig refetch={refetch}></ModalAddGig>
      </dialog>

      <dialog id="Edit_Gig" className="modal">
        <ModalEditGig editGigData={editGigData} refetch={refetch} />
      </dialog>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[1000px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Gigs</h2>
            <p className="font-bold">Selected Gigs:</p>
            <ul className="mb-4">
              {selectedGigs.map((gigId) => {
                const gig = postedGigData.find((gig) => gig._id === gigId);
                return (
                  <li key={gigId} className="w-[500px] mt-5">
                    <p className="grid grid-cols-2">
                      <span className="font-bold">Title :</span> {gig.gigTitle}
                    </p>
                    <p className="grid grid-cols-2">
                      <span className="font-bold">Name :</span> {gig.clientName}
                    </p>
                    <p className="grid grid-cols-2">
                      <span className="font-bold">Type :</span> {gig.clientType}
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

export default ManageGigs;
