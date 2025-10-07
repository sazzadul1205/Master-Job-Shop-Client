import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

// Shared
import SocialLogins from "../../../Shared/SocialLogins/SocialLogins";

const Login = () => {
  const axiosPublic = useAxiosPublic();
  const { signIn } = useAuth();

  // Shared
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Support both router state and query param fallback
  const redirectParam = new URLSearchParams(location.search).get("redirectTo");
  const from = location.state?.from || redirectParam || "/";

  // Form Control
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const res = await signIn(data.email, data.password);
        const user = res?.user;

        // If no user, show generic error
        if (!user) {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "No account found with this email.",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Log login history
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

        // Fetch user role
        const UserRole = await axiosPublic.get(
          `/Users/Role?email=${user.email}`
        );
        const Role = UserRole.data.role;

        // If no role assigned, show error
        if (!Role) {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Your account role is not assigned. Please contact support.",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Success alert
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting...",
          showConfirmButton: false,
          timer: 1500,
        });

        // Redirect based on Role
        if (Role === "Company") {
          navigate("/Employer/Company/Dashboard", { replace: true });
        } else if (Role === "Employer") {
          navigate("/Employer/Employer/Dashboard", { replace: true });
        } else if (Role === "Mentor") {
          navigate("/Mentor/Dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error("Login error:", error);

        let message = "Invalid email or password.";

        // Firebase Auth error handling
        if (error.code) {
          switch (error.code) {
            case "auth/wrong-password":
              message = "The password you entered is incorrect.";
              break;
            case "auth/user-not-found":
              message = "No account found with this email.";
              break;
            case "auth/too-many-requests":
              message =
                "Too many failed login attempts. Please try again later or reset your password.";
              break;
            case "auth/invalid-email":
              message = "Please enter a valid email address.";
              break;
            default:
              message = "Login failed. Please check your credentials.";
          }
        } else if (error.response?.data?.message) {
          // Backend-specific messages
          message = error.response.data.message;
        }

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: message,
          showConfirmButton: false,
          timer: 2000,
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, axiosPublic, navigate, from]
  );

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white bg-opacity-90 shadow-lg p-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h4 className="text-4xl font-playfair font-bold text-blue-900 mb-2">
            Welcome Back
          </h4>
          <p className="text-lg font-playfair italic text-blue-700 font-semibold">
            Please log in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2 text-lg">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 shadow-sm transition"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
              autoComplete="email"
              autoFocus
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <label className="block text-black font-semibold text-lg pb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 shadow-sm transition"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 focus:outline-none focus:text-gray-600"
                tabIndex={-1}
                style={{ background: "transparent", zIndex: 10 }}
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 shadow-md transition disabled:opacity-60 ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Logging In ..." : "Log In"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-800 font-semibold text-lg">
          Don’t have an account?{" "}
          <Link
            to="/SignUp"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6 text-gray-500">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm font-semibold">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Login */}
        <SocialLogins />
      </div>
    </section>
  );
};

export default Login;
