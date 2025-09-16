import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import { IoSearchSharp } from "react-icons/io5";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import ApplicantInformationModal from "../../../Shared/ApplicantInformationModal/ApplicantInformationModal";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Component
import MyMentorshipApplicationsTable from "./ApplicationsTable/MyMentorshipApplicationsTable";
import MyMentorshipApplicationModal from "../../(Member_Pages)/MyMentorshipApplications/MyMentorshipApplicationModal/MyMentorshipApplicationModal";

const MentorMyMentorshipApplications = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Variables
  const [selectedApplicantName, setSelectedApplicantName] = useState("");
  const [selectedApplicationID, setSelectedApplicationID] = useState(null);

  // States Variables
  const [pageMap, setPageMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetching Active Mentorship
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    refetch: MyMentorshipRefetch,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorship"],
    queryFn: () =>
      axiosPublic.get(`/Mentorship?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        // Ensure the result is always an array
        return Array.isArray(data) ? data : [data];
      }),
  });

  // Assuming MyMentorshipData is an array of objects
  const allMentorshipIds = MyMentorshipData?.map((item) => item._id);

  // Fetching Active Mentorship
  const {
    data: MyMentorshipApplicationsData,
    isLoading: MyMentorshipApplicationsIsLoading,
    refetch: MyMentorshipApplicationsRefetch,
    error: MyMentorshipApplicationsError,
  } = useQuery({
    queryKey: ["MyMentorshipApplications", allMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(
          `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds}`
        )
        .then((res) => {
          const data = res.data;
          return data;
        }),
    enabled: !!allMentorshipIds,
  });

  // Merge mentorship with applications
  const mergedMentorship =
    MyMentorshipData?.map((mentorship) => {
      return {
        ...mentorship,
        applications: MyMentorshipApplicationsData?.[mentorship._id] || [],
      };
    }) || [];

  // Filter by search term (mentorship title)
  const filteredMentorship = mergedMentorship.filter((mentorship) => {
    const titleMatch = mentorship.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    let statusMatch = true;

    if (statusFilter !== "all") {
      if (statusFilter === "closed") {
        // "closed" should match both "closed" and "active"
        statusMatch =
          mentorship.status?.toLowerCase() === "closed" ||
          mentorship.status?.toLowerCase() === "active";
      } else {
        statusMatch =
          mentorship.status?.toLowerCase() === statusFilter.toLowerCase();
      }
    }

    return titleMatch && statusMatch;
  });

  // Page management
  const handlePageChange = (mentorshipId, newPage) => {
    setPageMap((prev) => ({ ...prev, [mentorshipId]: newPage }));
  };

  // Check for loading state
  if (MyMentorshipIsLoading || MyMentorshipApplicationsIsLoading)
    return <Loading />;

  // Check for error
  if (MyMentorshipError || MyMentorshipApplicationsError) return <Error />;

  // Refetch All
  const refetchAll = () => {
    MyMentorshipRefetch();
    MyMentorshipApplicationsRefetch();
  };

  return (
    <div className="py-7 px-8">
      <div className="flex justify-between items-center">
        {/* Title */}
        <h3 className="font-bold text-3xl text-gray-700">
          Mentorship Applications Management
        </h3>

        <button onClick={() => refetchAll()}>Refetch</button>
      </div>

      {/* Filters */}
      <div className="pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchSharp className="w-5 h-5 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search mentorship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="statusFilter"
            className="text-sm font-semibold text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
            <option value="onhold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Container for Mentorship Applications */}
      <div className="my-6 space-y-6">
        {filteredMentorship && filteredMentorship.length > 0 ? (
          filteredMentorship.map((mentorship) => (
            <MyMentorshipApplicationsTable
              pageMap={pageMap}
              key={mentorship?._id}
              refetchAll={refetchAll}
              mentorship={mentorship}
              handlePageChange={handlePageChange}
              setSelectedApplicantName={setSelectedApplicantName}
              setSelectedApplicationID={setSelectedApplicationID}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-md border border-gray-200">
            {/* Red Cross Icon */}
            <div className="text-red-500 bg-red-100 p-7 mb-4 rounded-full">
              <ImCross className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">
              No Mentorship&apos;s or Applications Found
            </h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* Mentorship Application Modal */}
      <dialog id="View_Mentorship_Application_Modal" className="modal">
        <MyMentorshipApplicationModal
          selectedApplicationID={selectedApplicationID}
          setSelectedApplicationID={setSelectedApplicationID}
        />
      </dialog>

      {/* View Applicant Profile Modal */}
      <dialog id="View_Applicant_Profile_Modal" className="modal">
        <ApplicantInformationModal
          selectedApplicantName={selectedApplicantName}
          setSelectedApplicantName={setSelectedApplicantName}
        />
      </dialog>
    </div>
  );
};

export default MentorMyMentorshipApplications;
