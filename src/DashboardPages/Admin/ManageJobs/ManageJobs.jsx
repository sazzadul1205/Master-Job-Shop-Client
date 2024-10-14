import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form"; // Import react-hook-form
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalViewJobs from "./ModalViewJobs/ModalViewJobs";
import { AuthContext } from "../../../Provider/AuthProvider";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert
import ModalAddJob from "./ModalAddJob/ModalAddJob";

const ManageJobs = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [viewJobData, setViewJobData] = useState(null); // state to hold job details for modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // control delete modal visibility

  const { register, handleSubmit, reset } = useForm();

  // Fetching Posted Job Data
  const {
    data: PostedJobData = [], // default to empty array
    isLoading: PostedJobDataIsLoading,
    error: PostedJobDataError,
    refetch,
  } = useQuery({
    queryKey: ["PostedJobData"],
    queryFn: () => axiosPublic.get(`/Posted-Job`).then((res) => res.data),
  });

  // Loading state
  if (PostedJobDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (PostedJobDataError) {
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

  // Handle checkbox click
  const handleCheckboxClick = (id) => {
    setSelectedJobs((prevSelectedJobs) =>
      prevSelectedJobs.includes(id)
        ? prevSelectedJobs.filter((jobId) => jobId !== id)
        : [...prevSelectedJobs, id]
    );
  };

  // Handle delete selected jobs (opens the modal)
  const handleDeleteSelectedJobs = () => {
    if (selectedJobs.length === 0) {
      alert("No jobs selected for deletion.");
      return;
    }
    setShowDeleteModal(true); // Show delete modal
  };

  // Handle single job deletion (opens the same modal)
  const handleSingleDelete = (jobId) => {
    setSelectedJobs([jobId]); // Set the single job as the only selected job
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Input
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
      // Post log data to the Delete-Log server
      await axiosPublic.post(`/Delete-Log`, deleteJobLogData);

      // Delete jobs by ID
      await axiosPublic.delete(`/Posted-Job/delete`, {
        data: { jobsToDelete: selectedJobs },
      });

      // Show success message
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
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete jobs. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  // Handle view job
  const handleViewJob = (job) => {
    setViewJobData(job); // Set the selected job details
    document.getElementById("Modal_Job_View").showModal(); // Show the modal
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Jobs
      </p>

      {/* Search */}
      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <FaSearch />
            </svg>
          </label>
        </div>
        <button className="bg-green-500 hover:bg-green-400 text-white font-semibold w-40 py-3">
          Add Jobs
        </button>
      </div>

      {/* Delete selected jobs button */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 px-10 py-2 text-white font-bold"
          onClick={() => document.getElementById("Create_New_Job").showModal()}
        >
          + Add New Job
        </button>
        <button
          className="bg-red-500 hover:bg-red-300 px-10 py-2 text-white font-bold"
          onClick={handleDeleteSelectedJobs}
        >
          Delete
        </button>
      </div>

      {/* Job Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Check</th>
              <th>Job Title</th>
              <th>Company Name</th>
              <th>Job Type</th>
              <th>Posted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through fetched jobs */}
            {PostedJobData.map((job, index) => (
              <tr
                key={job._id}
                className={selectedJobs.includes(job._id) ? "bg-red-50" : ""}
              >
                <td>{index + 1}</td>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox border border-black w-5 h-5 "
                      checked={selectedJobs.includes(job._id)}
                      onChange={() => handleCheckboxClick(job._id)}
                    />
                  </label>
                </th>

                <td>{job?.jobTitle}</td>
                <td>{job?.companyName}</td>
                <td>{job?.jobType}</td>
                <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                      onClick={() => handleViewJob(job)} // Pass job data on view
                    >
                      <CiViewBoard />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                      onClick={() => handleSingleDelete(job._id)} // Open delete modal for single job
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

      {/* View job modal */}
      <dialog id="Modal_Job_View" className="modal">
        <ModalViewJobs jobData={viewJobData} />
      </dialog>

      <dialog id="Create_New_Job" className="modal">
        <ModalAddJob refetch={refetch}></ModalAddJob>
      </dialog>

      {/* Delete modal (simple example) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[1000px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Jobs</h2>
            <p>Selected Jobs:</p>
            <ul className="mb-4">
              {selectedJobs.map((jobId) => {
                const job = PostedJobData.find((job) => job._id === jobId);
                return (
                  <li key={jobId} className="py-2">
                    <div className="flex-col">
                      <p>{jobId}</p>
                      <p>
                        <span className="font-semibold">Title: </span>
                        {job.jobTitle}
                      </p>
                      <p>
                        <span className="font-semibold">Name: </span>
                        {job.postedBy.name}
                      </p>
                      <p>
                        <span className="font-semibold">Email: </span>
                        {job.postedBy.email}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Delete Reason */}
              <div>
                <label htmlFor="deleteReason" className="block font-semibold">
                  Reason for Deletion:
                </label>

                <textarea
                  {...register("deleteReason")}
                  type="text"
                  id="deleteReason"
                  className="input input-bordered border border-gray-400 w-full mt-2 bg-white h-60"
                  required
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)} // Close modal
                  className="bg-gray-400 hover:bg-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 text-white"
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
