// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { IoMdNotificationsOutline } from "react-icons/io";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const MentorNotificationsDropdownMobile = ({
  openDropdown,
  toggleDropdown,
  notificationRef,
}) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // ---- Fetch Course Notifications ----
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

  // ---- Fetch Mentorship Notifications ----
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

  // ---- Combine & Sort ----
  const allNotifications = [
    ...MyCourseNotificationsData,
    ...MyMentorshipNotificationsData,
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = allNotifications.filter((n) => !n.read).length;
  const latestFive = allNotifications.slice(0, 5);

  // ---- Date Format ----
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isLoading = CourseLoading || MentorshipLoading;
  const hasError = CourseError || MentorshipError;

  return (
    <div ref={notificationRef} className="relative">
      {/* Dock Button */}
      <button
        onClick={() => toggleDropdown("notifications")}
        className="dock-label relative focus:outline-none mx-auto"
      >
        <IoMdNotificationsOutline
          className={`text-white text-3xl transition-colors duration-300 ${
            openDropdown === "notifications" ? "text-yellow-300" : ""
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <span className="dock-label">Notifications</span>

      {/* Drop-up Panel */}
      <div
        className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 w-80 md:w-96 bg-white text-black rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out origin-bottom ${
          openDropdown === "notifications"
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        } z-50`}
      >
        <ul className="py-2 max-h-80 overflow-y-auto">
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

          {/* Empty */}
          {!isLoading && !hasError && latestFive.length === 0 && (
            <li className="px-4 py-3 text-gray-500 text-center">
              No notifications yet
            </li>
          )}

          {/* Notifications */}
          {!isLoading &&
            !hasError &&
            latestFive.map((n) => (
              <li
                key={n._id}
                className={`px-4 py-3 border-b last:border-none hover:bg-gray-100 cursor-pointer ${
                  !n.read ? "bg-blue-50" : ""
                }`}
              >
                <p className="font-semibold text-sm">{n.title}</p>
                <p className="text-xs text-gray-600">{n.message}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatDate(n.createdAt)}
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

MentorNotificationsDropdownMobile.propTypes = {
  openDropdown: PropTypes.string.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  notificationRef: PropTypes.object.isRequired,
};

export default MentorNotificationsDropdownMobile;
