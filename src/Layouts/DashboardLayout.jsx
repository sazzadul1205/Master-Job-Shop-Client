import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { NavLink, Outlet } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import Logo from "../assets/Logo.png";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Admin/Manager Links
  const DashboardNavLink = [
    { to: "AdminOverview", label: "Admin Overview" },
    { to: "AdminManageUsers", label: "Manage Users" },
    { to: "ManageJobs", label: "Manage Jobs" },
    { to: "ManageGigs", label: "Manage Gigs" },
    { to: "ManageCompany", label: "Manage Company" },
    { to: "ManageSalaryInsight", label: "Manage Salary Insight" },
    { to: "ManageUpcomingEvent", label: "Manage Upcoming Event" },
    { to: "ManageCourses", label: "Manage Courses" },
    { to: "ManageMentorship", label: "Manage Mentorship" },
    { to: "ManageInternship", label: "Manage Internship" },
    { to: "ManageNewsLetter", label: "Manage NewsLetter" },
    { to: "ManageTestimonials", label: "Manage Testimonials" },
    { to: "ManageBlogs", label: "Manage Blogs" },
    { to: "DetailedLog", label: "Detailed Log" },
    { to: "ManageJobApplicants", label: "Manage Job Applicants" },
    { to: "ManageGigApplicant", label: "Manage Gig Applicants" },
    { to: "ManageCompanyInfo", label: "Manage Company Info" },
    { to: "ManageMyEvent", label: "Manage My Event" },
  ];

  // Generate navigation items
  const adminNav = DashboardNavLink.map((link) => {
    return (
      <li key={link.to} className="mb-2">
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            `text-lg font-semibold relative group py-2 px-4 transition-colors duration-300 rounded-none hover:text-white
              ${isActive ? "bg-blue-500 text-white" : "text-black"}`
          }
        >
          <span className="absolute inset-0 w-full h-full bg-blue-500 transition-transform duration-500 ease-out scale-x-0 origin-left group-hover:scale-x-100 z-[-1]"></span>
          <span className="relative z-10">{link.label}</span>
        </NavLink>
      </li>
    );
  });

  return (
    <div className="bg-gradient-to-br from-blue-500 to-sky-100">
      <div className="max-w-[1200px] mx-auto">
        {/* Dashboard sidebar */}
        <div className="w-80 h-screen pb-10 fixed bg-white overflow-y-auto hidden lg:block">
          {/* To Home */}
          <NavLink to="/" className="block w-full">
            <p className="text-blue-700 font-bold text-2xl py-4 pl-5 bg-sky-400 flex items-center hover:text-blue-900 transition-colors duration-300">
              <FaArrowLeft className="mr-3" />
              <span>Home</span>
            </p>
          </NavLink>

          {/* Icons */}
          <div className="flex items-center justify-center pt-5">
            <img src={Logo} alt="Logo.png" className="w-16" />
            <p className="text-xl font-bold text-black">Master Job Shop</p>
          </div>

          <ul className="menu  pb-5">
            <ul className="menu menu-vertical px-1">{adminNav}</ul>
          </ul>
        </div>

        {menuOpen && (
          <div className="w-80 h-screen pb-10 fixed bg-white overflow-y-auto z-50 top-0 right-0 lg:block">
            {/* To Home */}
            <NavLink to="/" className="block w-full">
              <p className="text-green-700 font-bold text-2xl pl-5 bg-green-400 flex items-center hover:text-green-900 transition-colors duration-300">
                <FaArrowLeft className="mr-3" />
                <span>Home</span>
              </p>
            </NavLink>

            {/* Icons */}
            <div className="flex items-center justify-center py-5">
              <img src={Logo} alt="Logo.png" className="w-16" />
              <p className="text-xl font-bold text-black">Master Job Shop</p>
            </div>

            <ul className="menu p-4 pb-5">
              <ul className="menu menu-vertical px-1">{adminNav}</ul>
            </ul>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 lg:ml-[320px] overflow-y-auto min-h-screen relative">
          <IoMenu
            className="text-5xl text-black bg-green-500 fixed top-20 opacity-70 cursor-pointer z-50 flex lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
