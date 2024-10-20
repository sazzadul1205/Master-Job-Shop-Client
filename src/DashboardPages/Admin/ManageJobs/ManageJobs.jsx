import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { CiMenuKebab, CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalViewJobs from "./ModalViewJobs/ModalViewJobs";
import { AuthContext } from "../../../Provider/AuthProvider";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageJobs = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [viewJobData, setViewJobData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const {
    data: PostedJobData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["PostedJobData"],
    queryFn: () => axiosPublic.get(`/Posted-Job`).then((res) => res.data),
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
    setSelectedJobs((prevSelectedJobs) =>
      prevSelectedJobs.includes(id)
        ? prevSelectedJobs.filter((jobId) => jobId !== id)
        : [...prevSelectedJobs, id]
    );
  };

  const handleDeleteSelectedJobs = () => {
    if (selectedJobs.length === 0) {
      alert("No jobs selected for deletion.");
      return;
    }
    setShowDeleteModal(true);
  };

  const handleSingleDelete = (jobId) => {
    setSelectedJobs([jobId]);
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
    const deleteJobLogData = selectedJobs.map((jobId) => {
      const job = PostedJobData.find((job) => job._id === jobId);
      return {
        DeletedBy: user.email,
        PostedBy: job.postedBy.email,
        DeletedDate: formattedDateTime,
        Type: "Posted-Job",
        deletedContent: job.jobTitle,
        reason: data.deleteReason,
      };
    });

    try {
      await axiosPublic.post(`/Delete-Log`, deleteJobLogData);
      await axiosPublic.delete(`/Posted-Job/delete`, {
        data: { jobsToDelete: selectedJobs },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Jobs successfully deleted.",
        confirmButtonText: "Okay",
      });
      reset();
      setShowDeleteModal(false);
      setSelectedJobs([]);
      refetch();
    } catch (error) {
      console.error("Error deleting jobs:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete jobs. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleViewJob = (job) => {
    setViewJobData(job);
    document.getElementById("Modal_Job_View").showModal();
  };

  const handleApproveJob = async (jobId) => {
    try {
      await axiosPublic.patch(`/Posted-Job/${jobId}/approve`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Job successfully approved.",
        confirmButtonText: "Okay",
      });

      refetch();
    } catch (error) {
      console.error("Error approving the job:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to approve the job. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage All Jobs
      </p>

      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch className="h-4 w-4 opacity-70" />
        </label>
      </div>

      <div className="flex justify-between mx-5 my-2 items-center">
        <button
          className="bg-red-500 hover:bg-red-300 px-10 py-2 text-white font-bold"
          onClick={handleDeleteSelectedJobs}
        >
          Delete
        </button>
        <p className="font-bold text-2xl">
          Total Jobs : {PostedJobData.length}
        </p>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Check</th>
              <th>Job Title</th>
              <th>Company Name</th>
              <th>State</th>
              <th>Posted Date</th>
              <th>Status</th> {/* New Status Column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {PostedJobData.map((job, index) => {
              const availableUntilDate = new Date(job.availableUntil);
              const isExpired = availableUntilDate < new Date();

              return (
                <tr
                  key={job._id}
                  className={`${
                    selectedJobs.includes(job._id) ? "bg-red-50" : ""
                  } ${isExpired ? "bg-gray-300" : ""}`} // Gray out if expired
                >
                  <td>{index + 1}</td>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox border border-black w-5 h-5"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => handleCheckboxClick(job._id)}
                      />
                    </label>
                  </th>
                  <td>{isExpired ? "Expired" : job.jobTitle}</td>{" "}
                  {/* Show "Expired" if true */}
                  <td>{job?.companyName}</td>
                  <td>{job?.state}</td>
                  <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                  <td>
                    {isExpired ? (
                      <p className="text-red-500 font-bold">Expired</p>
                    ) : (
                      "Active"
                    )}
                  </td>{" "}
                  {/* Display status */}
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
                        className="dropdown-content bg-white border border-black z-50  p-1 shadow-xl flex gap-2"
                      >
                        <li>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                            onClick={() => handleViewJob(job)}
                            hidden={isExpired}
                          >
                            <CiViewBoard />
                          </button>
                        </li>
                        <li>
                          <button
                            className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                            onClick={() => handleSingleDelete(job._id)}
                          >
                            <MdDelete />
                          </button>
                        </li>
                        {job.state === "In-Progress" && !isExpired && (
                          <li>
                            <button
                              className="bg-green-500 hover:bg-green-400 p-2 text-white text-[20px]"
                              onClick={() => handleApproveJob(job._id)}
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

      {/* Modal for Viewing Jobs */}
      <dialog id="Modal_Job_View" className="modal">
        <ModalViewJobs jobData={viewJobData} />
      </dialog>

      {/* Modal for Deleting Jobs */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Jobs</h2>
            <p className="font-bold">Selected Jobs:</p>
            <ul className="mb-4 w-[400px]">
              {selectedJobs.map((jobId) => {
                const job = PostedJobData.find((job) => job._id === jobId);
                return (
                  <li
                    key={jobId}
                    className="mt-2 border border-gray-200 p-2 hover:bg-gray-200 hover:text-lg"
                  >
                    <p className="flex">
                      <span className="font-bold w-24">Job Name: </span>
                      {job?.jobTitle}
                    </p>
                    <p className="flex">
                      <span className="font-bold w-24">Client Name:</span>
                      {job?.companyName}
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

export default ManageJobs;
