import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../..//Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import CommonButton from "../../CommonButton/CommonButton";

// Icons
import { ImExit } from "react-icons/im";

// Assets
import Events from "../../../assets/Navbar/Member/Events.png";
import Profile from "../../../assets/Navbar/Member/Profile.png";
import Courses from "../../../assets/Navbar/Member/Courses.png";
import GigBids from "../../../assets/Navbar/Member/GigBids.png";
import Mentorship from "../../../assets/Navbar/Member/Mentorship.png";
import JobApplication from "../../../assets/Navbar/Member/JobApplication.png";
import InternshipApplication from "../../../assets/Navbar/Member/InternshipApplication.png";

const NavbarEnd = () => {
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State variables
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Refs for handling outside clicks
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch user data if logged in
  const {
    data: UsersData,
    isLoading: UsersDataIsLoading,
    error: UsersDataError,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: async () => {
      if (!user) return null;
      try {
        const res = await axiosPublic.get(`/Users?email=${user?.email}`);
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

  // Role-based navigation links
  const roleBasedLinks = {
    Member: [
      {
        name: "My Job Application's",
        path: `/MyJobApplications`,
        img: JobApplication,
      },
      {
        name: "My Gig Bid's",
        path: `/MyGigBids`,
        img: GigBids,
      },
      {
        name: "My Internship's",
        path: `/MyInternshipApplications`,
        img: InternshipApplication,
      },
      {
        name: "My Mentorship",
        path: `/MyMentorshipApplication`,
        img: Mentorship,
      },
      {
        name: "My Courses",
        path: `/MyCourseApplications`,
        img: Courses,
      },
      {
        name: "My Events",
        path: `/MyEventApplications`,
        img: Events,
      },
      {
        name: "My Profile",
        path: `/MyProfile`,
        img: Profile,
      },
    ],
    Company: [
      {
        name: "Company Dashboard",
        path: `/Employer/Company/Dashboard`,
        img: Profile,
      },
    ],
    Employer: [
      {
        name: "Employer Dashboard",
        path: `/Employer/Employer/Dashboard`,
        img: Profile,
      },
    ],
    NoRole: [ // 👈 fallback menu
      {
        name: "Complete Your Details",
        path: `/SignUp/Details`,
        img: Profile, // you can replace with another icon if you want
      },
    ],
  };


  // Logout function
  const handleLogOut = async () => {
    // Handle logout with Swal alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setIsLoggingOut(true);
      try {
        const response = await logOut();

        if (response.success) {
          setIsDropdownOpen(false);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: `Error logging out: ${error.message}`,
          confirmButtonColor: "#d33",
          timer: 3000,
        });
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Auto-close dropdown after 5 seconds of inactivity
  useEffect(() => {
    if (isDropdownOpen) {
      timerRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDropdownOpen]);

  // Clear auto-close timer on mouse enter, restart on leave
  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Restart auto-close timer on mouse leave
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 1000);
  };

  // If State Error / Loading UI
  if (UsersDataIsLoading) return <p>Loading . . . </p>;
  if (UsersDataError) return <p>Error</p>;

  return (
    <div className="navbar-end flex items-center">
      {/* Show user avatar if logged in, otherwise show login button */}
      {user ? (
        <div
          className="relative rounded-full border-2 border-white hover:border-gray-300"
          ref={dropdownRef}
        >
          {/* User profile picture */}
          <img
            src={
              UsersData?.profileImage ||
              "https://i.ibb.co.com/XtrM9rc/UsersData.jpg"
            }
            alt="User Avatar"
            className="w-15 h-15 rounded-full cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-1 min-w-[280px] bg-white text-black z-10"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <ul className="py-2">
                {(roleBasedLinks[UsersData?.role] || roleBasedLinks.NoRole).map((link) => (
                  <li
                    key={link.name}
                    className="flex py-2 px-5 gap-2 hover:bg-gray-100 border-b border-gray-300"
                  >
                    <Link to={link.path} className="flex items-center gap-2 w-full">
                      <span className="border-r border-black pr-2">
                        <img src={link.img} className="w-5" alt="" />
                      </span>
                      <span className="font-semibold">{link.name}</span>
                    </Link>
                  </li>
                ))}

                {/* Logout button */}
                <li
                  className="p-2 py-2 px-5 text-red-500 font-semibold hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                  onClick={handleLogOut}
                >
                  {isLoggingOut ? (
                    <>
                      <ImExit className="text-2xl border-r border-black pr-2" />
                      Logging Out...
                    </>
                  ) : (
                    <>
                      <ImExit className="text-2xl border-r border-black pr-2" />
                      Logout
                    </>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Link to="/Login">
          <CommonButton
            type="button"
            text="Login"
            bgColor="white"
            textColor="text-blue-700"
            className="playfair shadow hover:shadow-2xl font-semibold"
            px="px-10 md:px-14"
            py="py-2"
            borderRadius="rounded-lg"
            width="auto"
          />
        </Link>
      )}
    </div>
  );
};

export default NavbarEnd;
