import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalViewJobs from "./ModalViewJobs/ModalViewJobs";
import { AuthContext } from "../../../Provider/AuthProvider";
import { FaEdit, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import ModalAddJob from "./ModalAddJob/ModalAddJob";
import ModalEditJob from "./ModalEditJob/ModalEditJob";

const ManageJobs = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useContext(AuthContext);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [viewJobData, setViewJobData] = useState(null);
  const [editJobData, setEditJobData] = useState(null);
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
      ? "/Posted-Job"
      : `/Posted-Job?email=${user?.email}`;

  const {
    data: PostedJobData = [],
    isLoading: PostedJobDataIsLoading,
    error: PostedJobDataError,
    refetch,
  } = useQuery({
    queryKey: ["PostedJobData", jobQueryKey],
    queryFn: () => axiosPublic.get(jobQueryKey).then((res) => res.data),
    enabled: !!user?.email, // Only run this query if user.email is defined
  });

  // Use effect to simulate loading delay
  useEffect(() => {
    if (!usersDataIsLoading && !PostedJobDataIsLoading) {
      const timer = setTimeout(() => {
        setLoadingDelay(false); // Set loadingDelay to false after 1 second
      }, 1000); // Adjust the time as needed

      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [usersDataIsLoading, PostedJobDataIsLoading]);

  if (loading || loadingDelay) {
    return <Loader />; // Show loader while loading
  }

  // Handle errors gracefully
  if (PostedJobDataError || usersDataError) {
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

  const handleEditJob = (job) => {
    setEditJobData(job); // Set the job data for editing
    document.getElementById("Edit_Job").showModal();
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Jobs
      </p>

      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch className="h-4 w-4 opacity-70" />
        </label>
      </div>

      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 w-48 py-1 text-lg text-white font-bold"
          onClick={() => document.getElementById("Create_New_Job").showModal()}
        >
          + Add New Job
        </button>
        <button
          className="bg-red-500 hover:bg-red-300 w-48 py-1 text-lg text-white font-bold"
          onClick={handleDeleteSelectedJobs}
        >
          Delete
        </button>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
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
                      className="checkbox border border-black w-5 h-5"
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
                    {usersData?.role === "Admin" ||
                    usersData?.role === "Manager" ? null : (
                      <button
                        className="bg-green-500 hover:bg-green-400 p-2 text-white text-2xl"
                        onClick={() => handleEditJob(job)}
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                      onClick={() => handleViewJob(job)}
                    >
                      <CiViewBoard />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                      onClick={() => handleSingleDelete(job._id)}
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

      <dialog id="Modal_Job_View" className="modal">
        <ModalViewJobs jobData={viewJobData} />
      </dialog>

      <dialog id="Create_New_Job" className="modal">
        <ModalAddJob refetch={refetch} />
      </dialog>

      <dialog id="Edit_Job" className="modal">
        <ModalEditJob editJobData={editJobData} refetch={refetch} />
      </dialog>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[1000px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Jobs</h2>
            <p>Selected Jobs:</p>
            <ul className="mb-4">
              {selectedJobs.map((jobId) => {
                const job = PostedJobData.find((job) => job._id === jobId);
                return <li key={jobId}>{job?.jobTitle}</li>;
              })}
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className="textarea textarea-bordered w-full"
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

export default ManageJobs;
