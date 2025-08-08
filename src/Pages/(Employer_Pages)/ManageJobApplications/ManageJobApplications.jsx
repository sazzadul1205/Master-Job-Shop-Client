import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaRegClock,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";

// Assets
import formUp from "../../../assets/EmployerLayout/formUp.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

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

  // Handle Reject Applications
  const handleRejectApplicant = async (applicantId) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to reject this applicant?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reject",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        focusCancel: true,
      });

      if (!isConfirmed) return;

      const response = await axiosPublic.put(
        `/JobApplications/Status/${applicantId}`,
        {
          status: "Rejected",
        }
      );

      if (response.status !== 200) {
        console.error("Failed to reject applicant:", response.statusText);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to reject applicant. Please try again.",
          confirmButtonText: "Ok",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Applicant has been rejected.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      refetch();

      // Optionally trigger refresh or state update here
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonText: "Ok",
      });
    }
  };

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
          // Pagination
          const currentPage = pageStates[job._id] || 1;

          const sortedApplicants = [...job.Applicants].sort((a, b) => {
            const getOrder = (status) => {
              if (status === "Accepted") return 0;
              if (status === "Rejected") return 2;
              return 1;
            };
            return getOrder(a.status) - getOrder(b.status);
          });

          const paginatedApplicants = sortedApplicants.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
          );

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
                <div className="overflow-x-auto rounded shadow border border-gray-200 bg-white">
                  {/* Applicants Table */}
                  <table className="min-w-full bg-white text-sm text-gray-800">
                    {/* Applicants Table - Header */}
                    <thead className="bg-gray-100 border-b text-gray-900 text-left">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Applicant</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Applied On</th>
                        <th className="px-4 py-3">Resume</th>
                        <th className="px-4 py-3 text-center justify-end">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Applicants Table - Body */}
                    <tbody className="divide-y divide-gray-200">
                      {[
                        // Sort paginatedApplicants: Accepted first (0), others middle (1), Rejected last (2)
                        ...[...paginatedApplicants].sort((a, b) => {
                          const getOrder = (status) => {
                            if (status === "Accepted") return 0;
                            if (status === "Rejected") return 2;
                            return 1; // everything else goes in the middle
                          };
                          return getOrder(a.status) - getOrder(b.status);
                        }),
                      ].map((applicant, idx) => {
                        const interviewDate = applicant?.interview
                          ?.interviewTime
                          ? new Date(applicant.interview.interviewTime)
                          : null;
                        const now = new Date();

                        const timeLeftMs = interviewDate
                          ? interviewDate - now
                          : 0;
                        const msInMinute = 1000 * 60;
                        const msInHour = msInMinute * 60;
                        const msInDay = msInHour * 24;
                        const msInMonth = msInDay * 30;

                        let timeLeft = "";

                        if (!interviewDate || timeLeftMs <= 0) {
                          timeLeft = "Interview time passed";
                        } else {
                          const months = Math.floor(timeLeftMs / msInMonth);
                          const days = Math.floor(
                            (timeLeftMs % msInMonth) / msInDay
                          );
                          const hours = Math.floor(
                            (timeLeftMs % msInDay) / msInHour
                          );
                          const minutes = Math.floor(
                            (timeLeftMs % msInHour) / msInMinute
                          );

                          timeLeft =
                            (months > 0 ? `${months}mo ` : "") +
                            (days > 0 ? `${days}d ` : "") +
                            (hours > 0 ? `${hours}h ` : "") +
                            (minutes > 0 ? `${minutes}m` : "");

                          if (!timeLeft.trim())
                            timeLeft = "Less than a minute left";
                        }

                        return (
                          <tr
                            key={applicant._id}
                            className={`${
                              applicant.status === "Rejected"
                                ? "bg-red-50"
                                : applicant.status === "Accepted" &&
                                  interviewDate &&
                                  interviewDate < now
                                ? "bg-gray-100"
                                : applicant.status === "Accepted"
                                ? "bg-green-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {/* Applicant Number */}
                            <td className="px-4 py-3 font-medium whitespace-nowrap ">
                              {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1} .
                            </td>

                            {/* Basic Information */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {/* Image */}
                                <img
                                  src={applicant.profileImage}
                                  alt={applicant.name}
                                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                                />
                                {/* Name */}
                                <span className="font-medium">
                                  {applicant.name}
                                </span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-4 py-3">{applicant.email}</td>

                            {/* Phone */}
                            <td className="px-4 py-3">
                              {applicant.phone.startsWith("+")
                                ? applicant.phone
                                : `+${applicant.phone}`}
                            </td>

                            {/* Applied At */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(applicant.appliedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>

                            {/* Resume Download */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <a
                                href={applicant.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Download
                              </a>
                            </td>

                            {/* Buttons */}
                            <>
                              {applicant.status === "Rejected" ? (
                                // Rejected Status
                                <td className="px-4 py-3 w-[200px]">
                                  <div className="flex justify-center items-center h-full">
                                    <p className="text-red-600 font-semibold text-center">
                                      Applicant Rejected
                                    </p>
                                  </div>
                                </td>
                              ) : applicant.status === "Accepted" ? (
                                // Accepted Status
                                <td className="px-4 py-3 w-[300px]">
                                  <div className="flex justify-center items-center h-full">
                                    <div className="flex flex-col items-center space-y-1">
                                      {/* Title */}
                                      {interviewDate && interviewDate < now ? (
                                        <></>
                                      ) : (
                                        <p className="text-green-600 font-semibold">
                                          Applicant Accepted
                                        </p>
                                      )}

                                      {/* Interview Status */}
                                      {interviewDate && interviewDate < now ? (
                                        <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
                                          <FaRegClock />
                                          Interview Time Passed
                                        </p>
                                      ) : (
                                        <p className="text-gray-600 text-sm flex items-center gap-1">
                                          <FaRegClock /> {timeLeft}
                                        </p>
                                      )}

                                      {/* Buttons */}
                                      <div className="flex gap-5 items-center">
                                        {/* View Applicant Button */}
                                        <button
                                          onClick={() => {
                                            setSelectedApplicationID(
                                              applicant?._id
                                            );
                                            document
                                              .getElementById(
                                                "View_Application_Modal"
                                              )
                                              .showModal();
                                          }}
                                          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                                        >
                                          <FaEye />
                                          View Application
                                        </button>

                                        {/* View Applicant Interview Button */}
                                        <button
                                          onClick={() => {
                                            setSelectedApplicationID(
                                              applicant?._id
                                            );
                                            document
                                              .getElementById(
                                                "View_Interview_Modal"
                                              )
                                              .showModal();
                                          }}
                                          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                                        >
                                          <FaEye />
                                          View Interview
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              ) : (
                                // Pending Status
                                <td className="px-4 py-3 flex justify-end items-center gap-2 whitespace-nowrap flex-shrink-0">
                                  {/* View Button */}
                                  <button
                                    onClick={() => {
                                      setSelectedApplicationID(applicant?._id);
                                      document
                                        .getElementById(
                                          "View_Application_Modal"
                                        )
                                        .showModal();
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 font-medium text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 rounded transition cursor-pointer"
                                  >
                                    <FaEye />
                                    View
                                  </button>

                                  {/* Reject Button */}
                                  <button
                                    onClick={() => {
                                      handleRejectApplicant(applicant._id);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 font-medium text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded transition cursor-pointer"
                                  >
                                    <ImCross />
                                    Reject
                                  </button>

                                  {/* Accept Button */}
                                  <button
                                    onClick={() => {
                                      setSelectedApplicationID(applicant?._id);
                                      document
                                        .getElementById(
                                          "Accepted_Application_Modal"
                                        )
                                        .showModal();
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 font-medium text-green-500 hover:text-white border border-green-500 hover:bg-green-500 rounded transition cursor-pointer"
                                  >
                                    <FaCheck />
                                    Accept
                                  </button>
                                </td>
                              )}
                            </>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

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
