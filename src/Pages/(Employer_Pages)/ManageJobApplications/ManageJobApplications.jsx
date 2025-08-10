import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaAngleLeft,
  FaChevronUp,
  FaAngleRight,
  FaChevronDown,
} from "react-icons/fa";

// Assets
import formUp from "../../../assets/EmployerLayout/formUp.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Component - Table
import JobApplicantTable from "./JobApplicantTable/JobApplicantTable";

// Modal
import AcceptJobApplicationModal from "./AcceptJobApplicationModal/AcceptJobApplicationModal";
import ViewApplicantInterviewModal from "./ViewApplicantInterviewModal/ViewApplicantInterviewModal";
import MyJobApplicationModal from "../../(Member_Pages)/MyJobApplications/MyJobApplicationModal/MyJobApplicationModal";

const ManageJobApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Pagination States
  const [pageStates, setPageStates] = useState({});

  // Expanded Job Id
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Selected Application ID
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // Items Per Page
  const ITEMS_PER_PAGE = 5;

  // Fetching Jobs Data
  const {
    data: JobsData,
    isLoading: JobsIsLoading,
    error: JobsError,
    refetch: JobsRefetch,
  } = useQuery({
    queryKey: ["JobsData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Jobs?postedBy=${user?.email}`);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data]; // wrap single object in array
      return [];
    },
    enabled: !!user?.email,
  });

  // Getting Job Ids
  const jobIds = JobsData?.map((job) => job._id) || [];

  // Fetching Job Applications Data
  const {
    data: JobApplicationsData,
    isLoading: ApplicationsLoading,
    error: ApplicationsError,
    refetch: ApplicationsRefetch,
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

  // Combining Jobs and Job Applications Data
  const JobsWithApplicants = JobsData?.map((job) => {
    const applicants =
      JobApplicationsData?.filter((app) => app.jobId === job._id) || [];
    return { ...job, Applicants: applicants };
  });

  // Refetching Data
  const refetch = () => {
    JobsRefetch();
    ApplicationsRefetch();
  };

  // Loading / Error UI Handling
  if (ApplicationsLoading || JobsIsLoading || loading) return <Loading />;
  if (ApplicationsError || JobsError) return <Error />;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-3 px-5">
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <img
            src={formUp}
            alt="Manage Job Applicant Icons"
            className="w-6 h-6"
          />
          Manage Job Applications
        </h3>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Jobs Container */}
      <div className="px-4 pt-4 space-y-3">
        {JobsWithApplicants?.map((job, index) => {
          // Get the current page number for this job from the pageStates object
          // If there’s no entry yet, default to page 1
          const currentPage = pageStates[job._id] || 1;

          // Sort the job's applicants by their status
          // Order: No status first → Accepted → Rejected → Everything else
          const sortedApplicants = [...job.Applicants].sort((a, b) => {
            // Helper function to assign a numeric "rank" to each status
            const getOrder = (status) => {
              if (!status) return 0; // No status → highest priority
              if (status === "Accepted") return 1; // Accepted comes second
              if (status === "Rejected") return 2; // Rejected comes last
              return 3; // Any other status after that
            };

            // Compare two applicants based on their status order
            return getOrder(a.status) - getOrder(b.status);
          });

          // Slice the sorted list to get only the applicants for the current page
          const paginatedApplicants = sortedApplicants.slice(
            (currentPage - 1) * ITEMS_PER_PAGE, // Start index
            currentPage * ITEMS_PER_PAGE // End index (exclusive)
          );

          // Calculate the total number of pages based on the number of applicants
          const totalPages = Math.ceil(
            sortedApplicants.length / ITEMS_PER_PAGE
          );

          return (
            <div
              key={job._id}
              className="w-full border border-gray-200 rounded p-6 bg-white shadow hover:shadow-lg transition duration-300"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                {/* Title */}
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  # 0{index + 1}. {job.title}
                </h2>

                {/* Category */}
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Category:</span> {job.category}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-4" />

              {/* Content */}
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
                    (job.hybrid && "Hybrid")}
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

                {/* Posted On */}
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
              <hr className="border-gray-200" />

              {/* Applicants Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
                {/* Applicants Number */}
                <div className="flex text-sm font-medium text-gray-700 gap-4">
                  <p>
                    Applicants:{" "}
                    <span className="text-gray-900">
                      {job.Applicants.length}
                    </span>
                  </p>
                  {job.Applicants.filter((app) => app.status === "Accepted")
                    .length > 0 && (
                    <>
                      {" | "}
                      <p>
                        Accepted:{" "}
                        <span className="text-green-600 font-semibold">
                          {
                            job.Applicants.filter(
                              (app) => app.status === "Accepted"
                            ).length
                          }
                        </span>
                      </p>
                    </>
                  )}

                  {job.Applicants.filter((app) => app.status === "Rejected")
                    .length > 0 && (
                    <>
                      {" | "}
                      <p>
                        Rejected:{" "}
                        <span className="text-red-600 font-semibold">
                          {
                            job.Applicants.filter(
                              (app) => app.status === "Rejected"
                            ).length
                          }
                        </span>
                      </p>
                    </>
                  )}
                </div>

                {/* Open / Close Applicants Table Button */}
                {expandedJobId === job._id ? (
                  <button
                    onClick={() => setExpandedJobId(null)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:underline transition cursor-pointer"
                  >
                    <FaChevronUp className="text-base" />
                    Close Applicants
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setExpandedJobId(job._id);
                      setPageStates((prev) => ({ ...prev, [job._id]: 1 }));
                    }}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline transition cursor-pointer"
                  >
                    <FaChevronDown className="text-base" />
                    View Applicants
                  </button>
                )}
              </div>

              {/* Applicants Table */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedJobId === job._id ? "max-h-[1000px] pt-4" : "max-h-0"
                }`}
              >
                {/* Applicants Container */}
                <JobApplicantTable
                  refetch={refetch}
                  currentPage={currentPage}
                  ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                  paginatedApplicants={paginatedApplicants}
                  setSelectedApplicationID={setSelectedApplicationID}
                />

                {/* Pagination Controls */}
                {job.Applicants.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-center pt-2">
                    <div className="join">
                      {/* Left Button */}
                      <button
                        className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setPageStates((prev) => ({
                            ...prev,
                            [job._id]: currentPage - 1,
                          }))
                        }
                      >
                        <FaAngleLeft />
                      </button>

                      {/* Page Count */}
                      <button className="join-item bg-white text-black border border-gray-400 px-3 py-2 cursor-default">
                        Page {currentPage}
                      </button>

                      {/* Right Button */}
                      <button
                        className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setPageStates((prev) => ({
                            ...prev,
                            [job._id]: currentPage + 1,
                          }))
                        }
                      >
                        <FaAngleRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {/* View Application Modal */}
      <dialog id="View_Application_Modal" className="modal">
        <MyJobApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Accepted Application Modal */}
      <dialog id="Accepted_Application_Modal" className="modal">
        <AcceptJobApplicationModal
          refetch={refetch}
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* View Interview Modal */}
      <dialog id="View_Interview_Modal" className="modal">
        <ViewApplicantInterviewModal
          refetch={refetch}
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>
    </>
  );
};

export default ManageJobApplications;
