import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Packages
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

// Shared
import SocialLogins from "../../../Shared/SocialLogins/SocialLogins";

// Hooks
import useAuth from "../../../Hooks/useAuth";

const SignUp = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();

  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  // Inside the component
  const [showPassword, setShowPassword] = useState(false);

  // Form validation & state handling using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Watch password input to validate confirm password
  const password = watch("password");

  // Function to handle form submission
  const onSubmit = (data) => {
    const { email, password } = data;
    // Start loading
    setLoading(true);

    // Create user account
    createUser(email, password)
      .then(() => {
        // Stop loading
        setLoading(false);

        // Redirect to details page after successful signup
        navigate("/SignUp/Details");
      })
      .catch((error) => {
        // Stop loading
        setLoading(false);

        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message,
          confirmButtonColor: "#F72C5B",
        });
      });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white bg-opacity-90 shadow-lg p-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h4 className="text-4xl font-playfair font-bold text-blue-900 mb-2">
            Sign Up
          </h4>
          <p className="text-lg font-playfair italic text-blue-700 font-semibold">
            Create a new account
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
              placeholder="name@mail.com"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2 text-lg">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 shadow-sm transition"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 shadow-md transition disabled:opacity-60 ${
              loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Signing Up ..." : "Sign Up"}
          </button>

          {/* Login link */}
          <p className="mt-6 text-center text-gray-800 font-semibold text-lg">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6 text-gray-500">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm font-semibold">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Logins */}
        <SocialLogins />
      </div>
    </section>
  );
};

export default SignUp;
