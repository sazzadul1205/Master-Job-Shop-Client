import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPowerOff } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useAuth from "../Hooks/useAuth";

// Shared
import Loading from "../Shared/Loading/Loading";
import Error from "../Shared/Error/Error";

const EmployerLayout = () => {
  const { user, loading, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Navigate hook for redirection
  const navigate = useNavigate();

  // State for logout loading
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Fetch user data if logged in
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

  // Loading / Error UI Handling
  if (EmployerDataIsLoading || loading) return <Loading />;
  if (EmployerDataError) return <Error />;

  // Handle logout
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
    <div className="min-h-screen bg-linear-to-bl from-blue-100 to-white ">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white shadow-2xl w-full px-5 py-3">
        {/* Left Side */}
        <img
          src={
            EmployerData?.profileImage ||
            "https://i.ibb.co.com/XtrM9rc/UsersData.jpg"
          }
          alt="User Avatar"
          className="w-15 h-15 rounded-full cursor-pointer"
        />

        {/* center  Side */}
        <div className="flex items-center h-full gap-2">
          <p className="text-xl font-semibold playfair text-black">
            Master Job Shop
          </p>
          <p className="text-xl font-semibold playfair text-black py-1">
            [ Employer Panel ]
          </p>
        </div>

        {/* Right Side */}
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
    </div>
  );
};

export default EmployerLayout;
