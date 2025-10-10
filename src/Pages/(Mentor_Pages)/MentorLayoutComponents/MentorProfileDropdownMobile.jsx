import { useNavigate } from "react-router-dom";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Icons
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

// Hooks
import useAuth from "../../../Hooks/useAuth";

const MentorProfileDropdownMobile = ({
  MentorData,
  profileRef,
  openDropdown,
  toggleDropdown,
}) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  // Handle toggle click
  const handleToggleClick = () => {
    Swal.fire({
      icon: "info",
      title: "Feature Unavailable",
      html: `
          Light / Dark Mode switching is currently not available.<br/>
          This feature will be implemented in a future update to enhance your UI experience.
        `,
      confirmButtonText: "Okay",
      confirmButtonColor: "#2563EB",
    });
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/Login");
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
    <div ref={profileRef} className="relative flex flex-col items-center">
      {/* Avatar button */}
      <button
        onClick={() => toggleDropdown("profile")}
        className="dock-label focus:outline-none"
      >
        <img
          src={MentorData?.avatar || "https://i.ibb.co/XtrM9rc/UsersData.jpg"}
          alt={MentorData?.name || "Mentor Avatar"}
          className="w-14 h-14 rounded-full border-4 border-white bg-white shadow-md"
        />
      </button>

      {/* Drop-up menu */}
      <div
        className={`absolute bottom-16 w-72 bg-white text-black rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out
          ${
            openDropdown === "profile"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0"
          }
          origin-bottom
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
          <img
            src={MentorData?.avatar || "https://i.ibb.co/XtrM9rc/UsersData.jpg"}
            alt={MentorData?.name || "Mentor Avatar"}
            className="w-12 h-12 rounded-full border"
          />
          <div>
            <p className="font-semibold text-gray-800">{MentorData?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">
              Mentor Account
            </p>
          </div>
        </div>

        {/* Links */}
        <ul className="py-2">
          <li
            onClick={() => navigate("/Mentor/Profile")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <CgProfile className="text-lg text-blue-600" />
            <span className="font-medium">View Profile</span>
          </li>

          <li
            onClick={() => navigate("/Mentor/Settings")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <IoSettingsOutline className="text-lg text-blue-600" />
            <span className="font-medium">Settings</span>
          </li>

          <li
            onClick={() => navigate("/Mentor/Messages")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <FaRegMessage className="text-lg text-blue-600" />
            <span className="font-medium">Messages</span>
          </li>

          <li
            onClick={handleToggleClick}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            <span className="flex items-center gap-2 font-medium text-gray-800">
              🌙 Dark Mode
            </span>
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-primary"
            />
          </li>
        </ul>

        {/* Logout */}
        <div className="border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-50 text-red-600 font-semibold transition-colors"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// PropTypes Validation
MentorProfileDropdownMobile.propTypes = {
  toggleDropdown: PropTypes.func.isRequired,
  profileRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  openDropdown: PropTypes.string,
  MentorData: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default MentorProfileDropdownMobile;
