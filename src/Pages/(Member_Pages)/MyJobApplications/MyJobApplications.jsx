// Packages
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Tooltip } from "react-tooltip";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Assets
import JobApplication from "../../..//assets/Navbar/Member/JobApplication.png";

const MyJobApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Step 1: Fetch applications
  const {
    data: JobApplicationsData = [],
    isLoading: JobApplicationsIsLoading,
    error: JobApplicationsError,
  } = useQuery({
    queryKey: ["JobApplicationsData"],
    queryFn: () =>
      axiosPublic
        .get(`/JobApplications?email=${user?.email}`)
        .then((res) => res.data),
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
  } = useQuery({
    queryKey: ["JobsData", uniqueJobIds],
    queryFn: () =>
      axiosPublic
        .get(`/Jobs?jobIds=${uniqueJobIds.join(",")}`)
        .then((res) => res.data),
    enabled: !!user?.email && uniqueJobIds.length > 0,
  });

  if (loading || JobApplicationsIsLoading || JobsIsLoading) return <Loading />;
  if (JobApplicationsError || JobsError) return <Error />;

  // Merge application & job data
  const mergedData = JobApplicationsData.map((application) => {
    const job = JobsData.find((job) => job._id === application.jobId);
    return {
      ...application,
      job,
    };
  }).filter((item) => item.job); // filter out missing jobs

  console.log(mergedData);

  return (
    <section className="px-4 md:px-12 min-h-screen">
      <h3 className="text-3xl font-bold text-white text-center pb-2">
        My Applied Jobs
      </h3>

      <p className="bg-white py-[2px] w-1/3 mx-auto" />

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
                  <td className="px-5 py-4 text-center">
                    <>
                      <button
                        id={`job-btn-${job?._id}`} // Unique ID per button
                        data-tooltip-content="View Application"
                        className="bg-white hover:bg-blue-300/50 border-2 border-blue-600 rounded-full p-3 cursor-pointer transition"
                        onClick={() => console.log("View job", job?._id)}
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
                  </td>
                </tr>
              ))
            ) : (
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
    </section>
  );
};

export default MyJobApplications;
