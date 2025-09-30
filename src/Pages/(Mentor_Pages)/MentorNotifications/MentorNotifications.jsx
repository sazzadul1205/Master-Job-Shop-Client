import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Icons
import { FiRefreshCcw, FiBell } from "react-icons/fi";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Modals
import MentorNotificationInformationModal from "./MentorNotificationInformationModal/MentorNotificationInformationModal";

const MentorNotifications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  // States Filters
  const [activeTab, setActiveTab] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState("");

  // --------- Course Notifications ---------
  const {
    data: MyCourseNotificationsData = [],
    isLoading: MyCourseNotificationsIsLoading,
    refetch: MyCourseNotificationsRefetch,
    error: MyCourseNotificationsError,
  } = useQuery({
    queryKey: ["MyCourseNotificationsData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Notifications?mentorId=${user?.email}&type=course_application`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // --------- Mentorship Notifications ---------
  const {
    data: MyMentorshipNotificationsData = [],
    isLoading: MyMentorshipNotificationsIsLoading,
    refetch: MyMentorshipNotificationsRefetch,
    error: MyMentorshipNotificationsError,
  } = useQuery({
    queryKey: ["MyMentorshipNotificationsData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(
          `/Notifications?mentorId=${user?.email}&type=mentorship_application`
        )
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Loading UI
  if (
    loading ||
    MyCourseNotificationsIsLoading ||
    MyMentorshipNotificationsIsLoading
  )
    return <Loading />;

  // Error UI
  if (MyCourseNotificationsError || MyMentorshipNotificationsError)
    return <Error />;

  // Refetch both
  const RefetchAll = () => {
    MyCourseNotificationsRefetch();
    MyMentorshipNotificationsRefetch();
  };

  // Merge for "All" tab
  const allNotifications = [
    ...MyCourseNotificationsData,
    ...MyMentorshipNotificationsData,
  ];

  // Select data based on tab
  const getActiveData = () => {
    switch (activeTab) {
      case "Course":
        return MyCourseNotificationsData;
      case "Mentorship":
        return MyMentorshipNotificationsData;
      default:
        return allNotifications;
    }
  };

  // Select data based on tab
  const displayedNotifications = getActiveData();

  // PATCH: Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await axiosPublic.patch(
        `/Notifications/Read/${notificationId}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to update notification");
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to mark notification as read",
        text: err?.message || "Something went wrong.",
        confirmButtonColor: "#ef4444",
      });
      // Revert read status in UI
      queryClient.invalidateQueries(["MyCourseNotificationsData", user?.email]);
      queryClient.invalidateQueries([
        "MyMentorshipNotificationsData",
        user?.email,
      ]);
    }
  };

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const allIds = allNotifications.filter((n) => !n.read).map((n) => n._id);

      if (allIds.length === 0) return; // Nothing to do

      // Optimistic UI: mark all unread as read
      allNotifications.forEach((n) => (n.read = true));

      // Call PATCH requests in parallel
      await Promise.all(
        allIds.map((id) => axiosPublic.patch(`/Notifications/Read/${id}`))
      );

      // Refetch queries to sync
      queryClient.invalidateQueries(["MyCourseNotificationsData", user?.email]);
      queryClient.invalidateQueries([
        "MyMentorshipNotificationsData",
        user?.email,
      ]);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to mark all notifications as read",
        text: err?.message || "Something went wrong.",
        confirmButtonColor: "#ef4444",
      });

      // Revert read status
      queryClient.invalidateQueries(["MyCourseNotificationsData", user?.email]);
      queryClient.invalidateQueries([
        "MyMentorshipNotificationsData",
        user?.email,
      ]);
    }
  };

  return (
    <div className="min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between py-7 px-9">
        <h3 className="text-black text-3xl font-bold">My Notifications</h3>

        <div className="flex gap-3">
          {/* Refresh */}
          <button
            onClick={() => RefetchAll()}
            className="flex items-center gap-2 bg-white border border-gray-300 
                 hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
                 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
          >
            <FiRefreshCcw className="w-5 h-5" />
            <span>Refresh</span>
          </button>

          {/* Mark All as Read */}
          <button
            onClick={() => markAllNotificationsAsRead()}
            className="flex items-center gap-2 bg-blue-500 border border-blue-600
                 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg
                 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <FiBell className="w-5 h-5" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200 rounded-lg p-1 shadow-inner mx-9">
        {["All", "Course", "Mentorship"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-white shadow text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab} Applications
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mx-9 mt-6">
        {/* No notifications found */}
        {displayedNotifications.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-6">
            No notifications found.
          </p>
        ) : (
          displayedNotifications.map((n) => (
            <div
              key={n._id}
              onClick={async () => {
                setSelectedNotification(n);
                document
                  .getElementById("Mentor_Notification_Information_Modal")
                  .showModal();

                if (!n.read) {
                  // Optimistic UI: mark as read immediately
                  n.read = true;

                  // Call PATCH request
                  await markNotificationAsRead(n._id);
                }
              }}
              className={`relative bg-white border rounded-lg shadow-sm p-4 transition cursor-pointer hover:shadow-xl`}
            >
              {/* Unread Dot */}
              {!n.read && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full"></span>
              )}

              <div className="flex items-start gap-2">
                <FiBell className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1 animate-pulse" />

                <div>
                  <h4 className="font-semibold text-lg">
                    {n.title || "Untitled Notification"}
                  </h4>

                  <p className="text-gray-700 text-sm mt-1">
                    {n.message || "No additional details available."}
                  </p>

                  <p className="text-gray-400 text-xs mt-2">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : "Unknown date"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {/* Notification Modal */}
      <dialog id="Mentor_Notification_Information_Modal" className="modal">
        <MentorNotificationInformationModal
          selectedNotification={selectedNotification}
          setSelectedNotification={setSelectedNotification}
        />
      </dialog>
    </div>
  );
};

export default MentorNotifications;
