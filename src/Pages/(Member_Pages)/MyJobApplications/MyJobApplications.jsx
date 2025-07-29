import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
import { FaInfo } from "react-icons/fa";

// Assets
import JobApplication from "../../../assets/Navbar/Member/JobApplication.png";

// Modal
import JobDetailsModal from "../../(Public_Pages)/Home/FeaturedJobs/JobDetailsModal/JobDetailsModal";
import MyJobApplicationModal from "./MyJobApplicationModal/MyJobApplicationModal";

const MyJobApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Hooks
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [applicationsList, setApplicationsList] = useState([]);
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // Fetch Job Applications
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
        return Array.isArray(data) ? data : [data];
      }),
    enabled: !!user?.email,
  });

  // Get unique job IDs from JobApplicationsData
  const jobIds = JobApplicationsData.map((app) => app.jobId);
  const uniqueJobIds = [...new Set(jobIds)];

  // Fetch Jobs Data
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
        return Array.isArray(data) ? data : [data];
      }),
    enabled: !!user?.email && uniqueJobIds.length > 0,
  });

  useEffect(() => {
    if (JobApplicationsData.length > 0) {
      setApplicationsList(JobApplicationsData);
    }
  }, [JobApplicationsData]);

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
          // Optimistically remove deleted app from local state
          setApplicationsList((prev) => prev.filter((app) => app._id !== id));

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The application has been successfully removed.",
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Trigger silent refetch to keep data fresh without loading UI
          await refetchApplications({ throwOnError: false });
          await JobsRefetch({ throwOnError: false });
        } else {
          throw new Error("Unexpected server response.");
        }
      } catch (err) {
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

  // UI Loading / Error State
  if (
    loading ||
    (JobApplicationsIsLoading && JobApplicationsData.length === 0) ||
    (JobsIsLoading && JobsData.length === 0)
  )
    return <Loading />;
  if (JobApplicationsError || JobsError) return <Error />;

  // Merge data
  const mergedData = applicationsList
    .map((application) => {
      const job = JobsData.find((job) => job._id === application.jobId);
      return {
        ...application,
        job,
      };
    })
    .filter((item) => item.job);

  return (
    <section className="px-4 md:px-12 min-h-screen ">
      {/* Title */}
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Applied Jobs
      </h3>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {mergedData.length > 0 ? (
          mergedData.map(({ job, appliedAt, _id }) => (
            <article
              key={_id}
              className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-6 min-h-[400px]"
            >
              {/* Company Logo & Job Title */}
              <div className="flex items-center gap-4 mb-4">
                {job?.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={`${job.company.name} logo`}
                    className="w-12 h-12 object-contain rounded"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-bold text-xl">
                    {job?.company?.name?.[0] || "?"}
                  </div>
                )}
                <div className="flex flex-col">
                  <h4
                    className="text-xl font-semibold text-gray-900 truncate max-w-xs"
                    title={job?.title}
                  >
                    {job?.title || "N/A"}
                  </h4>
                  <p
                    className="text-sm text-gray-600 truncate max-w-xs"
                    title={job?.company?.name}
                  >
                    {job?.company?.name || "N/A"}
                  </p>
                </div>
              </div>

              {/* Job Details Grid */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-700 text-sm mb-5">
                <div>
                  <dt className="font-semibold">Location:</dt>
                  <dd>{job?.location || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Type:</dt>
                  <dd>{job?.type || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Level:</dt>
                  <dd>{job?.level || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Experience:</dt>
                  <dd>{job?.experience || "N/A"}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Salary:</dt>
                  <dd>
                    {job?.salaryRange
                      ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()} ${
                          job.salaryRange.currency || ""
                        }`
                      : "Not disclosed"}
                    {job?.isNegotiable && (
                      <span className="ml-1 text-xs italic">(Negotiable)</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Application Deadline:</dt>
                  <dd>
                    {job?.application?.applicationDeadline
                      ? new Date(
                          job.application.applicationDeadline
                        ).toLocaleDateString()
                      : "N/A"}
                  </dd>
                </div>
              </dl>

              {/* Tags & Perks */}
              <div className="flex flex-wrap gap-2 mb-5">
                {/* Tags */}
                {job?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}

                {/* Remote/Hybrid/Onsite badges */}
                {job?.remote && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Remote
                  </span>
                )}
                {job?.hybrid && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Hybrid
                  </span>
                )}
                {!job?.remote && !job?.hybrid && job?.onsite && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Onsite
                  </span>
                )}
              </div>

              {/* Applied Time */}
              <p className="text-xs text-gray-500 mb-5">
                Applied{" "}
                {appliedAt
                  ? formatDistanceToNow(new Date(appliedAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </p>

              {/* Actions */}
              <div className="flex justify-end items-center gap-4">
                {/* View Application */}
                <button
                  id={`job-btn-${job._id}`}
                  data-tooltip-content="View Application"
                  className="flex items-center justify-center w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedApplicationID(_id);
                    document
                      .getElementById("View_Application_Modal")
                      .showModal();
                  }}
                  aria-label="View Application"
                >
                  <img
                    src={JobApplication}
                    alt="Job Application"
                    className="w-5"
                  />
                </button>
                <Tooltip
                  anchorSelect={`#job-btn-${job._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />

                {/* Delete */}
                <button
                  id={`job-btn-cross-${job._id}`}
                  data-tooltip-content="Delete Application"
                  className="flex items-center justify-center w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleDeleteApplication(_id)}
                  aria-label="Delete Application"
                >
                  <ImCross size={18} />
                </button>
                <Tooltip
                  anchorSelect={`#job-btn-cross-${job._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />

                {/* View Job Details */}
                <button
                  id={`job-details-btn-${job._id}`}
                  data-tooltip-content="View Job Details"
                  className="flex items-center justify-center w-11 h-11 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedJobID(job._id);
                    document.getElementById("Jobs_Details_Modal").showModal();
                  }}
                  aria-label="View Job Details"
                >
                  <FaInfo size={18} />
                </button>
                <Tooltip
                  anchorSelect={`#job-details-btn-${job._id}`}
                  place="top"
                  className="!text-sm !bg-gray-800 !text-white !py-1 !px-3 !rounded"
                />
              </div>
            </article>
          ))
        ) : (
          <div className="text-center col-span-full mt-24 px-6 max-w-xl mx-auto">
            <p className="text-2xl font-medium text-white mb-3">
              You haven’t applied to any jobs yet.
            </p>
            <p className="text-gray-200 font-semibold text-lg mb-5">
              Explore the available job openings and take the first step toward
              your next opportunity.
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-200 text-black font-semibold py-3 px-10 shadow-lg hover:shadow-xl rounded transition"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* View Application Modal */}
      <dialog id="View_Application_Modal" className="modal">
        <MyJobApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* View Job Details Modal */}
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
