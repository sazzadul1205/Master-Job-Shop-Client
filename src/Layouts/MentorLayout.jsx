import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

// Packages
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Icons
import {
  IoAddSharp,
  IoNotificationsOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Assets - Icons
import MenteesIcon from "../assets/MentorLayoutIcons/MenteesIcon";
import SessionsIcon from "../assets/MentorLayoutIcons/SessionsIcon";
import MyCoursesIcon from "../assets/MentorLayoutIcons/MyCoursesIcon";
import DashboardIcon from "../assets/MentorLayoutIcons/DashboardIcon";
import MyMentorshipIcon from "../assets/MentorLayoutIcons/MyMentorshipIcon";
import ApplicationsIcon from "../assets/MentorLayoutIcons/ApplicationsIcon";

// Modal
import CreateCourseModal from "../Pages/(Mentor_Pages)/MentorMyCourses/CreateCourseModal/CreateCourseModal";
import CreateMentorshipModal from "../Pages/(Mentor_Pages)/MentorMyMentorship/CreateMentorshipModal/CreateMentorshipModal";

// Shared
import Loading from "../Shared/Loading/Loading";
import Error from "../Shared/Error/Error";

// Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Sidebar Links
const sidebarLinks = [
  {
    title: null,
    links: [
      { label: "Dashboard", path: "/Mentor/Dashboard", icon: DashboardIcon },
      { label: "Profile", path: "/Mentor/Profile", icon: CgProfile },
    ],
  },
  {
    title: "Mentorship Management",
    links: [
      {
        label: "My Mentorship's",
        path: "/Mentor/MyMentorship's",
        icon: MyMentorshipIcon,
      },
      {
        label: "Mentorship Applications Management",
        path: "/Mentor/MentorshipApplications",
        icon: ApplicationsIcon,
        scroll: true,
      },
      {
        label: "Create Mentorship",
        icon: IoAddSharp,
        onClick: () =>
          document.getElementById("Create_Mentorship_Modal").showModal(),
      },
    ],
  },
  {
    title: "Course Management",
    links: [
      { label: "My Course's", path: "/Mentor/MyCourses", icon: MyCoursesIcon },
      {
        label: "Course Applications Management",
        path: "/Mentor/CourseApplications",
        icon: ApplicationsIcon,
        scroll: true,
      },
      {
        label: "Create Course",
        icon: IoAddSharp,
        onClick: () =>
          document.getElementById("Create_Course_Modal").showModal(),
      },
    ],
  },
  {
    title: "Mentees & Sessions",
    links: [
      { label: "Mentees", path: "/Mentor/Mentees", icon: MenteesIcon },
      {
        label: "Sessions & Schedule",
        path: "/Mentor/ScheduledSessions",
        icon: SessionsIcon,
      },
    ],
  },
  {
    title: "Communications",
    links: [
      { label: "Messages", path: "/Mentor/Messages", icon: FaRegMessage },
      {
        label: "Notifications",
        path: "/Mentor/Notifications",
        icon: IoNotificationsOutline,
      },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Settings", path: "/Mentor/Settings", icon: IoSettingsOutline },
    ],
  },
];

const MentorLayout = () => {
  const { user, loading, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Helper to invalidate all mentorship queries
  const RefetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["MentorshipData"] });
    queryClient.invalidateQueries({ queryKey: ["MyMentorshipData"] });
    queryClient.invalidateQueries({ queryKey: ["MyMentorshipApplications"] });
  };

  // State for dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs for handling outside clicks
  const profileRef = useRef(null);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = 22;
  const messages = 15;

  const formatCount = (count) => (count > 1200 ? "99+" : count);

  // Fetch Mentor Data
  const {
    data: MentorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        messageRef.current &&
        !messageRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleScroll = () => setOpenDropdown(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Loading UI
  if (isLoading || loading) return <Loading />;

  // Error UI
  if (error) return <Error />;

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleLogout = async () => {
    try {
      await logOut(); // Firebase logout
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/Login"); // redirect to login page
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.message || "Something went wrong during logout.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-100 to-white flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-[#002242] shadow-2xl w-full px-5 py-3">
        {/* Logo */}
        <NavLink className="ml-2 rounded-md transition-all duration-200 text-white">
          <div className="hidden md:flex items-center ">
            <p className="text-xl font-semibold playfair">Master Job Shop</p>
          </div>
        </NavLink>

        {/* Dropdowns */}
        <div className="flex items-center gap-7">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <div
              className={`relative cursor-pointer p-1 rounded-full transition-colors duration-300 ${
                openDropdown === "notifications" ? "bg-blue-700" : ""
              }`}
              onClick={() => toggleDropdown("notifications")}
            >
              <IoMdNotificationsOutline
                className={`text-white text-2xl transition-colors duration-300 ${
                  openDropdown === "notifications" ? "text-yellow-300" : ""
                }`}
              />
              {notifications > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {formatCount(notifications)}
                </span>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div
              className={`absolute left-1/2 mt-2 w-80 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden transition-transform duration-300 ease-in-out -translate-x-1/2`}
              style={{
                transformOrigin: "top",
                transform:
                  openDropdown === "notifications" ? "scaleY(1)" : "scaleY(0)",
              }}
            >
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Notification 1
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Notification 2
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Notification 3
                </li>
              </ul>
            </div>
          </div>

          {/* Messages */}
          <div className="relative" ref={messageRef}>
            <div
              className={`relative cursor-pointer p-1 rounded-full transition-colors duration-300 ${
                openDropdown === "messages" ? "bg-blue-700" : ""
              }`}
              onClick={() => toggleDropdown("messages")}
            >
              <CiMail
                className={`text-white text-2xl transition-colors duration-300 ${
                  openDropdown === "messages" ? "text-yellow-300" : ""
                }`}
              />
              {messages > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {formatCount(messages)}
                </span>
              )}
            </div>

            {/* Messages Dropdown */}
            <div
              className={`absolute left-1/2 mt-2 w-80 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden transition-transform duration-300 ease-in-out -translate-x-1/2`}
              style={{
                transformOrigin: "top",
                transform:
                  openDropdown === "messages" ? "scaleY(1)" : "scaleY(0)",
              }}
            >
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Message 1
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Message 2
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Message 3
                </li>
              </ul>
            </div>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-2 text-white cursor-pointer select-none"
              onClick={() => toggleDropdown("profile")}
            >
              <img
                src={
                  MentorData?.avatar || "https://i.ibb.co/XtrM9rc/UsersData.jpg"
                }
                alt={MentorData?.name || "Mentor Avatar"}
                className="w-12 h-12 rounded-full"
              />
              <p className="text-sm">{MentorData?.name || "Mentor"}</p>
              {openDropdown === "profile" ? (
                <FaChevronUp className="transition-transform duration-300" />
              ) : (
                <FaChevronDown className="transition-transform duration-300" />
              )}
            </div>

            {/* Profile Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden transition-transform duration-300 ease-in-out`}
              style={{
                transformOrigin: "top",
                transform:
                  openDropdown === "profile" ? "scaleY(1)" : "scaleY(0)",
              }}
            >
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Settings
                </li>

                {/* Logout Button */}
                <li
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 cursor-pointer transition-colors"
                >
                  <FiLogOut className="text-lg" />
                  <span className="font-semibold">Logout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-1/6 bg-white border-r border-gray-300 pt-1 px-2 overflow-y-auto h-[calc(100vh-64px)]">
          {sidebarLinks.map((section, i) => (
            <div key={i} className="mb-4">
              {/* Section Title */}
              {section.title && (
                <h3 className="flex items-center gap-2 font-semibold text-gray-600 pt-3 pb-2 px-2 uppercase">
                  {section.title}
                </h3>
              )}

              {/* Sidebar Links */}
              <div className="space-y-2">
                {section.links.map(({ label, path, icon: Icon, onClick }, j) =>
                  onClick ? (
                    <button
                      key={j}
                      onClick={onClick}
                      className="flex items-center gap-3 p-2 rounded-md transition-colors duration-500 overflow-hidden group text-gray-700 hover:bg-gray-200 w-full text-left cursor-pointer"
                      data-tooltip-id="sidebar-tooltip"
                      data-tooltip-content={label}
                    >
                      <Icon className="w-[20px] h-[20px] text-gray-700 group-hover:text-blue-500" />
                      <div className="overflow-container">
                        <p className="font-semibold scroll-hover">{label}</p>
                      </div>
                    </button>
                  ) : (
                    <NavLink
                      key={j}
                      to={path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-md transition-colors duration-500 overflow-hidden group ${
                          isActive
                            ? "bg-gray-200 text-blue-500"
                            : "text-gray-700 hover:bg-gray-200"
                        }`
                      }
                      data-tooltip-id="sidebar-tooltip"
                      data-tooltip-content={label}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-[20px] h-[20px] transition-colors duration-300 ${
                              isActive
                                ? "text-blue-500 fill-blue-500"
                                : "text-gray-700 fill-black group-hover:text-blue-500 group-hover:fill-blue-500"
                            }`}
                          />
                          <div className="overflow-container">
                            <p className="font-semibold scroll-hover">
                              {label}
                            </p>
                          </div>
                        </>
                      )}
                    </NavLink>
                  )
                )}
              </div>

              {/* Single Tooltip instance for all sidebar links */}
              <Tooltip
                id="sidebar-tooltip"
                place="top"
                effect="solid"
                className="bg-blue-500 text-white text-sm z-[9999]"
              />
            </div>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="w-5/6 overflow-y-auto h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      <dialog id="Create_Mentorship_Modal" className="modal">
        <CreateMentorshipModal refetch={RefetchAll} />
      </dialog>

      {/* Modals */}
      {/* Create Course Modal */}
      <dialog id="Create_Course_Modal" className="modal">
        <CreateCourseModal refetch={RefetchAll} />
      </dialog>
    </div>
  );
};

export default MentorLayout;
