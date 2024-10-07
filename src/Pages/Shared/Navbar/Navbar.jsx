import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import Logo from "../../../assets/Logo.png";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle scroll position change
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Extended nav items with more sections and submenus
  const navItems = [
    { label: "HOME", link: "/", subMenu: [] },
    { label: "JOBS", link: "/Jobs", subMenu: [] },
    { label: "GIGS", link: "/Gigs", subMenu: [] },
    { label: "BLOGS", link: "/Blogs", subMenu: [] },
    { label: "ABOUT US", link: "/About-us", subMenu: [] },
    { label: "Testimonials", link: "/Testimonials", subMenu: [] },
    {
      label: "MORE",
      link: "#",
      subMenu: [
        { label: "COMPANY PROFILES", link: "/CompanyProfiles" },
        { label: "SALARY INSIGHTS", link: "/SalaryInsights" },
        { label: "UPCOMING EVENTS", link: "/UpcomingEvents" },
        { label: "COURSES", link: "/Courses" },
        { label: "MENTORSHIP", link: "/Mentorship" },
        { label: "INTERNSHIPS", link: "/Internship", subMenu: [] },
        { label: "Why Choose Us", link: "/Why-choose-us" },
      ],
    },
  ];

  const renderNav = () =>
    navItems.map(({ label, link, subMenu }) => (
      <li key={label}>
        <div className="dropdown dropdown-hover">
          {subMenu.length > 0 ? (
            <>
              <p className="hover:text-blue-800">{label}</p>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white font-semibold z-[1] w-52 p-2 shadow"
              >
                {subMenu.map((item) => (
                  <li key={item.link}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-800 hover:bg-white bg-white text-base"
                          : "hover:text-blue-800 hover:bg-white text-base"
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <NavLink
              to={link}
              className={({ isActive }) =>
                isActive ? "text-blue-800" : "hover:text-blue-800"
              }
            >
              {label}
            </NavLink>
          )}
        </div>
      </li>
    ));

  return (
    <div>
      {/* Navbar section */}
      <div
        className={`navbar transition-all duration-300 mx-auto text-black fixed w-full z-40 ${
          scrollPosition > 50 ? "bg-white top-0" : "bg-blue-400 "
        }`}
      >
        <div className="navbar mx-auto max-w-[1200px] items-center h-16">
          {/* Navbar Start */}
          <div className="navbar-start">
            <div className="dropdown">
              <button
                tabIndex={0}
                className="btn btn-ghost lg:hidden"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <IoMenu className="text-3xl mt-2" />
              </button>
              {isDropdownOpen && (
                <ul className="menu menu-sm bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-xl">
                  {renderNav()}
                </ul>
              )}
            </div>
            <Link to={"/"}>
              <div className="flex items-center">
                <img src={Logo} alt="Logo.png" className="w-16" />
                <p className="text-xl font-bold">Master Job Shop</p>
              </div>
            </Link>
          </div>

          {/* Navbar Center */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex gap-1 px-1 space-x-5 font-semibold text-black">
              {renderNav()}
            </ul>
          </div>

          {/* Navbar End */}
          <div className="navbar-end flex gap-5">
            <div className="text-xl font-semibold bg-blue-400 hover:bg-blue-100">
              <Link to={"/SignUp"}>
                <button className="py-2 w-28">SignUp</button>
              </Link>
              <Link to={"/Login"}>
                <button className="py-2 w-32 bg-blue-600 hover:bg-white">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
