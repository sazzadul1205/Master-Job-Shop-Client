import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";

// Packages
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Icons
import {
  IoAddSharp,
  IoSettingsOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { FaRegMessage } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";

// Assets
import MenteesIcon from "../assets/MentorLayoutIcons/MenteesIcon";
import SessionsIcon from "../assets/MentorLayoutIcons/SessionsIcon";
import MyCoursesIcon from "../assets/MentorLayoutIcons/MyCoursesIcon";
import DashboardIcon from "../assets/MentorLayoutIcons/DashboardIcon";
import MyMentorshipIcon from "../assets/MentorLayoutIcons/MyMentorshipIcon";
import ApplicationsIcon from "../assets/MentorLayoutIcons/ApplicationsIcon";

// Modals
import CreateCourseModal from "../Pages/(Mentor_Pages)/MentorMyCourses/CreateCourseModal/CreateCourseModal";
import CreateMentorshipModal from "../Pages/(Mentor_Pages)/MentorMyMentorship/CreateMentorshipModal/CreateMentorshipModal";

// Shared
import Loading from "../Shared/Loading/Loading";
import Error from "../Shared/Error/Error";

// Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Functions
import { useSwipeToOpenDrawer } from "../Hooks/useSwipeToOpenDrawer";

// Components
import MentorProfileDropdown from "../Pages/(Mentor_Pages)/MentorLayoutComponents/MentorProfileDropdown";
import MentorNotificationsDropdown from "../Pages/(Mentor_Pages)/MentorLayoutComponents/MentorNotificationsDropdown";
import MentorProfileDropdownMobile from "../Pages/(Mentor_Pages)/MentorLayoutComponents/MentorProfileDropdownMobile";
import MentorNotificationsDropdownMobile from "../Pages/(Mentor_Pages)/MentorLayoutComponents/MentorNotificationsDropdownMobile";

// Navbar Links
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
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Dropdown refs
  const profileRef = useRef(null);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);

  // Swipe drawer (custom hook)
  useSwipeToOpenDrawer(setIsDrawerOpen);

  // Fetch mentor data
  const {
    data: MentorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "auto";
  }, [isDrawerOpen]);

  // Click outside dropdown closes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !profileRef.current?.contains(event.target) &&
        !notificationRef.current?.contains(event.target) &&
        !messageRef.current?.contains(event.target)
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

  // Check for Loading
  if (isLoading || loading) return <Loading />;

  // Check for errors
  if (error) return <Error message="Failed to load mentor data." />;

  const toggleDropdown = (name) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  // Refetch all queries
  const RefetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["MentorshipData"] });
    queryClient.invalidateQueries({ queryKey: ["MyMentorshipData"] });
    queryClient.invalidateQueries({ queryKey: ["MyMentorshipApplications"] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-100 to-white flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between md:justify-between items-center bg-[#002242] shadow-2xl w-full px-5 py-8 md:py-2 relative">
        {/* Logo */}
        <NavLink className="text-white absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <div className="flex items-center">
            <p className="text-xl font-semibold playfair">Master Job Shop</p>
          </div>
        </NavLink>

        {/* Desktop dropdowns */}
        <div className="hidden md:flex items-center gap-7 ml-auto">
          <MentorNotificationsDropdown
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            notificationRef={notificationRef}
          />
          <MentorProfileDropdown
            profileRef={profileRef}
            MentorData={MentorData}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-1/6 bg-white border-r border-gray-300 pt-1 px-2 h-[calc(100vh-64px)] overflow-y-auto">
          {sidebarLinks.map((section, i) => (
            <div key={i} className="mb-4">
              {section.title && (
                <h3 className="flex items-center gap-2 font-semibold text-gray-600 pt-3 pb-2 px-2 uppercase truncate">
                  {section.title}
                </h3>
              )}
              <div className="space-y-2">
                {section.links.map(({ label, path, icon: Icon, onClick }, j) =>
                  onClick ? (
                    <button
                      key={j}
                      onClick={onClick}
                      className="flex items-center gap-3 p-2 rounded-md transition-colors duration-500 overflow-hidden text-ellipsis whitespace-nowrap text-gray-700 hover:bg-gray-200 w-full text-left"
                      data-tooltip-id="sidebar-tooltip"
                      data-tooltip-content={label}
                    >
                      <Icon className="w-[20px] h-[20px] text-gray-700 flex-shrink-0 group-hover:text-blue-500" />
                      <p className="font-semibold truncate">{label}</p>
                    </button>
                  ) : (
                    <NavLink
                      key={j}
                      to={path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-md transition-colors duration-500 w-full overflow-hidden whitespace-nowrap text-ellipsis ${
                          isActive
                            ? "bg-gray-200 text-blue-500"
                            : "text-gray-700 hover:bg-gray-200"
                        }`
                      }
                      data-tooltip-id="sidebar-tooltip"
                      data-tooltip-content={label}
                    >
                      <Icon className="w-[20px] h-[20px] flex-shrink-0" />
                      <p className="font-semibold truncate">{label}</p>
                    </NavLink>
                  )
                )}
              </div>
            </div>
          ))}
          <Tooltip
            id="sidebar-tooltip"
            place="top"
            effect="solid"
            className="bg-blue-500 text-white text-sm z-[9999]"
          />
        </aside>

        {/* Content */}
        <main className="w-full md:w-5/6 md:h-[calc(100vh-64px)] md:overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile drawer button + dropdowns */}
        <div className="flex md:hidden dock z-50 gap-3 items-center">
          {/* Drawer button */}
          <button
            className="drawer-toggle-btn flex items-center gap-2 text-white text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawerOpen((prev) => !prev);
            }}
          >
            {isDrawerOpen ? (
              <>
                <ImCross className="text-white text-xl" />
                <span className="dock-label">Close</span>
              </>
            ) : (
              <>
                <GiHamburgerMenu className="text-white text-2xl" />
                <span className="dock-label">Navigation</span>
              </>
            )}
          </button>

          {/* Profile */}
          <MentorProfileDropdownMobile
            MentorData={MentorData}
            profileRef={profileRef}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
          />

          {/* Notifications */}
          <MentorNotificationsDropdownMobile
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            notificationRef={notificationRef}
          />
        </div>

        {/* Drawer overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* Mobile Drawer Content */}
        <div
          className={`fixed top-0 left-0 h-full w-4/5 bg-white p-4 pb-20 transform transition-transform duration-300 ease-in-out z-40 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          } `}
          style={{
            WebkitOverflowScrolling: "touch", // enables momentum scroll
            overscrollBehavior: "contain", // prevents background scroll
          }}
        >
          <div className="h-full overflow-y-auto">
            {sidebarLinks.map((section, i) => (
              <div key={i} className="mb-6 last:mb-0">
                {section.title && (
                  <h3 className="font-semibold text-black uppercase mb-2 truncate">
                    {section.title}
                  </h3>
                )}
                <div className="flex flex-col space-y-2">
                  {section.links.map(
                    ({ label, path, icon: Icon, onClick }, j) =>
                      onClick ? (
                        <button
                          key={j}
                          onClick={() => {
                            onClick();
                            setIsDrawerOpen(false);
                          }}
                          className="flex items-center gap-3 p-2 rounded-md transition-colors duration-500 overflow-hidden whitespace-nowrap text-ellipsis text-gray-700 hover:bg-gray-200 w-full text-left"
                        >
                          <Icon className="w-5 h-5 flex-shrink-0 text-black group-hover:text-blue-500" />
                          <span className="font-semibold truncate">
                            {label}
                          </span>
                        </button>
                      ) : (
                        <NavLink
                          key={j}
                          to={path}
                          onClick={() => setIsDrawerOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-md transition-colors duration-500 w-full overflow-hidden whitespace-nowrap text-ellipsis ${
                              isActive
                                ? "bg-gray-200 text-blue-500"
                                : "text-black hover:bg-gray-200"
                            }`
                          }
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-semibold truncate">
                            {label}
                          </span>
                        </NavLink>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Modals ---------- */}

      {/* --------- Create Mentorship Modal --------- */}
      <dialog id="Create_Mentorship_Modal" className="modal">
        <CreateMentorshipModal refetch={RefetchAll} />
      </dialog>

      {/* --------- Create Course Modal --------- */}
      <dialog id="Create_Course_Modal" className="modal">
        <CreateCourseModal refetch={RefetchAll} />
      </dialog>
    </div>
  );
};

export default MentorLayout;
