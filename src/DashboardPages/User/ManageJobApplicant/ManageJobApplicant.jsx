import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import React, { useContext, useState } from "react";
import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa";
import { CiViewBoard } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ModalAddJob from "../../Admin/ManageJobs/ModalAddJob/ModalAddJob";
import ModalViewJobs from "../../Admin/ManageJobs/ModalViewJobs/ModalViewJobs";
import ModalEditJob from "../../Admin/ManageJobs/ModalEditJob/ModalEditJob";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ManageJobApplicant = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [viewJobData, setViewJobData] = useState(null);
  const [editJobData, setEditJobData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  // Fetch Jobs data
  const {
    data: MyPostedJobs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyPostedJobs"],
    queryFn: () =>
      axiosPublic
        .get(`/Posted-Job?email=${user?.email}`)
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

  // Handle View Job
  const handleViewJob = (job) => {
    setViewJobData(job);
    document.getElementById("Modal_Job_View").showModal();
  };

  // Handle Edit Job
  const handleEditJob = (job) => {
    setEditJobData(job); // Set the job data for editing
    document.getElementById("Edit_Job").showModal();
  };

  // Handle Single Delete
  const handleSingleDelete = (jobId) => {
    setSelectedJobs([jobId]);
    setShowDeleteModal(true);
  };

  // Toggle function to expand/collapse the job details
  const toggleJobDetails = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null); // Collapse if already expanded
    } else {
      setExpandedJobId(jobId); // Expand if not already expanded
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
    const deleteJobLogData = selectedJobs.map((jobId) => {
      const job = MyPostedJobs.find((job) => job._id === jobId);
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

  // Applicant Delete Function
  const handleDeleteApplicant = (jobId, applicantEmail) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete applicant ${applicantEmail} from this job. This action cannot be undone.`,
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
          .delete(`/Posted-Job/${jobId}/applicant`, {
            data: { email: applicantEmail },
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: `Applicant ${applicantEmail} has been deleted.`,
              confirmButtonText: "Okay",
            });
            // Optionally, refetch data or update UI after deletion
            refetch();
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
        Manage Job Applicant
      </p>

      {/* New Job  */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 w-48 py-1 text-lg text-white font-bold"
          onClick={() => document.getElementById("Create_New_Job").showModal()}
        >
          + Add New Job
        </button>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-gray-300">
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Job Title</th>
              <th>Company Name</th>
              <th>Job Type</th>
              <th>Posted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {MyPostedJobs.map((job, index) => (
              <React.Fragment key={job._id}>
                {/* Main Table Row */}
                <tr>
                  <td>{index + 1}</td>
                  <td>{job?.jobTitle}</td>
                  <td>{job?.companyName}</td>
                  <td>{job?.jobType}</td>
                  <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      {/* Edit Job Button */}
                      <button
                        className="bg-green-500 hover:bg-green-400 p-2 text-white text-xl"
                        onClick={() => handleEditJob(job)}
                        aria-label="Edit Job"
                      >
                        <FaEdit />
                      </button>

                      {/* View Job Button */}
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-xl"
                        onClick={() => handleViewJob(job)}
                        aria-label="View Job"
                      >
                        <CiViewBoard />
                      </button>

                      {/* Delete Job Button */}
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-xl"
                        onClick={() => handleSingleDelete(job._id)}
                        aria-label="Delete Job"
                      >
                        <MdDelete />
                      </button>

                      {/* Toggle Up/Down Arrow Button */}
                      <button
                        className="bg-blue-300 hover:bg-blue-500 p-2 text-white text-xl"
                        onClick={() => toggleJobDetails(job._id)}
                      >
                        {expandedJobId === job._id ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Applicants Table */}
                <tr>
                  {expandedJobId === job._id && (
                    <td colSpan="6" className="py-1 px-1">
                      <div className="overflow-x-auto">
                        {job.PeopleApplied?.length > 0 ? (
                          <table className="table border border-gray-300 w-full">
                            <thead className="bg-blue-200 text-black">
                              <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>About Me</th>
                                <th>Applied Date</th>
                                <th>Resume</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {job.PeopleApplied.map((applicant, i) => (
                                <tr key={i}>
                                  <td>
                                    <img
                                      src={applicant.image}
                                      alt={applicant.name}
                                      className="w-12 h-12"
                                    />
                                  </td>
                                  <td>{applicant.name}</td>
                                  <td>{applicant.email}</td>
                                  <td>{applicant.AboutMe}</td>
                                  <td>
                                    {new Date(
                                      applicant.appliedDate
                                    ).toLocaleDateString()}
                                  </td>
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
                                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-xl "
                                      onClick={() =>
                                        handleDeleteApplicant(
                                          job._id,
                                          applicant.email
                                        )
                                      }
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
                            No one has applied yet.
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Jobs Modal */}
      <dialog id="Create_New_Job" className="modal">
        <ModalAddJob refetch={refetch} />
      </dialog>

      {/* View Jobs Modal  */}
      <dialog id="Modal_Job_View" className="modal">
        <ModalViewJobs jobData={viewJobData} />
      </dialog>

      {/* Edit Jobs Modal */}
      <dialog id="Edit_Job" className="modal">
        <ModalEditJob editJobData={editJobData} refetch={refetch} />
      </dialog>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Jobs</h2>
            <p>Selected Jobs:</p>
            <ul className="mb-4">
              {selectedJobs.map((jobId) => {
                const job = MyPostedJobs.find((job) => job._id === jobId);
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

export default ManageJobApplicant;
