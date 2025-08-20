import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";

// Icons
import { CiMail } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Assets - Icons
import MyCoursesIcon from "../assets/MentorLayoutIcons/MyCoursesIcon";
import DashboardIcon from "../assets/MentorLayoutIcons/DashboardIcon";
import MyMentorshipIcon from "../assets/MentorLayoutIcons/MyMentorshipIcon";
import ApplicationsIcon from "../assets/MentorLayoutIcons/ApplicationsIcon";

const MentorLayout = () => {
  // State for dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs for handling outside clicks
  const profileRef = useRef(null);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = 22;
  const messages = 15;

  const formatCount = (count) => (count > 1200 ? "99+" : count);

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

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-100 to-white">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-[#002242] shadow-2xl w-full px-5 py-3">
        {/* Logo */}
        <NavLink className="ml-2 rounded-md transition-all duration-200 text-white">
          <div className="hidden md:flex items-center ">
            <p className="text-xl font-semibold playfair">Master Job Shop</p>
          </div>
        </NavLink>

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
                src="https://i.ibb.co/XtrM9rc/UsersData.jpg"
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              <p className="text-sm">User Name</p>
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
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-1/6 shadow-2xl min-h-screen bg-white border-t border-r-3 border-gray-400 pt-8 px-2">
          {/* Dashboard Link */}
          <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500">
            <DashboardIcon className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
            <p className="font-semibold transition-colors duration-300 group-hover:text-blue-500">
              Dashboard
            </p>
          </div>

          {/* Mentorship Management Title */}
          <h3 className="font-semibold text-gray-600 pt-5 pb-3 px-4">
            Mentorship Management
          </h3>

          {/* Mentorship Management Links */}
          <div className="space-y-2">
            {/* My Mentorship Link */}
            <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500 overflow-hidden">
              <MyMentorshipIcon className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
              <p className="font-semibold transition-colors duration-300 group-hover:text-blue-500">
                My Mentorship&apos;s
              </p>
            </div>

            {/* My Mentorship Link */}
            <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500 overflow-hidden">
              <ApplicationsIcon className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
              <div className="relative overflow-hidden w-[220px]">
                <p className="font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-blue-500 scroll-text">
                  Mentorship Applications Management
                </p>
              </div>
            </div>

            {/* My Mentorship Link */}
            <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500 overflow-hidden">
              <IoAddSharp className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
              <p className="font-semibold transition-colors duration-300 group-hover:text-blue-500">
                Create Mentorship
              </p>
            </div>
          </div>

          {/* Course Management Title */}
          <h3 className="font-semibold text-gray-600 pt-5 pb-3 px-4">
            Course Management
          </h3>

          {/* Course Management Links */}
          <div className="space-y-2">
            {/* My Course Link */}
            <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500 overflow-hidden">
              <MyCoursesIcon className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
              <p className="font-semibold transition-colors duration-300 group-hover:text-blue-500">
                My Course&apos;s
              </p>
            </div>

            {/* My Course Link */}
            <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500 overflow-hidden">
              <ApplicationsIcon className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
              <div className="relative overflow-hidden w-[220px]">
                <p className="font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-blue-500 scroll-text">
                  Course Applications Management
                </p>
              </div>
            </div>

            {/* My Course Link */}
            <div className="flex items-center gap-3 cursor-pointer group p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-500 overflow-hidden">
              <IoAddSharp className="w-[20px] h-[20px] fill-black transition-colors duration-300 group-hover:fill-blue-500" />
              <p className="font-semibold transition-colors duration-300 group-hover:text-blue-500">
                Create Course
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Main Content Area */}
        <div className="w-5/6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MentorLayout;
