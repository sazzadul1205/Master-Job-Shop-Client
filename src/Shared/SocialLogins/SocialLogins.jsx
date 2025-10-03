import { useNavigate, useLocation } from "react-router-dom";

// Icons
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// Packages
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const SocialLogins = () => {
  const axiosPublic = useAxiosPublic();

  // Auth
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  // Shared
  const navigate = useNavigate();
  const location = useLocation();

  // Support both router state and query param fallback
  const from = location.state?.from?.pathname || "/";

  // Log login history
  const logLoginHistory = async (user) => {
    try {
      await axiosPublic.post("/LoginHistory", {
        uid: user.uid,
        email: user.email,
        loginTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });
    } catch (logError) {
      console.error("Failed to log login history:", logError);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const res =
        provider === "google"
          ? await signInWithGoogle()
          : await signInWithFacebook();

      const user = res.user;
      if (!user) throw new Error("No user data returned from provider.");

      // Log login history
      await logLoginHistory(user);

      // Fetch user role
      const UserRole = await axiosPublic.get(`/Users/Role?email=${user.email}`);
      const Role = UserRole.data.role;

      if (!Role) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User role not found. Contact support.",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting...",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect based on role
      if (Role === "Company") {
        navigate("/Employer/Company/Dashboard", { replace: true });
      } else if (Role === "Employer") {
        navigate("/Employer/Employer/Dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || `${provider} login failed.`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Login Button */}
      <div>
        <button
          onClick={() => handleSocialLogin("google")}
          className="flex bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-300 text-black rounded-xl w-full py-3 justify-center gap-5 cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          <span className="font-semibold">Sign Up With Google</span>
        </button>
      </div>

      {/* Facebook Login Button */}
      <div>
        <button
          onClick={() => handleSocialLogin("facebook")}
          className="flex bg-linear-to-bl hover:bg-linear-to-tr from-white to-gray-300 text-black rounded-xl w-full py-3 justify-center gap-5 cursor-pointer"
        >
          <FaFacebookSquare className="text-xl text-[#1877F2]" />
          <span className="font-semibold">Sign Up With Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogins;
