import { useState } from "react";
import { FiRefreshCcw, FiBell, FiCheckCircle } from "react-icons/fi";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import { useQuery } from "@tanstack/react-query";

const MentorNotifications = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [activeTab, setActiveTab] = useState("All");

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
        .get(`/Notifications?userId=${user?.email}&type=course_application`)
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
        .get(`/Notifications?userId=${user?.email}&type=mentorship_application`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Loading & Error UI
  if (
    loading ||
    MyCourseNotificationsIsLoading ||
    MyMentorshipNotificationsIsLoading
  )
    return <Loading />;
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

  const displayedNotifications = getActiveData();

  return (
    <div className="min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between py-7 px-9">
        <h3 className="text-black text-3xl font-bold">My Notifications</h3>

        {/* Refresh */}
        <button
          onClick={RefetchAll}
          className="flex items-center gap-2 bg-white border border-gray-300 
                     hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
                     px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
        >
          <FiRefreshCcw className="w-5 h-5" />
          <span>Refresh</span>
        </button>
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
        {displayedNotifications.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-6">
            No notifications found.
          </p>
        ) : (
          displayedNotifications.map((n) => (
            <div
              key={n._id}
              className={`relative bg-white border rounded-lg shadow-sm p-4 transition cursor-pointer hover:shadow-xl`}
            >
              {/* Unread Dot */}
              {!n.read && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full"></span>
              )}

              <div className="flex items-start gap-2">
                {/* Icon */}
                {n.read ? (
                  <FiCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <FiBell className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1 animate-pulse" />
                )}

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
    </div>
  );
};

export default MentorNotifications;
