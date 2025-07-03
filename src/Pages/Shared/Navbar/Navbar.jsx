import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

// Icons
import { IoMenu } from "react-icons/io5";

// Packages
import Swal from "sweetalert2";

// Hooks
import useAuth from "../../../Hooks/useAuth";

const MenuItems = [
  { name: "HOME", path: "/" },
  { name: "JOBS", path: "/Jobs" },
  { name: "GIGS", path: "/Gigs" },
  { name: "BLOGS", path: "/Blogs" },
  {
    name: "MORE",
    path: "#",
    submenu: [
      { name: "COURSES", path: "/Courses" },
      { name: "MENTORSHIP", path: "/Mentorship" },
      { name: "INTERNSHIPS", path: "/Internship" },
      { name: "UPCOMING EVENTS", path: "/UpcomingEvents" },
      { name: "SALARY INSIGHTS", path: "/SalaryInsights" },
      { name: "COMPANY PROFILES", path: "/CompanyProfiles" },
    ],
  },
  { name: "TESTIMONIALS", path: "/Testimonials" },
  { name: "ABOUT US", path: "/AboutUS" },
];

const Navbar = () => {
  const { user, logOut } = useAuth();

  // State variables
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Refs
  const menuRef = useRef(null);
  const submenuTimeoutRef = useRef(null);

  // Scroll and click outside handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenSubmenu(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
      clearTimeout(submenuTimeoutRef.current);
    };
  }, []);

  // Handle logout with Swal alert
  const handleSignOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have successfully logged out!",
          confirmButtonColor: "#3085d6",
          timer: 2000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: `Error logging out: ${error.message}`,
          confirmButtonColor: "#d33",
          timer: 3000,
        });
        console.error("Error signing out:", error);
      });
  };

  // Submenu handlers
  const handleMouseEnter = (itemName) => {
    clearTimeout(submenuTimeoutRef.current);
    setOpenSubmenu(itemName);
  };

  const handleMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 300);
  };

  return (
    <div
      className={`navbar fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-bl from-blue-300/90 to-blue-600/90"
          : "bg-transparent"
      }`}
    >
      <div className="navbar flex-none w-full justify-between items-center px-0 py-0 lg:px-10">
        {/* Navbar Start */}
        <div className="navbar-start flex items-center py-0">
          {/* Mobile Menu Button */}
          <label
            htmlFor="my-drawer-4"
            className="btn btn-ghost lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            <IoMenu className="text-3xl text-white" />
          </label>

          {/* Logo */}
          <NavLink
            to="/"
            className="ml-2 rounded-md transition-all duration-200"
          >
            <div className="hidden md:flex items-center ">
              <p className="text-2xl font-semibold playfair">Master Job Shop</p>
            </div>
          </NavLink>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex space-x-6 px-4 text-white font-semibold text-[17px] tracking-wide font-playfair">
            {MenuItems.map((item) => (
              <li
                key={item.name}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.submenu ? (
                  <>
                    <div className="flex items-center gap-1 text-white hover:text-[#FFC107] cursor-pointer transition-colors duration-200">
                      {item.name}
                      <span className="text-xs">&#9662;</span> {/* ▼ arrow */}
                    </div>

                    {/* Submenu */}
                    <ul
                      className={`absolute left-0 w-56 bg-linear-to-tl from-blue-300 to-blue-600 text-white z-50 p-2 shadow-2xl mt-2 rounded-md transform transition-all duration-200 ease-out ${
                        openSubmenu === item.name
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                      ref={menuRef}
                      onMouseEnter={() =>
                        clearTimeout(submenuTimeoutRef.current)
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.submenu.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                                isActive
                                  ? "text-[#FFC107] font-bold"
                                  : "hover:text-[#FFC107]"
                              }`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `transition-colors duration-200 ${
                        isActive
                          ? "text-[#FFC107] font-bold"
                          : "hover:text-[#FFC107]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end flex gap-5">
          {user ? (
            <div className="dropdown">
              <div
                className="flex items-center lg:pr-5 bg-blue-300 hover:bg-blue-200 cursor-pointer"
                tabIndex={0}
                role="button"
              >
                <img src={user.photoURL} alt="User" className="w-12 h-12 " />
                <h2 className="font-semibold pl-2 text-lg hidden lg:flex w-[200px]">
                  {user.displayName}
                </h2>
              </div>
              {/* Dropdown menu */}
              <ul className="dropdown-content menu bg-white z-[1] w-52 p-2 shadow right-0">
                <li className="lg:hidden">
                  <p>{user.displayName}</p>
                </li>
                <li>
                  <Link
                    to={"/Dashboard"}
                    className="py-3 hover:bg-blue-200 rounded-none font-semibold"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="font-bold bg-blue-500 hover:bg-blue-400 rounded-none text-white py-3"
                    onClick={handleSignOut}
                  >
                    LogOut
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="text-xl flex font-semibold">
              <Link to={"/SignUp"}>
                <button className="py-2 px-6 w-32 bg-blue-500 hover:bg-blue-100 hidden md:block">
                  SignUp
                </button>
              </Link>
              <Link to={"/Login"}>
                <button className="py-2 px-6 w-32 bg-blue-600 hover:bg-blue-300 text-white">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
