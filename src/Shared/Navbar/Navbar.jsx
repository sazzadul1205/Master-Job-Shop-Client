import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

// Icons
import { IoMenu } from "react-icons/io5";

// Components
import NavbarEnd from "./NavbarEnd/NavbarEnd";

// Menu items configuration
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
      { name: "UPCOMING EVENTS", path: "/Events" },
      { name: "COMPANY PROFILES", path: "/CompanyProfiles" },
    ],
  },
  { name: "TESTIMONIALS", path: "/Testimonials" },
  { name: "ABOUT US", path: "/AboutUs" },
];

const Navbar = () => {
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

  // Submenu handlers
  const handleMouseEnter = (itemName) => {
    clearTimeout(submenuTimeoutRef.current);
    setOpenSubmenu(itemName);
  };

  // Close submenu after a delay
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
      <div className="navbar flex-none w-full justify-between items-center px-0 py-2 lg:px-10">
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
        <NavbarEnd />
      </div>
    </div>
  );
};

export default Navbar;
