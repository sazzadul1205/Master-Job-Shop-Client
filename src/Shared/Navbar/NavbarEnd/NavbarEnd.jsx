import { Link } from "react-router-dom";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../..//Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../CommonButton/CommonButton";

const NavbarEnd = () => {
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();

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
  });

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

  if (UsersDataIsLoading) return <p>Loading . . . </p>;
  if (UsersDataError) return <p>Error</p>;

  return (
    <div className="navbar-end flex gap-5">
      {UsersData ? (
        // If user data exists, show dropdown with user info and logout option
        <div className="dropdown">
          <div
            className="flex items-center lg:pr-5 bg-blue-300 hover:bg-blue-200 cursor-pointer"
            tabIndex={0}
            role="button"
          >
            {/* User profile picture and name */}
            <img
              src={UsersData.photoURL}
              alt="UsersData"
              className="w-12 h-12 "
            />

            <h2 className="font-semibold pl-2 text-lg hidden lg:flex w-[200px]">
              {UsersData.displayName}
            </h2>
          </div>
          {/* Dropdown menu */}
          <ul className="dropdown-content menu bg-white z-[1] w-52 p-2 shadow right-0">
            <li className="lg:hidden">
              <p>{UsersData.displayName}</p>
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
          <Link to="/Login">
            <CommonButton
              text="Login"
              bgColor="white"
              textColor="text-blue-700"
              className="playfair shadow hover:shadow-2xl font-semibold"
              px="px-16"
              py="py-2"
              borderRadius="rounded-lg"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavbarEnd;
