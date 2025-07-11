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
import CommonButton from "../../../Shared/CommonButton/CommonButton";
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

  // Alert
  const showAlert = (type, message) => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Login Successful" : "Login Failed",
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const res = await signIn(data.email, data.password);
        const user = res?.user;

        if (!user) {
          showAlert("error", "No user found with this email.");
          return;
        }

        const userData = await axiosPublic.get(`/Users?email=${user.email}`);

        if (!userData?.data) {
          showAlert("error", "User data not found. Please contact support.");
          return;
        }

        showAlert("success", "You have successfully logged in!");

        // ✅ Redirect to the previous route
        navigate(from, { replace: true });
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Invalid email or password."
        );
      } finally {
        setLoading(false);
      }
    },
    [signIn, axiosPublic, navigate, from]
  );

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-400 to-blue-600">
      <div className="w-full max-w-lg rounded-2xl shadow-md px-3 py-10 md:px-10 md:py-10 bg-linear-to-bl from-blue-500/80 to-blue-100/80">
        <div className="pb-5">
          <h4 className="text-3xl playfair font-bold text-center text-white">
            Welcome Back
          </h4>
          <p className="text-lg playfair text-white italic text-center font-semibold">
            Please Login
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-black playfair font-semibold text-lg pb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Example@gmail.com"
              className="input w-full text-black bg-white shadow-lg hover:shadow-xl"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <label className="block text-black playfair font-semibold text-lg pb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="input w-full text-black bg-white shadow-lg hover:shadow-xl pr-10 cursor-pointer"
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
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-black focus:outline-none"
                tabIndex={-1}
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

          <CommonButton
            type="submit"
            text="Log In"
            isLoading={loading}
            loadingText="Logging In..."
            bgColor="white"
            textColor="text-blue-700"
            borderRadius="rounded-xl text-xl"
            width="full"
            px="px-5"
            py="py-2"
            className="mt-5 playfair"
            disabled={loading}
          />

          <p className="text-lg font-semibold text-black mt-5">
            Don`t have an account?{" "}
            <Link
              to="/SignUp"
              className="font-semibold playfair text-blue-800 hover:text-blue-500 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>

        <div className="divider divider-neutral text-black font-semibold">
          OR
        </div>

        <SocialLogins />
      </div>
    </section>
  );
};

export default Login;
