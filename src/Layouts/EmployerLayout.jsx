import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaBuilding, FaPowerOff } from "react-icons/fa";
import { MdDashboardCustomize, MdWork } from "react-icons/md";

// Hooks
import useAuth from "../Hooks/useAuth";
import useAxiosPublic from "../Hooks/useAxiosPublic";

// Shared Components
import Error from "../Shared/Error/Error";
import Loading from "../Shared/Loading/Loading";

// Assets - Job
import form from "../assets/EmployerLayout/form.png";
import formUp from "../assets/EmployerLayout/formUp.png";

// Assets - Gig
import Gig from "../assets/EmployerLayout/Gig/Gig.png";
import GigBlue from "../assets/EmployerLayout/Gig/GigBlue.png";

// Assets - Bid
import Bid from "../assets/EmployerLayout/Bid/Bid.png";
import BidBlue from "../assets/EmployerLayout/Bid/BidBlue.png";

// Assets - Internship
import Internship from "../assets/EmployerLayout/Internship/Internship.png";
import InternshipBlue from "../assets/EmployerLayout/Internship/InternshipBlue.png";

// Assets - InternshipApplication
import InternshipApplication from "../assets/EmployerLayout/InternshipApplication/InternshipApplication.png";
import InternshipApplicationBlue from "../assets/EmployerLayout/InternshipApplication/InternshipApplicationBlue.png";

// Navigation items
const navItems = [
  {
    label: "Dashboard",
    path: "/Employer/Dashboard",
    icon: <MdDashboardCustomize />,
  },
  {
    label: "Company Profile",
    path: "/Employer/CompanyProfile",
    icon: <FaBuilding />,
  },
  {
    label: "Manage Jobs",
    path: "/Employer/Jobs",
    icon: <MdWork />,
  },
  {
    label: "Manage Job Applications",
    path: "/Employer/JobApplications",
    assets: form,
    activeAssets: formUp,
  },
  {
    label: "Manage Gigs",
    path: "/Employer/Gigs",
    assets: Gig,
    activeAssets: GigBlue,
  },
  {
    label: "Manage Gig Bids",
    path: "/Employer/GigBids",
    assets: Bid,
    activeAssets: BidBlue,
  },
  {
    label: "Manage Internship",
    path: "/Employer/Internship",
    assets: Internship,
    activeAssets: InternshipBlue,
  },
  {
    label: "Manage Internship Applications",
    path: "/Employer/InternshipApplications",
    assets: InternshipApplication,
    activeAssets: InternshipApplicationBlue,
  },
];

// Component for rendering image-based nav items
const NavLinkImage = ({
  label,
  assets,
  activeAssets,
  hoveredPath,
  isActive,
  path,
}) => {
  const isHoveredOrActive = hoveredPath === path || isActive;
  return (
    <img
      src={isHoveredOrActive ? activeAssets || assets : assets}
      alt={label}
      className="w-5 h-5"
    />
  );
};

// Prop types for NavLinkImage
NavLinkImage.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  assets: PropTypes.string.isRequired,
  activeAssets: PropTypes.string,
  hoveredPath: PropTypes.string,
  isActive: PropTypes.bool,
};

// Main Employer Layout Component
const EmployerLayout = () => {
  const { user, loading, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // State variables [ logoutLoading , hoveredPath ]
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  // Fetch Employer data using user email
  const {
    data: EmployerData,
    isLoading: EmployerDataIsLoading,
    error: EmployerDataError,
  } = useQuery({
    queryKey: ["EmployerData"],
    queryFn: async () => {
      if (!user) return null;
      try {
        const res = await axiosPublic.get(`/Employers?email=${user?.email}`);
        return res.data;
      } catch (error) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  // Handle loading & error states
  if (EmployerDataIsLoading || loading) return <Loading />;
  if (EmployerDataError) return <Error />;

  // Logout handler
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-bl from-blue-100 to-white">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-white shadow-2xl w-full px-5 py-3">
        {/* Profile section */}
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <img
            src={
              EmployerData?.profileImage ||
              "https://i.ibb.co.com/XtrM9rc/UsersData.jpg"
            }
            alt="User Avatar"
            className="w-15 h-15 rounded-full cursor-pointer border-2 border-blue-500"
          />

          {/* Employer Name */}
          <h3 className="text-black text-lg font-semibold">
            {EmployerData?.EmployerName}
          </h3>
        </div>

        {/* Site Title */}
        <div className="flex items-center h-full gap-2">
          <p className="text-xl font-semibold playfair text-black">
            Master Job Shop
          </p>
          <p className="text-xl font-semibold playfair text-black py-1">
            [ Employer Panel ]
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded cursor-pointer transition-colors duration-200 disabled:opacity-50"
        >
          {logoutLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <FaPowerOff /> Log Out
            </>
          )}
        </button>
      </div>

      {/* Sidebar & Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-1/6 shadow-2xl min-h-screen bg-white border-t border-gray-400">
          <ul className="text-center">
            {navItems.map(({ label, path, icon, assets, activeAssets }) => (
              <li
                key={path}
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <NavLink to={path}>
                  {({ isActive }) => (
                    <div
                      className={`group relative flex flex-col items-start gap-1 text-base font-semibold px-2 py-3 mx-2 ${
                        isActive
                          ? "text-blue-700"
                          : "text-black hover:text-blue-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {icon ? (
                          icon
                        ) : (
                          <NavLinkImage
                            path={path}
                            label={label}
                            assets={assets}
                            activeAssets={activeAssets}
                            hoveredPath={hoveredPath}
                            isActive={isActive}
                          />
                        )}
                        {label}
                      </div>
                      <span
                        className={`block h-[2px] bg-blue-700 transition-all duration-500 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Dynamic Main Content Area */}
        <div className="w-5/6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployerLayout;
