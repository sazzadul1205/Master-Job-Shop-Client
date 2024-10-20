import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { useContext, useState } from "react";
import { CiMenuKebab, CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalViewGigs from "./ModalViewGigs/ModalViewGigs";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import ModalGigApprove from "./ModalGigApprove/ModalGigApprove";

const ManageGigs = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [selectedGigs, setSelectedGigs] = useState([]);
  const [viewGigData, setViewGigData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const {
    data: postedGigData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["PostedGigData"],
    queryFn: () => axiosPublic.get(`/Posted-Gig`).then((res) => res.data),
  });

  if (isLoading) {
    return <Loader />;
  }

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

  const handleCheckboxClick = (id) => {
    setSelectedGigs((prevSelectedGigs) =>
      prevSelectedGigs.includes(id)
        ? prevSelectedGigs.filter((gigId) => gigId !== id)
        : [...prevSelectedGigs, id]
    );
  };

  const handleSingleDelete = (gigID) => {
    setSelectedGigs([gigID]);
    setShowDeleteModal(true);
  };

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
        DeletedBy: user.email,
        PostedBy: gig?.postedBy,
        DeletedDate: formattedDateTime,
        Type: "Posted-Gig",
        deletedContent: gig?.gigTitle,
        reason: data.deleteReason,
      };
    });

    try {
      await axiosPublic.post(`/Delete-Log`, deleteGigLogData);
      await axiosPublic.delete(`/Posted-Gig/delete`, {
        data: { gigsToDelete: selectedGigs },
      });

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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete gigs. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleViewGig = (gig) => {
    setViewGigData(gig);
    document.getElementById("Modal_Gig_View").showModal();
  };

  const isExpired = (expirationDate) => {
    const currentDate = new Date();
    const expDate = new Date(expirationDate);
    return currentDate > expDate;
  };

  const handleOpenApprovalModal = (gig) => {
    setViewGigData(gig);
    setShowApprovalModal(true);
  };

  const handleApproveGig = (gigID, rating) => {
    // Logic to update the gig's state to 'approved' and set its rating
    // Use axiosPublic to send a request to your API to approve the gig
    axiosPublic
      .patch(`/Posted-Gig/${gigID}`, { state: "Approved", rating })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: "Gig successfully approved.",
        });
        refetch(); // Refetch the gigs data to reflect changes
      })
      .catch((error) => {
        console.error("Error approving gig:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to approve gig. Please try again.",
        });
      });
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Gigs
      </p>

      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input type="text" className="grow" placeholder="Search" />
            <FaSearch />
          </label>
        </div>
      </div>

      <div className="flex justify-between mx-5 my-2">
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
        <p className="font-bold text-2xl">
          Total Gigs : {postedGigData.length}
        </p>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Check</th>
              <th>Gig Title</th>
              <th>Gig Type</th>
              <th>State</th>
              <th>Posted Date</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {postedGigData.map((gig, index) => {
              const expired = isExpired(gig.expirationDate);
              return (
                <tr
                  key={gig._id}
                  className={`${
                    selectedGigs.includes(gig._id) ? "bg-red-50" : ""
                  } ${expired ? "bg-gray-300" : ""}`}
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
                  <td>{gig?.gigType}</td>
                  <td>{gig?.state}</td>
                  <td>{new Date(gig.postedDate).toLocaleDateString()}</td>
                  <td>
                    {expired ? (
                      <p className="text-red-500 font-bold">Expired</p>
                    ) : (
                      "Active"
                    )}
                  </td>{" "}
                  <td>
                    <div className="dropdown dropdown-left">
                      <button
                        className="text-xl p-2 border-2 border-black hover:bg-gray-200"
                        tabIndex={0}
                        role="button"
                      >
                        <CiMenuKebab />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content bg-white border border-black z-50 p-1 shadow-xl flex gap-2"
                      >
                        <li>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                            onClick={() => handleViewGig(gig)}
                            hidden={expired}
                          >
                            <CiViewBoard />
                          </button>
                        </li>
                        <li>
                          <button
                            className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                            onClick={() => handleSingleDelete(gig._id)}
                          >
                            <MdDelete />
                          </button>
                        </li>
                        {gig.state === "In-Progress" && !expired && (
                          <li>
                            <button
                              className="bg-green-500 hover:bg-green-400 p-2 text-white text-[20px]"
                              onClick={() => handleOpenApprovalModal(gig)}
                            >
                              Approve
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dialog id="Modal_Gig_View" className="modal">
        <ModalViewGigs GigData={viewGigData} />
      </dialog>

      {showApprovalModal && (
        <ModalGigApprove
          gigData={viewGigData}
          onApprove={handleApproveGig}
          onClose={() => setShowApprovalModal(false)}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Gigs</h2>
            <p className="font-bold">Selected Gigs:</p>
            <ul className="mb-4 w-[400px]">
              {selectedGigs.map((gigId) => {
                const gig = postedGigData.find((gig) => gig._id === gigId);
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-black font-bold text-xl">
                    Reason for Deletion:
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered bg-white border-black rounded-none h-28"
                  {...register("deleteReason", { required: true })}
                  placeholder="Enter reason for deletion"
                ></textarea>
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

export default ManageGigs;
