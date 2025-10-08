import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa6";

// Assets
import DeleteAnimation from "../../../assets/Animation/DeleteAnimation.gif";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Components
import MentorMyActiveCourses from "./MentorMyActiveCourses/MentorMyActiveCourses";
import MentorMyArchivedCourses from "./MentorMyArchivedCourses/MentorMyArchivedCourses";
import MentorMyCompletedCourses from "./MentorMyCompletedCourses/MentorMyCompletedCourses";

// Modals
import CreateCourseModal from "./CreateCourseModal/CreateCourseModal";
import EditCourseModal from "./MentorMyActiveCourses/EditCourseModal/EditCourseModal";
import CourseDetailsModal from "../../(Public_Pages)/Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";

const MentorMyCourses = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [starred, setStarred] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCourseID, setSelectedCourseID] = useState(null);

  // ----------- Fetching Active Course API -----------
  const {
    data: ActiveCoursesData,
    isLoading: ActiveCoursesIsLoading,
    refetch: ActiveCoursesRefetch,
    error: ActiveCoursesError,
  } = useQuery({
    queryKey: ["CoursesData", "active"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Courses?mentorEmail=${user?.email}&status=active,open,closed,onHold&archived=false`
        )
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ----------- Fetching Completed Course API -----------
  const {
    data: CompletedCoursesData,
    isLoading: CompletedCoursesIsLoading,
    refetch: CompletedCoursesRefetch,
    error: CompletedCoursesError,
  } = useQuery({
    queryKey: ["CoursesData", "completed"],
    queryFn: () =>
      axiosPublic
        .get(
          `/Courses?mentorEmail=${user?.email}&status=completed&archived=false`
        )
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // ----------- Fetching Archived Course API -----------
  const {
    data: ArchivedCourseData,
    isLoading: ArchivedCourseIsLoading,
    refetch: ArchivedCourseRefetch,
    error: ArchivedCourseError,
  } = useQuery({
    queryKey: ["CourseData", "archived"],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?mentorEmail=${user?.email}&archived=true`)
        .then((res) => {
          const data = res.data;
          // Ensure the result is always an array
          return Array.isArray(data) ? data : [data];
        }),
  });

  // Refetch All
  const RefetchAll = () => {
    ActiveCoursesRefetch();
    ArchivedCourseRefetch();
    CompletedCoursesRefetch();
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
      const res = await axiosPublic.put(`/Courses/Archive/${id}`);

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

  // Handle Delete
  const handleDelete = async (id) => {
    // If Delete
    try {
      // Fetch applications for this mentorship
      const { data: applications } = await axiosPublic.get(
        `/CourseApplications/ByCourse?courseId=${id}`
      );

      // Extract all application IDs
      const allApplicationIds = Object.values(applications)
        .flat() // flatten arrays
        .map((app) => app._id);

      // Confirm deletion
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: `This Course and ${
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
            "/CourseApplications/BulkDelete",
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

      // Delete the Courses itself
      await axiosPublic.delete(`/Courses/${id}`);

      // Show success modal with dynamic message
      Swal.fire({
        title: "Deleted!",
        html: `
           <div style="font-size: 50px; text-align:center;">
             <img src=${DeleteAnimation} alt="Trashcan closing" width="200" /> 
           </div> 
           <p>Course has been removed.</p>
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

  // Tabs Data
  const tabs = [
    { id: "active", label: "Active Courses" },
    { id: "completed", label: "Completed Courses" },
    { id: "archived", label: "Archived Courses" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        {/* Title */}
        <h3 className="text-2xl text-black font-bold">My Course&apos;s</h3>

        {/* Create New Course Button */}
        <button
          onClick={() =>
            document.getElementById("Create_Course_Modal").showModal()
          }
          className="flex items-center gap-4 bg-[#002242] hover:bg-[#00509e] text-white shadow hover:shadow-2xl font-semibold px-5 py-3 rounded-md transition-colors duration-500 cursor-pointer"
        >
          <FaPlus /> Create New Course
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-1 mx-5 bg-gray-200 rounded-md">
        {tabs?.map((tab) => (
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
      <div className="p-5">
        {/* Active Tab Content */}
        {activeTab === "active" && (
          <MentorMyActiveCourses
            toggleStar={toggleStar}
            handleDelete={handleDelete}
            error={ActiveCoursesError}
            CoursesData={ActiveCoursesData}
            isLoading={ActiveCoursesIsLoading}
            setSelectedCourseID={setSelectedCourseID}
          />
        )}

        {/* Completed Tab Content */}
        {activeTab === "completed" && (
          <MentorMyCompletedCourses
            toggleStar={toggleStar}
            handleDelete={handleDelete}
            error={CompletedCoursesError}
            CoursesData={CompletedCoursesData}
            isLoading={CompletedCoursesIsLoading}
            setSelectedCourseID={setSelectedCourseID}
          />
        )}

        {/* Archived Tab Content */}
        {activeTab === "archived" && (
          <MentorMyArchivedCourses
            toggleStar={toggleStar}
            handleDelete={handleDelete}
            error={ArchivedCourseError}
            CoursesData={ArchivedCourseData}
            isLoading={ArchivedCourseIsLoading}
            setSelectedCourseID={setSelectedCourseID}
          />
        )}
      </div>

      {/* Modals */}
      {/* Create Course Modal */}
      <dialog id="Create_Course_Modal" className="modal">
        <CreateCourseModal refetch={RefetchAll} />
      </dialog>

      {/* Course Details Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          isEditor={true}
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>

      {/* Edit Course Modal */}
      <dialog id="Edit_Course_Modal" className="modal">
        <EditCourseModal
          refetch={RefetchAll}
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
    </div>
  );
};

export default MentorMyCourses;
