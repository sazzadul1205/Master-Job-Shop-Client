import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Components
import MentorMyActiveMentorship from "./MentorMyActiveMentorship/MentorMyActiveMentorship";
import MentorMyArchivedMentorship from "./MentorMyArchivedMentorship/MentorMyArchivedMentorship";
import MentorMyCompletedMentorship from "./MentorMyCompletedMentorship/MentorMyCompletedMentorship";

// Modals
import CreateMentorshipModal from "./CreateMentorshipModal/CreateMentorshipModal";

const MentorMyMentorship = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Track active tab
  const [activeTab, setActiveTab] = useState("active");

  // Fetching Active Mentorship
  const {
    data: ActiveMentorshipData,
    isLoading: ActiveMentorshipIsLoading,
    refetch: ActiveMentorshipRefetch,
    error: ActiveMentorshipError,
  } = useQuery({
    queryKey: ["MentorshipData", "active"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Mentorship?mentorEmail=${user?.email}&status=active,open,closed,onHold&archived=false`
        )
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  const {
    data: CompletedMentorshipData,
    isLoading: CompletedMentorshipIsLoading,
    refetch: CompletedMentorshipRefetch,
    error: CompletedMentorshipError,
  } = useQuery({
    queryKey: ["MentorshipData", "completed"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Mentorship?mentorEmail=${user?.email}&status=completed&archived=false`
        )
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // Fetching Archived Mentorship
  const {
    data: ArchivedMentorshipData,
    isLoading: ArchivedMentorshipIsLoading,
    refetch: ArchivedMentorshipRefetch,
    error: ArchivedMentorshipError,
  } = useQuery({
    queryKey: ["MentorshipData", "archived"],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship?mentorEmail=${user?.email}&archived=true`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  const RefetchAll = () => {
    ActiveMentorshipRefetch();
    CompletedMentorshipRefetch();
    ArchivedMentorshipRefetch();
  };

  // Tabs Data
  const tabs = [
    { id: "active", label: "Active Mentorship's" },
    { id: "completed", label: "Completed Mentorship's" },
    { id: "archived", label: "Archived Mentorship's" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-8 px-8">
        {/* Title */}
        <h3 className="text-2xl text-black font-bold">My Mentorship&apos;s</h3>

        {/* Create New Mentorship Button */}
        <button
          onClick={() =>
            document.getElementById("Create_Mentorship_Modal").showModal()
          }
          className="flex items-center gap-4 bg-[#002242] hover:bg-[#00509e] text-white shadow hover:shadow-2xl font-semibold px-5 py-3 rounded-md transition-colors duration-500 cursor-pointer"
        >
          <FaPlus /> Create New Mentorship
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 py-1 px-1 mx-8 bg-gray-200 rounded-md">
        {tabs.map((tab) => (
          <p
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-center font-semibold py-2 cursor-pointer rounded transition-colors duration-300
              ${
                activeTab === tab.id
                  ? "bg-white text-gray-800 shadow"
                  : "text-black hover:text-gray-800 hover:bg-white"
              }`}
          >
            {tab.label}
          </p>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-8">
        {/* Active Tab Content */}
        {activeTab === "active" && (
          <MentorMyActiveMentorship
            refetch={RefetchAll}
            error={ActiveMentorshipError}
            isLoading={ActiveMentorshipIsLoading}
            MentorshipData={ActiveMentorshipData}
          />
        )}

        {/* Completed Tab Content */}
        {activeTab === "completed" && (
          <MentorMyCompletedMentorship
            error={CompletedMentorshipError}
            refetch={RefetchAll}
            isLoading={CompletedMentorshipIsLoading}
            MentorshipData={CompletedMentorshipData}
          />
        )}

        {/* Archived Tab Content */}
        {activeTab === "archived" && (
          <MentorMyArchivedMentorship
            error={ArchivedMentorshipError}
            refetch={RefetchAll}
            isLoading={ArchivedMentorshipIsLoading}
            MentorshipData={ArchivedMentorshipData}
          />
        )}
      </div>

      {/* Modals */}
      {/* Create Mentorship Modal */}
      <dialog id="Create_Mentorship_Modal" className="modal">
        <CreateMentorshipModal refetch={RefetchAll} />
      </dialog>
    </div>
  );
};

export default MentorMyMentorship;
