import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import Swal from "sweetalert2"; // Import SweetAlert
import Logo from "../../../assets/Logo.png";
import { AuthContext } from "../../../Provider/AuthProvider";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

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

  const closeDropdown = () => {
    setIsDropdownOpen(false); // Close dropdown after link click
  };

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
        { label: "INTERNSHIPS", link: "/Internship" },
        { label: "Why Choose Us", link: "/Why-choose-us" },
      ],
    },
  ];

  const renderNav = () =>
    navItems.map(({ label, link, subMenu }) => (
      <li key={label} className="relative">
        <div className="dropdown dropdown-hover">
          {subMenu.length > 0 ? (
            <>
              <p className="hover:text-blue-800 cursor-pointer">{label}</p>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white font-semibold z-[1] w-52 p-2 shadow"
              >
                {subMenu.map((item) => (
                  <li key={item.link} onClick={closeDropdown}>
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
              onClick={closeDropdown}
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
          scrollPosition > 50 ? "bg-white top-0" : "bg-blue-400"
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
          <div className="navbar-end flex gap-5 items-center">
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  className="flex items-center lg:pr-5 bg-blue-300 hover:bg-blue-200 cursor-pointer"
                  tabIndex={0}
                >
                  <img src={user.photoURL} alt="User" className="w-12 h-12 " />
                  <h2 className="font-semibold lg:pl-2 text-lg hidden lg:flex">
                    {user.displayName}
                  </h2>
                </div>
                <ul className="dropdown-content menu bg-white z-[1] w-full shadow right-0">
                  <li className="lg:hidden">
                    <p>{user.displayName}</p>
                  </li>
                  <li>
                    <Link to={"/Dashboard"}>Dashboard</Link>
                  </li>
                  <li>
                    <button
                      className="font-bold mx-2 bg-blue-500 hover:bg-blue-400 rounded-none text-white"
                      onClick={handleSignOut}
                    >
                      LogOut
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="text-xl font-semibold">
                <Link to={"/SignUp"}>
                  <button className="py-2 px-6 w-32 bg-blue-500 hover:bg-blue-100">
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
    </div>
  );
};

export default Navbar;
