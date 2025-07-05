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
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // Add loading state
  const [loading, setLoading] = useState(false);

  // Inside the component
  const [showPassword, setShowPassword] = useState(false);

  // Determine the navigation path after login
  const from = location.state?.from?.pathname || "/";

  // Form handling with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle login alerts
  const showAlert = (type, message) => {
    Swal.fire({
      icon: type,
      title: type === "success" ? "Login Successful" : "Login Failed",
      text: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Function to handle form submission (optimized with useCallback)
  const onSubmit = useCallback(
    async (data) => {
      setLoading(true);
      try {
        // Attempt sign-in
        const res = await signIn(data.email, data.password);
        const user = res?.user;

        if (!user) {
          showAlert("error", "No user found with this email.");
          return;
        }

        // Fetch user role **in parallel** to reduce load time
        const response = axiosPublic.get(`/Users?email=${user.email}`);

        // Wait for the response
        const userData = await response;

        if (!userData?.data?.role) {
          showAlert("error", "User data not found. Please contact support.");
          return;
        }

        // Navigate based on user role
        if (
          userData.data.role === "Admin" ||
          userData.data.role === "Manager"
        ) {
          navigate("/Admin", { replace: true });
        } else if (userData.data.role === "Trainer") {
          navigate("/Trainer", { replace: true });
        } else {
          navigate(from, { replace: true });
        }

        showAlert("success", "You have successfully logged in!");
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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-100">
      {/* Login card container */}
      <div className="w-full max-w-lg rounded-2xl shadow-md px-3 py-10 md:px-10 md:py-10 bg-linear-to-bl from-blue-500/80 to-blue-100/80">
        {/* Heading section */}
        <div className="pb-5">
          <h4 className="text-3xl playfair font-bold text-center text-white">
            Welcome Back
          </h4>

          {/* Please Login */}
          <p className="text-lg playfair text-white italic text-center font-semibold">
            Please Login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input field */}
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

          {/* Password input field */}
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

          {/* Login button */}
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

          {/* Don't have an Account */}
          <p className="text-lg font-semibold text-black mt-5">
            Don`t have an account?{" "}
            <Link
              to="/SignUp"
              className="font-semibold playfair text-blue-800 hover:text-blue-500 hover:underline  "
            >
              Sign Up
            </Link>
          </p>
        </form>

        {/* Divider for social login options */}
        <div className="divider divider-neutral text-black font-semibold">
          OR
        </div>

        {/* Google Sign-In */}
        <SocialLogins />
      </div>
    </section>
  );
};

export default Login;
