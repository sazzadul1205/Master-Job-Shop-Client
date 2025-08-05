import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

import { FaChevronDown } from "react-icons/fa";

// Assets
import formUp from "../../../assets/EmployerLayout/formUp.png";

const ManageJobApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // 1. Fetch Jobs Posted by the Current User
  const {
    data: JobsData,
    isLoading: JobsIsLoading,
    error: JobsError,
  } = useQuery({
    queryKey: ["JobsData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Jobs?postedBy=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email, // wait for user to load
  });

  // 2. Extract job IDs (when JobsData is ready)
  const jobIds = JobsData?.map((job) => job._id) || [];

  // 3. Fetch All Applications for those job IDs
  const {
    data: JobApplicationsData,
    isLoading: ApplicationsLoading,
    error: ApplicationsError,
  } = useQuery({
    queryKey: ["JobApplicationsData", jobIds],
    queryFn: () => {
      const query = jobIds.map((id) => `jobIds[]=${id}`).join("&");
      return axiosPublic
        .get(`/JobApplications?${query}`)
        .then((res) => res.data);
    },
    enabled: jobIds.length > 0,
  });

  // 4. Combine jobs with their respective applicants
  const JobsWithApplicants = JobsData?.map((job) => {
    const applicants =
      JobApplicationsData?.filter((app) => app.jobId === job._id) || [];

    return {
      _id: job?._id,
      title: job?.title,
      category: job?.category,
      type: job?.type,
      level: job?.level,
      experience: job?.experience,
      location: job?.location,
      remote: job?.remote,
      hybrid: job?.hybrid,
      onsite: job?.onsite,
      salaryRange: job?.salaryRange,
      isNegotiable: job?.isNegotiable,
      postedBy: job?.postedBy,
      postedAt: job?.postedAt,
      Applicants: applicants,
    };
  });

  console.log(JobsWithApplicants);

  // Loading / Error UI
  if (ApplicationsLoading || JobsIsLoading || loading) return <Loading />;
  if (ApplicationsError || JobsError) return <Error />;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <img
            src={formUp}
            alt="Manage Job Applicant Icons"
            className="w-6 h-6 align-middle"
          />
          Manage Job Applications
        </h3>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      <div className="px-4 pt-4 space-y-6">
        {JobsWithApplicants?.map((job) => (
          <div
            key={job._id}
            className="w-full border border-gray-200 rounded-xl p-6 bg-white shadow hover:shadow-lg transition duration-300"
          >
            {/* Header: Title & Category */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-900">
                {job.title}
              </h2>

              {/* Category */}
              <div className="text-sm text-gray-700">
                <span className="font-medium">Category:</span> {job.category}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 mb-4" />

            {/* Job Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-800 mb-4">
              {/* Level */}
              <div>
                <span className="font-medium text-gray-900">Level:</span>{" "}
                {job.level}
              </div>

              {/* Type */}
              <div>
                <span className="font-medium text-gray-900">Type:</span>{" "}
                {job.type}
              </div>

              {/* Location */}
              <div>
                <span className="font-medium text-gray-900">Location:</span>{" "}
                {job.location}
              </div>

              {/* Mode */}
              <div>
                <span className="font-medium text-gray-900">Mode:</span>{" "}
                {(job.onsite && "Onsite") ||
                  (job.remote && "Remote") ||
                  (job.hybrid && "Hybrid")}{" "}
              </div>

              {/* Salary */}
              <div>
                <span className="font-medium text-gray-900">Salary:</span>{" "}
                {job.salaryRange.min} - {job.salaryRange.max}{" "}
                {job.salaryRange.currency}{" "}
                {job.isNegotiable && (
                  <span className="text-blue-600 text-xs ml-1">
                    (Negotiable)
                  </span>
                )}
              </div>

              {/* Posted At */}
              <div>
                <span className="font-medium text-gray-900">Posted on:</span>{" "}
                {new Date(job.postedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 mb-4" />

            {/* Footer: Applicants & Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm font-medium text-gray-700">
                Applicants:{" "}
                <span className="text-gray-900">{job.Applicants.length}</span>
              </div>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline transition">
                <FaChevronDown className="text-base" />
                View Applicants
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ManageJobApplications;
