import { Link } from "react-router-dom";

// Hooks
import useAuth from "../../../../Hooks/useAuth";

// Swal Alert
import Swal from "sweetalert2";

const NavbarEnd = () => {
  const { user, logOut } = useAuth();

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

  return (
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
  );
};

export default NavbarEnd;
