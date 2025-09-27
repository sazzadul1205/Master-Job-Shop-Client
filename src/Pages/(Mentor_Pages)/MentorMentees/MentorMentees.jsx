import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaSearch } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import ApplicantInformationModal from "../../../Shared/ApplicantInformationModal/ApplicantInformationModal";

// Components
import MentorMenteesCard from "./MentorMenteesCard/MentorMenteesCard";
import MentorMenteesTable from "./MentorMenteesTable/MentorMenteesTable";

// Modals
import MentorMenteesMessageModal from "./MentorMenteesMessageModal/MentorMenteesMessageModal";
import { FiRefreshCw } from "react-icons/fi";

// Function to get all course IDs from all applications in MyCoursesData
const getAllCourseIds = (coursesData) => {
  if (!coursesData || typeof coursesData !== "object") return [];
  return Object.values(coursesData)
    .flat()
    .map((app) => app?.courseId)
    .filter(Boolean);
};

// Function to get all mentorship IDs from MyMentorshipData
const getAllMentorshipIds = (mentorshipData) => {
  if (!mentorshipData || typeof mentorshipData !== "object") return [];
  return Object.values(mentorshipData)
    .flat()
    .map((app) => app?.mentorshipId)
    .filter(Boolean);
};

// Utility: remove duplicates by id
const dedupeById = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const MentorMentees = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Filters Accepted
  const statusFilter = "Accepted";

  // Modal State
  const [selectedApplicantName, setSelectedApplicantName] = useState("");

  // Selected Applicants State
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  // Local filter States
  const [searchName, setSearchName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState("");

  // --------- Courses APIs ---------

  // Fetching Active Courses
  const {
    data: MyCoursesData,
    isLoading: MyCoursesIsLoading,
    refetch: MyCoursesRefetch,
    error: MyCoursesError,
  } = useQuery({
    queryKey: ["MyCoursesData"],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?mentorEmail=${user?.email}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  const allCoursesIds = MyCoursesData?.map((item) => item._id);

  // Active Courses Applications
  const {
    data: MyCoursesApplicationsData,
    isLoading: MyCoursesApplicationsIsLoading,
    refetch: MyCoursesApplicationsRefetch,
    error: MyCoursesApplicationsError,
  } = useQuery({
    queryKey: ["MyCoursesApplications", allCoursesIds, statusFilter],
    queryFn: () =>
      axiosPublic
        .get(
          `/CourseApplications/ByCourse?courseId=${allCoursesIds.join(
            ","
          )}&status=${statusFilter}`
        )
        .then((res) => res.data),
    enabled: allCoursesIds?.length > 0,
  });

  // --------- Mentorship APIs ---------

  // Fetching Active Mentorship
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    refetch: MyMentorshipRefetch,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData"],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?mentorEmail=${user?.email}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  const allMentorshipIds = MyMentorshipData?.map((item) => item._id);

  // Active Mentorship Applications
  const {
    data: MyMentorshipApplicationsData,
    isLoading: MyMentorshipApplicationsIsLoading,
    refetch: MyMentorshipApplicationsRefetch,
    error: MyMentorshipApplicationsError,
  } = useQuery({
    queryKey: ["MyMentorshipApplications", allMentorshipIds, statusFilter],
    queryFn: () =>
      axiosPublic
        .get(
          `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds.join(
            ","
          )}&status=${statusFilter}`
        )
        .then((res) => res.data),
    enabled: allMentorshipIds?.length > 0,
  });

  // --------- Messages / Emails ---------

  // Example: You can set these dynamically based on state or props
  const queryType = "Mentor";
  const queryEmail = user?.email || "";

  // Fetching Mentor Emails
  const {
    data: MentorEmailsData,
    isLoading: MentorEmailsIsLoading,
    refetch: MentorEmailsRefetch,
    error: MentorEmailsError,
  } = useQuery({
    queryKey: ["MentorEmailsData", queryType, queryEmail],
    queryFn: () =>
      axiosPublic
        .get(`/MentorEmails?type=${queryType}&email=${queryEmail}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  // Fetching Mentor Messages
  const {
    data: MentorMessagesData,
    isLoading: MentorMessagesIsLoading,
    refetch: MentorMessagesRefetch,
    error: MentorMessagesError,
  } = useQuery({
    queryKey: ["MentorMessagesData", queryType, queryEmail],
    queryFn: () =>
      axiosPublic
        .get(`/MentorMessages?type=${queryType}&email=${queryEmail}`)
        .then((res) => (Array.isArray(res.data) ? res.data : [res.data])),
  });

  // Get all course and mentorship IDs
  const MyCourseIds = getAllCourseIds(MyCoursesApplicationsData);
  const MyMentorshipIds = getAllMentorshipIds(MyMentorshipApplicationsData);

  // Fetching Course Titles
  const { data: MyCourseTitles } = useQuery({
    queryKey: ["MyCourseTitles", MyCourseIds],
    queryFn: () =>
      axiosPublic
        .get(`/Courses/Title?ids=${JSON.stringify(MyCourseIds)}`)
        .then((res) => res.data),
    enabled: MyCourseIds?.length > 0,
  });

  // Fetching Mentorship Titles
  const { data: MyMentorshipTitles } = useQuery({
    queryKey: ["MyMentorshipTitles", MyMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship/Title?ids=${JSON.stringify(MyMentorshipIds)}`)
        .then((res) => res.data),
    enabled: MyMentorshipIds?.length > 0,
  });

  // Flatten Applications
  const courseApplications = MyCoursesApplicationsData
    ? Object.values(MyCoursesApplicationsData).flat()
    : [];
  const mentorshipApplications = MyMentorshipApplicationsData
    ? Object.values(MyMentorshipApplicationsData).flat()
    : [];

  // Merge applications
  const mergedApplications = [
    ...courseApplications.map((app) => ({ ...app, type: "Course" })),
    ...mentorshipApplications.map((app) => ({ ...app, type: "Mentorship" })),
  ];

  // Get unique course and mentorship titles
  const uniqueCourseTitles = dedupeById(MyCourseTitles || []);
  const uniqueMentorshipTitles = dedupeById(MyMentorshipTitles || []);

  // Apply Filters
  const filteredApplications = mergedApplications.filter((app) => {
    const matchesName = app.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesProgram =
      !selectedProgramId ||
      app.courseId === selectedProgramId ||
      app.mentorshipId === selectedProgramId;
    const matchesType =
      !selectedType || app.type.toLowerCase() === selectedType.toLowerCase();

    return matchesName && matchesProgram && matchesType;
  });

  // Loading State
  if (
    loading ||
    MyCoursesIsLoading ||
    MyMentorshipIsLoading ||
    MentorEmailsIsLoading ||
    MentorMessagesIsLoading ||
    MyCoursesApplicationsIsLoading ||
    MyMentorshipApplicationsIsLoading
  )
    return <Loading />;

  // Error State
  if (
    MyCoursesError ||
    MyMentorshipError ||
    MentorEmailsError ||
    MentorMessagesError ||
    MyCoursesApplicationsError ||
    MyMentorshipApplicationsError
  )
    return <Error />;

  // Refetch All
  const RefetchAll = () => {
    MyCoursesRefetch();
    MentorEmailsRefetch();
    MyMentorshipRefetch();
    MentorMessagesRefetch();
    MyCoursesApplicationsRefetch();
    MyMentorshipApplicationsRefetch();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-7 px-9">
        {/* Page Title */}
        <h3 className="text-black text-3xl font-bold">All Mentors Mentees</h3>

        {/* Refresh Button */}
        <button
          className={`flex items-center gap-2 bg-white border border-gray-300 
                hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
                px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer`}
          onClick={RefetchAll}
          title="Refresh Data"
          disabled={
            MyCoursesIsLoading ||
            MyMentorshipIsLoading ||
            MentorEmailsIsLoading ||
            MentorMessagesIsLoading ||
            MyCoursesApplicationsIsLoading ||
            MyMentorshipApplicationsIsLoading
          } // disable while loading
        >
          <FiRefreshCw
            className={`text-base ${
              MyCoursesIsLoading ||
              MyMentorshipIsLoading ||
              MentorEmailsIsLoading ||
              MentorMessagesIsLoading ||
              MyCoursesApplicationsIsLoading ||
              MyMentorshipApplicationsIsLoading
                ? "animate-spin"
                : ""
            }`}
          />
          <span>
            {MyCoursesIsLoading ||
            MyMentorshipIsLoading ||
            MentorEmailsIsLoading ||
            MentorMessagesIsLoading ||
            MyCoursesApplicationsIsLoading ||
            MyMentorshipApplicationsIsLoading
              ? "Refreshing..."
              : "Refresh"}
          </span>
        </button>
      </div>

      {/* Mentors Mentees Card */}
      <MentorMenteesCard
        MentorEmailsData={MentorEmailsData}
        MentorMessagesData={MentorMessagesData}
        courseApplications={courseApplications}
        mentorshipApplications={mentorshipApplications}
      />

      {/* Filters */}
      <div className="mx-7 my-9">
        <div className="w-full flex flex-wrap items-center gap-4 rounded-xl bg-white border border-gray-300 p-5 shadow-sm">
          {/* Search by name */}
          <div className="relative flex-1 min-w-[200px] max-w-[500px]">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              placeholder="Search by Mentees Name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {/* Program filter */}
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="min-w-[400px] max-w-[400px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Program</option>
            {uniqueCourseTitles.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
            {uniqueMentorshipTitles.map((mentorship) => (
              <option key={mentorship.id} value={mentorship.id}>
                {mentorship.title}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Course">Courses</option>
            <option value="Mentorship">Mentorship</option>
          </select>

          {/* Clear Button */}
          <button
            type="button"
            onClick={() => {
              setSearchName("");
              setSelectedType("");
              setSelectedProgramId("");
            }}
            className="px-4 py-2 bg-gray-100 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Clear Filter
          </button>

          {/* Bulk Message */}
          <button
            type="button"
            disabled={selectedApplicants.length === 0}
            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer ${
              selectedApplicants.length === 0
                ? "bg-blue-500/80 border-blue-300 text-white cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white"
            }`}
            onClick={() => {
              document
                .getElementById("Mentor_Mentees_Message_Modal")
                ?.showModal();
            }}
          >
            <FaRegMessage className="text-base" />
            <span>Bulk Message</span>
            <span className="opacity-80">
              (
              {selectedApplicants.length > 0
                ? selectedApplicants.length
                : "None"}
              )
            </span>
          </button>
        </div>
      </div>

      {/* Table with filtered apps */}
      <MentorMenteesTable
        selectedApplicants={selectedApplicants}
        mergedApplications={filteredApplications}
        setSelectedApplicants={setSelectedApplicants}
        setSelectedApplicantName={setSelectedApplicantName}
      />

      {/* Modal */}
      {/* View Applicant Profile Modal */}
      <dialog id="View_Applicant_Profile_Modal" className="modal">
        <ApplicantInformationModal
          selectedApplicantName={selectedApplicantName}
          setSelectedApplicantName={setSelectedApplicantName}
        />
      </dialog>

      {/* View Mentor Mentees Message Modal */}
      <dialog id="Mentor_Mentees_Message_Modal" className="modal">
        <MentorMenteesMessageModal
          selectedApplicants={selectedApplicants}
          setSelectedApplicants={setSelectedApplicants}
        />
      </dialog>
    </div>
  );
};

export default MentorMentees;
