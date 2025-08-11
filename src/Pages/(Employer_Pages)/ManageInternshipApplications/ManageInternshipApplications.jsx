import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// Assets
import InternshipApplicationBlue from "../../../assets/EmployerLayout/InternshipApplication/InternshipApplicationBlue.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Components - Table
import InternshipApplicantTable from "./InternshipApplicantTable/InternshipApplicantTable";

// Modals
import ViewInternshipApplicationModal from "./ViewInternshipApplicationModal/ViewInternshipApplicationModal";
import AcceptInternshipApplicationModal from "./AcceptInternshipApplicationModal/AcceptInternshipApplicationModal";
import MyInternshipApplicationModal from "../../(Member_Pages)/MyInternshipApplications/MyInternshipApplicationModal/MyInternshipApplicationModal";

const ManageInternshipApplications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Pagination States
  const [pageStates, setPageStates] = useState({});

  // Expanded Internship Id
  const [expandedInternshipId, setExpandedInternshipId] = useState(null);

  // Selected Application ID
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // Items Per Page
  const ITEMS_PER_PAGE = 5;

  // Internship Data
  const {
    data: InternshipData,
    isLoading: InternshipIsLoading,
    error: InternshipError,
    refetch: InternshipRefetch,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/Internship?postedBy=${user?.email}`);
      const data = res.data;
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") return [data];
      return [];
    },
  });

  // Getting Internship Ids
  const internshipIds =
    InternshipData?.map((internship) => internship._id) || [];

  // Fetching Internship Applications Data
  const {
    data: InternshipApplicationsData,
    isLoading: InternshipApplicationsLoading,
    error: InternshipApplicationsError,
    refetch: InternshipApplicationsRefetch,
  } = useQuery({
    queryKey: ["InternshipApplicationsData", internshipIds],
    queryFn: () => {
      const query = internshipIds
        .map((id) => `internshipIds[]=${id}`)
        .join("&");
      return axiosPublic
        .get(`/InternshipApplications?${query}`)
        .then((res) => res.data);
    },
    enabled: internshipIds.length > 0,
  });

  // Combining Internship and Job Applications Data
  const InternshipWithApplicants = InternshipData?.map((internship) => {
    const applicants =
      InternshipApplicationsData?.filter(
        (app) => app.internshipId === internship._id
      ) || [];
    return { ...internship, Applicants: applicants };
  });

  // Refetching Data
  const refetch = () => {
    InternshipRefetch();
    InternshipApplicationsRefetch();
  };

  // Loading / Error UI Handling
  if (InternshipApplicationsLoading || InternshipIsLoading || loading)
    return <Loading />;
  if (InternshipApplicationsError || InternshipError) return <Error />;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center py-3 px-5">
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-2">
          <img
            src={InternshipApplicationBlue}
            alt="Manage Job Applicant Icons"
            className="w-6 h-6"
          />
          Manage Internship Applications
        </h3>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Internship Container */}
      <div className="px-4 pt-4 space-y-3">
        {InternshipWithApplicants?.length > 0 ? (
          InternshipWithApplicants?.map((internship, index) => {
            // Get the current page number for this job from the pageStates object
            // If there’s no entry yet, default to page 1
            const currentPage = pageStates[internship._id] || 1;

            // Sort the job's applicants by their status
            // Order: No status first → Accepted → Rejected → Everything else
            const sortedApplicants = [...internship.Applicants].sort((a, b) => {
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
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE
            );

            // Calculate the total number of pages based on the number of applicants
            const totalPages = Math.ceil(
              sortedApplicants.length / ITEMS_PER_PAGE
            );

            return (
              <div
                key={internship._id}
                className="w-full border border-gray-200 rounded p-6 bg-white shadow hover:shadow-lg transition duration-300"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                  {/* Title */}
                  <h2 className="flex items-center text-lg font-semibold text-gray-900">
                    #{index + 1}. {internship.title}
                  </h2>

                  {/* Category */}
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Category:</span>{" "}
                    {internship.category}
                    {internship.subCategory && (
                      <span className="ml-2 text-gray-500">
                        ({internship.subCategory})
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200 mb-4" />

                {/* Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-800 mb-4">
                  {/* Location */}
                  <div>
                    <span className="font-medium text-gray-900">Location:</span>{" "}
                    {internship.location}
                  </div>

                  {/* Mode */}
                  <div>
                    <span className="font-medium text-gray-900">Mode:</span>{" "}
                    {internship.isRemote ? "Remote" : "Onsite"}
                  </div>

                  {/* Budget */}
                  <div>
                    <span className="font-medium text-gray-900">Budget:</span>{" "}
                    {internship.budget.min} - {internship.budget.max}{" "}
                    {internship.budget.currency}{" "}
                    {internship.budget.isNegotiable && (
                      <span className="text-blue-600 text-xs ml-1">
                        (Negotiable)
                      </span>
                    )}
                  </div>

                  {/* Delivery Deadline */}
                  <div>
                    <span className="font-medium text-gray-900">
                      Delivery Deadline:
                    </span>{" "}
                    {new Date(internship.deliveryDeadline).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>

                  {/* Required Skills */}
                  <div>
                    <span className="font-medium text-gray-900">
                      Required Skills:
                    </span>{" "}
                    {internship.requiredSkills.join(", ")}
                  </div>

                  {/* Posted On */}
                  <div>
                    <span className="font-medium text-gray-900">
                      Posted on:
                    </span>{" "}
                    {new Date(internship.postedAt).toLocaleDateString("en-US", {
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
                        {internship.Applicants.length}
                      </span>
                    </p>
                    {internship.Applicants.filter(
                      (app) => app.status === "Accepted"
                    ).length > 0 && (
                      <>
                        {" | "}
                        <p>
                          Accepted:{" "}
                          <span className="text-green-600 font-semibold">
                            {
                              internship.Applicants.filter(
                                (app) => app.status === "Accepted"
                              ).length
                            }
                          </span>
                        </p>
                      </>
                    )}

                    {internship.Applicants.filter(
                      (app) => app.status === "Rejected"
                    ).length > 0 && (
                      <>
                        {" | "}
                        <p>
                          Rejected:{" "}
                          <span className="text-red-600 font-semibold">
                            {
                              internship.Applicants.filter(
                                (app) => app.status === "Rejected"
                              ).length
                            }
                          </span>
                        </p>
                      </>
                    )}
                  </div>

                  {/* Open / Close Applicants Table Button */}
                  {expandedInternshipId === internship._id ? (
                    <button
                      onClick={() => setExpandedInternshipId(null)}
                      className="flex items-center gap-1 text-sm text-red-600 hover:underline transition cursor-pointer"
                    >
                      <FaChevronUp className="text-base" />
                      Close Applicants
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setExpandedInternshipId(internship._id);
                        setPageStates((prev) => ({
                          ...prev,
                          [internship._id]: 1,
                        }));
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
                    expandedInternshipId === internship._id
                      ? "max-h-[1000px] pt-4"
                      : "max-h-0"
                  }`}
                >
                  {/* Applicants Container */}
                  <InternshipApplicantTable
                    refetch={refetch}
                    currentPage={currentPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    paginatedApplicants={paginatedApplicants}
                    setSelectedApplicationID={setSelectedApplicationID}
                  />

                  {/* Pagination Controls */}
                  {internship.Applicants.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-center pt-2">
                      <div className="join">
                        {/* Left Button */}
                        <button
                          className="join-item bg-white text-black border border-gray-400 hover:bg-gray-300 px-3 py-2 cursor-pointer"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setPageStates((prev) => ({
                              ...prev,
                              [internship._id]: currentPage - 1,
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
                              [internship._id]: currentPage + 1,
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
          })
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-16 px-4">
            <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              No Internships Posted Yet
            </p>
            <p className="text-sm text-gray-500 max-w-xs text-center">
              Looks like you haven&apos;t posted any internships yet. Start
              posting internships now to attract talented interns!
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* View Application Modal */}
      <dialog id="View_Internship_Applications_Modal" className="modal">
        <MyInternshipApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* Accepted Application Modal */}
      <dialog id="Accepted_Application_Modal" className="modal">
        <AcceptInternshipApplicationModal
          refetch={refetch}
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* View Interview Modal */}
      <dialog id="View_Interview_Modal" className="modal">
        <ViewInternshipApplicationModal
          refetch={refetch}
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>
    </>
  );
};

export default ManageInternshipApplications;
