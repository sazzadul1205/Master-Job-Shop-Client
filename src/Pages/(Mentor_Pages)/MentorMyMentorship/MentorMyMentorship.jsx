import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";

// Hooks

import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Assets
import DeleteAnimation from "../../../assets/Animation/DeleteAnimation.gif";

// Components
import MentorMyActiveMentorship from "./MentorMyActiveMentorship/MentorMyActiveMentorship";
import MentorMyArchivedMentorship from "./MentorMyArchivedMentorship/MentorMyArchivedMentorship";
import MentorMyCompletedMentorship from "./MentorMyCompletedMentorship/MentorMyCompletedMentorship";

// Modals
import CreateMentorshipModal from "./CreateMentorshipModal/CreateMentorshipModal";
import EditMentorshipModal from "./MentorMyActiveMentorship/EditMentorshipModal/EditMentorshipModal";
import MentorshipDetailsModal from "../../(Public_Pages)/Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";

const MentorMyMentorship = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Track active tab
  const [starred, setStarred] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

  // ----------- Fetching Active Mentorship API -----------
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

  // ----------- Fetching Completed Mentorship API -----------
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

  // ----------- Fetching Archived Mentorship API -----------
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

  // Refetch All
  const RefetchAll = () => {
    ActiveMentorshipRefetch();
    CompletedMentorshipRefetch();
    ArchivedMentorshipRefetch();
  };

  // Delete Mentorship
  const handleDelete = async (id) => {
    try {
      // Fetch applications for this mentorship
      const { data: applications } = await axiosPublic.get(
        `/MentorshipApplications/ByMentorship?mentorshipId=${id}`
      );

      // Extract all application IDs
      const allApplicationIds = Object.values(applications)
        .flat() // flatten arrays
        .map((app) => app._id);

      // Confirm deletion
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: `This Mentorship and ${
          allApplicationIds.length || "No"
        } Applications will be permanently deleted!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      // If not confirmed
      if (!confirmResult.isConfirmed) return;

      // Set Deleted Applications Message
      let deletedApplicationsMessage = "No applications to delete.";

      // Delete all applications in bulk if any exist
      if (allApplicationIds.length > 0) {
        try {
          const { data } = await axiosPublic.delete(
            "/MentorshipApplications/BulkDelete",
            { data: { ids: allApplicationIds } }
          );

          deletedApplicationsMessage = `Deleted ${data.deletedCount} application(s).`;
        } catch (error) {
          deletedApplicationsMessage = "Failed to delete applications.";
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Failed to delete. Please try again!, ${error}`,
          });
        }
      }

      // Delete the mentorship itself
      await axiosPublic.delete(`/Mentorship/${id}`);

      // Show success modal with dynamic message
      Swal.fire({
        title: "Deleted!",
        html: `
          <div style="font-size: 50px; text-align:center;">
            <img src=${DeleteAnimation} alt="Trashcan closing" width="200" /> 
          </div> 
          <p>Mentorship has been removed.</p>
          <p><strong>Applications:</strong> ${deletedApplicationsMessage}</p>
        `,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#fff",
        didOpen: () => {
          const content = Swal.getHtmlContainer();
          content.style.display = "flex";
          content.style.alignItems = "center";
          content.style.flexDirection = "column";
          content.style.textAlign = "center";
        },
      });

      // Refresh mentorship list
      RefetchAll();
    } catch (error) {
      // Show error
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to delete. Please try again!, ${error}`,
      });
    }
  };

  // Optimistic Archive Toggle
  const toggleStar = async (id) => {
    // Optimistically toggle locally
    const isCurrentlyStarred = starred.includes(id);
    setStarred((prev) =>
      isCurrentlyStarred ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

    try {
      // Call backend to toggle archive
      const res = await axiosPublic.put(`/Mentorship/Archive/${id}`);

      if (res?.data?.archived === undefined) {
        throw new Error("Unexpected response from server");
      }

      // Refetch data
      RefetchAll();

      // Show success toast
      Swal.fire({
        toast: true,
        position: "top-start",
        icon: "success",
        title: res.data.archived ? "Archived!" : "Un-Archived!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // If backend disagrees with local toggle, correct it
      if (res.data.archived !== !isCurrentlyStarred) {
        setStarred((prev) =>
          res.data.archived ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
      }
    } catch (error) {
      // Rollback local toggle
      setStarred((prev) =>
        isCurrentlyStarred ? [...prev, id] : prev.filter((sid) => sid !== id)
      );

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update archive status. Please try again!",
      });

      console.error("Failed to toggle archive:", error);
    }
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
            toggleStar={toggleStar}
            handleDelete={handleDelete}
            error={ActiveMentorshipError}
            isLoading={ActiveMentorshipIsLoading}
            MentorshipData={ActiveMentorshipData}
            setSelectedMentorshipID={setSelectedMentorshipID}
          />
        )}

        {/* Completed Tab Content */}
        {activeTab === "completed" && (
          <MentorMyCompletedMentorship
            toggleStar={toggleStar}
            handleDelete={handleDelete}
            error={CompletedMentorshipError}
            isLoading={CompletedMentorshipIsLoading}
            MentorshipData={CompletedMentorshipData}
            setSelectedMentorshipID={setSelectedMentorshipID}
          />
        )}

        {/* Archived Tab Content */}
        {activeTab === "archived" && (
          <MentorMyArchivedMentorship
            toggleStar={toggleStar}
            handleDelete={handleDelete}
            error={ArchivedMentorshipError}
            isLoading={ArchivedMentorshipIsLoading}
            MentorshipData={ArchivedMentorshipData}
            setSelectedMentorshipID={setSelectedMentorshipID}
          />
        )}
      </div>

      {/* Modals */}
      {/* Create Mentorship Modal */}
      <dialog id="Create_Mentorship_Modal" className="modal">
        <CreateMentorshipModal refetch={RefetchAll} />
      </dialog>

      {/* Mentorship Details Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          isEditor={true}
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>

      {/* Edit Mentorship Modal */}
      <dialog id="Edit_Mentorship_Modal" className="modal">
        <EditMentorshipModal
          refetch={RefetchAll}
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </div>
  );
};

export default MentorMyMentorship;
