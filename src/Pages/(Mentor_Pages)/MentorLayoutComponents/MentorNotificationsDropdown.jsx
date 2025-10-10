// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { IoMdNotificationsOutline } from "react-icons/io";

// Hocks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const MentorNotificationsDropdown = ({
  openDropdown,
  toggleDropdown,
  notificationRef,
}) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // --------- Course Notifications ---------
  const {
    data: MyCourseNotificationsData = [],
    isLoading: CourseLoading,
    error: CourseError,
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
    isLoading: MentorshipLoading,
    error: MentorshipError,
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

  // --------- Merge and Sort ---------
  const allNotifications = [
    ...MyCourseNotificationsData,
    ...MyMentorshipNotificationsData,
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // --------- Unread Count ---------
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  // --------- Limit to 5 ---------
  const latestFive = allNotifications.slice(0, 5);

  // --------- Date Formatter ---------
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------- Loading & Error States ---------
  const isLoading = CourseLoading || MentorshipLoading;
  const hasError = CourseError || MentorshipError;

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Icon */}
      <div
        className={`relative cursor-pointer p-1 rounded-full transition-colors duration-300 ${
          openDropdown === "notifications" ? "bg-blue-700" : ""
        }`}
        onClick={() => toggleDropdown("notifications")}
      >
        {/* Icon */}
        <IoMdNotificationsOutline
          className={`text-white text-2xl transition-colors duration-300 ${
            openDropdown === "notifications" ? "text-yellow-300" : ""
          }`}
        />

        {/* Unread Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      <div
        className={`absolute left-1/2 mt-2 w-80 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden transition-transform duration-300 ease-in-out -translate-x-1/2`}
        style={{
          transformOrigin: "top",
          transform:
            openDropdown === "notifications" ? "scaleY(1)" : "scaleY(0)",
        }}
      >
        <ul className="py-2 max-h-96 overflow-y-auto">
          {/* Loading */}
          {isLoading && (
            <li className="px-4 py-3 text-center text-gray-500 animate-pulse">
              Loading notifications...
            </li>
          )}

          {/* Error */}
          {hasError && (
            <li className="px-4 py-3 text-center text-red-500">
              Failed to load notifications.
            </li>
          )}

          {/* Notifications */}
          {!isLoading && !hasError && latestFive.length === 0 && (
            <li className="px-4 py-3 text-gray-500 text-center">
              No notifications yet
            </li>
          )}

          {!isLoading &&
            !hasError &&
            latestFive.map((notification) => (
              <li
                key={notification._id}
                className={`px-4 py-3 border-b last:border-none hover:bg-gray-100 cursor-pointer ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <p className="font-semibold text-sm">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.message}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </li>
            ))}
        </ul>

        {!isLoading && !hasError && allNotifications.length > 5 && (
          <div className="text-center py-2 text-blue-600 text-sm font-medium hover:underline cursor-pointer">
            View All
          </div>
        )}
      </div>
    </div>
  );
};

// Prop Validation
MentorNotificationsDropdown.propTypes = {
  openDropdown: PropTypes.string.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  notificationRef: PropTypes.object.isRequired,
};

export default MentorNotificationsDropdown;
