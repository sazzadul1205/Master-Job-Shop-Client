import { useContext, useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import Logo from "../assets/Logo.png";
import { AuthContext } from "../Provider/AuthProvider";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Pages/Shared/Loader/Loader";

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    data: MyUsers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["MyUsers"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user.email}`).then((res) => res.data),
  });

  // Determine the role of the user
  const userRole = MyUsers.role;

  useEffect(() => {
    // Redirect based on user role
    if (userRole === "Admin" || userRole === "Manager") {
      navigate("/Dashboard/AdminOverview"); // Redirect to AdminOverview
    } else if (userRole === "Member") {
      navigate("/Dashboard/UserOverview"); // Redirect to UserOverview
    } else {
      // Handle cases for other roles if necessary
    }
  }, [userRole, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Admin/Manager Links
  const adminNavLinks = [
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
  ];

  // User Links (for non-admins/managers)
  const userNavLinks = [
    { to: "UserOverview", label: "User Overview" },
    { to: "ManageJobApplicants", label: "Manage Job Applicants" },
    { to: "ManageGigApplicant", label: "Manage Gig Applicants" },
    { to: "ManageCompanyInfo", label: "Manage Company Info" },
    { to: "ManageMyEvent", label: "Manage My Event" },
    { to: "ManageMyCourse", label: "Manage My Course" },
    { to: "ManageMyMentorship", label: "Manage My Mentorship" },
    { to: "ManageMyInternship", label: "Manage My Internship" },
    { to: "ManageMyTestimonials", label: "Manage My Testimonial" },
    { to: "ManageMyBlogs", label: "Manage My Blogs" },
  ];

  const adminNav = adminNavLinks.map((link) => {
    return (
      <li key={link.to} className="mb-2">
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            `text-lg font-semibold relative group py-2 px-4 transition-colors duration-300 rounded-none hover:text-white
              ${isActive ? "bg-blue-500 text-white" : "text-black"}`
          }
          onClick={() => setMenuOpen(false)} // Close the drawer when a link is clicked
        >
          <span className="absolute inset-0 w-full h-full bg-blue-500 transition-transform duration-500 ease-out scale-x-0 origin-left group-hover:scale-x-100 z-[-1]"></span>
          <span className="relative z-10">{link.label}</span>
        </NavLink>
      </li>
    );
  });

  const userNav = userNavLinks.map((link) => {
    return (
      <li key={link.to} className="mb-2">
        <NavLink
          to={link.to}
          className={({ isActive }) =>
            `text-lg font-semibold relative group py-2 px-4 transition-colors duration-300 rounded-none hover:text-white
              ${isActive ? "bg-blue-500 text-white" : "text-black"}`
          }
          onClick={() => setMenuOpen(false)} // Close the drawer when a link is clicked
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
            <img src={Logo} alt="Logo" className="w-16" />
            <p className="text-xl font-bold text-black">Master Job Shop</p>
          </div>

          {/* Render admin or user links based on role */}
          <ul className="menu pb-5">
            {userRole === "Admin" || userRole === "Manager" ? (
              <ul className="menu menu-vertical px-1">{adminNav}</ul>
            ) : (
              <ul className="menu menu-vertical px-1">{userNav}</ul>
            )}
          </ul>
        </div>

        {menuOpen && (
          <div className="w-80 h-screen pb-10 fixed bg-white overflow-y-auto z-50 top-0 right-0 lg:block">
            {/* To Home */}
            <NavLink to="/" className="block w-full">
              <p className="text-blue-700 font-bold text-3xl pl-5 py-2 bg-blue-400 flex items-center hover:text-green-900 transition-colors duration-300">
                <FaArrowLeft className="mr-3" />
                <span>Home</span>
              </p>
            </NavLink>

            {/* Icons */}
            <div className="flex items-center justify-center py-5">
              <img src={Logo} alt="Logo" className="w-16" />
              <p className="text-xl font-bold text-black">Master Job Shop</p>
            </div>

            {/* Render admin or user links based on role */}
            <ul className="menu p-4 pb-5">
              {userRole === "Admin" || userRole === "Manager" ? (
                <ul className="menu menu-vertical px-1">{adminNav}</ul>
              ) : (
                <ul className="menu menu-vertical px-1">{userNav}</ul>
              )}
            </ul>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 lg:ml-[320px] overflow-y-auto min-h-screen relative">
          <IoMenu
            className="text-5xl text-black bg-blue-500 fixed top-20 opacity-70 cursor-pointer z-50 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
