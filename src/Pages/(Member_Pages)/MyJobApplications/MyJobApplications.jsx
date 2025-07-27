import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { ImCross } from "react-icons/im";

// Assets
import JobApplication from "../../..//assets/Navbar/Member/JobApplication.png";

// Modal
import MyJobApplicationModal from "./MyJobApplicationModal/MyJobApplicationModal";
import JobDetailsModal from "../../(Public_Pages)/Home/FeaturedJobs/JobDetailsModal/JobDetailsModal";
import { FaInfo } from "react-icons/fa";

const MyJobApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Select Application
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);
  const [selectedJobID, setSelectedJobID] = useState(null);

  // Step 1: Fetch applications
  const {
    data: JobApplicationsData = [],
    isLoading: JobApplicationsIsLoading,
    error: JobApplicationsError,
    refetch: refetchApplications,
  } = useQuery({
    queryKey: ["JobApplicationsData"],
    queryFn: () =>
      axiosPublic.get(`/JobApplications?email=${user?.email}`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data]; // normalize to array
      }),
    enabled: !!user?.email,
  });

  // Step 2: Extract unique jobIds
  const jobIds = JobApplicationsData.map((app) => app.jobId);
  const uniqueJobIds = [...new Set(jobIds)];

  // Step 3: Fetch jobs
  const {
    data: JobsData = [],
    isLoading: JobsIsLoading,
    error: JobsError,
    refetch: JobsRefetch,
  } = useQuery({
    queryKey: ["JobsData", uniqueJobIds],
    queryFn: () =>
      axiosPublic.get(`/Jobs?jobIds=${uniqueJobIds.join(",")}`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data]; // normalize to array
      }),
    enabled: !!user?.email && uniqueJobIds.length > 0,
  });

  // Refetch All
  const refetchAll = async () => {
    await refetchApplications();
    await JobsRefetch();
  };

  // UI Error / Loading
  if (loading || JobApplicationsIsLoading || JobsIsLoading) return <Loading />;
  if (JobApplicationsError || JobsError) return <Error />;

  // Merge application & job data
  const mergedData = JobApplicationsData.map((application) => {
    const job = JobsData.find((job) => job._id === application.jobId);
    return {
      ...application,
      job,
    };
  }).filter((item) => item.job);

  // Delete Application Handler
  const handleDeleteApplication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosPublic.delete(`/JobApplications/${id}`);

        if (res.status === 200) {
          // Refetch updated data
          await refetchAll();

          // Temporary success toast (auto-dismiss)
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
        // Show detailed error
        Swal.fire({
          icon: "error",
          title: "Failed to delete",
          text:
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <section className="px-4 md:px-12 min-h-screen">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Applied Jobs
      </h3>

      {/* Divider */}
      <p className="bg-white py-[2px] w-1/3 mx-auto" />

      {/* Table */}
      <div className="overflow-x-auto shadow mt-5">
        <table className="min-w-full text-sm text-gray-800">
          {/* Table Header */}
          <thead className="bg-gray-500 border-b text-xs text-white border border-black uppercase tracking-wide cursor-default">
            <tr>
              <th className="px-5 py-4 text-left">Title</th>
              <th className="px-5 py-4 text-left">Company</th>
              <th className="px-5 py-4 text-left">Location</th>
              <th className="px-5 py-4 text-left">Type</th>
              <th className="px-5 py-4 text-left">Level</th>
              <th className="px-5 py-4 text-left">Salary</th>
              <th className="px-5 py-4 text-left">Applied</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {mergedData.length > 0 ? (
              mergedData.map(({ job, appliedAt, _id }) => (
                <tr
                  key={_id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {/* Title */}
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {job?.title || "N/A"}
                  </td>

                  {/* Company */}
                  <td className="px-5 py-4">{job?.company?.name || "N/A"}</td>

                  {/* Location */}
                  <td className="px-5 py-4">{job?.location || "N/A"}</td>

                  {/* Type */}
                  <td className="px-5 py-4">{job?.type || "N/A"}</td>

                  {/* Level */}
                  <td className="px-5 py-4">{job?.level || "N/A"}</td>

                  {/* Salary Range */}
                  <td className="px-5 py-4">
                    {job.salaryRange
                      ? `${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()} ${
                          job.salaryRange.currency || ""
                        }`
                      : "N/A"}
                  </td>

                  {/* Applied Ago */}
                  <td className="px-5 py-4 text-gray-600">
                    {appliedAt
                      ? formatDistanceToNow(new Date(appliedAt), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="flex items-center gap-2  px-5 py-4 text-center">
                    {/* View Button */}
                    <>
                      <button
                        id={`job-btn-${job?._id}`}
                        data-tooltip-content="View Application"
                        className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 cursor-pointer transition"
                        onClick={() => {
                          setSelectedApplicationID({ _id });
                          document
                            .getElementById("View_Application_Modal")
                            .showModal();
                        }}
                      >
                        <img
                          src={JobApplication}
                          alt="Job Applications"
                          className="w-5"
                        />
                      </button>

                      <Tooltip
                        anchorSelect={`#job-btn-${job?._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                      />
                    </>

                    {/* Delete Button */}
                    <>
                      <div
                        id={`job-btn-cross-${job?._id}`}
                        data-tooltip-content="Delete Application"
                        className="p-3 text-lg rounded-full border-2 border-red-500 hover:bg-red-200 cursor-pointer"
                        onClick={() => {
                          handleDeleteApplication(_id);
                        }}
                      >
                        <ImCross />
                      </div>

                      <Tooltip
                        anchorSelect={`#job-btn-cross-${job?._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                      />
                    </>

                    {/* Details Button */}
                    <>
                      <div
                        id={`job-details-btn-${job?._id}`}
                        data-tooltip-content="View Job Details"
                        className="p-3 text-lg rounded-full border-2 border-yellow-500 hover:bg-yellow-200 cursor-pointer"
                        onClick={() => {
                          setSelectedJobID(job?._id);
                          document
                            .getElementById("Jobs_Details_Modal")
                            .showModal();
                        }}
                      >
                        <FaInfo />
                      </div>

                      <Tooltip
                        anchorSelect={`#job-details-btn-${job?._id}`}
                        place="top"
                        className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                      />
                    </>
                  </td>
                </tr>
              ))
            ) : (
              // No job applications found Fallback
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  No job applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="View_Application_Modal" className="modal">
        <MyJobApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Jobs Modal */}
      <dialog id="Jobs_Details_Modal" className="modal">
        <JobDetailsModal
          selectedJobID={selectedJobID}
          setSelectedJobID={setSelectedJobID}
        />
      </dialog>
    </section>
  );
};

export default MyJobApplications;
