import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Packages
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

// Shared
import SocialLogins from "../../../Shared/SocialLogins/SocialLogins";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-400 to-blue-600">
      {/* Login card container */}
      <div className="w-full max-w-lg rounded-2xl shadow-md px-3 py-10 md:px-10 md:py-10 bg-linear-to-bl from-blue-500/80 to-blue-100/80">
        {/* Heading section */}
        <div className="pb-5">
          <h4 className="text-3xl playfair font-bold text-center text-white">
            Sign Up
          </h4>
        </div>

        {/* Sign-up form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email input field */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="name@mail.com"
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
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
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
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 focus:outline-none"
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

          {/* Confirm password field */}
          <div>
            <label className="block text-gray-700 font-semibold text-xl pb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="input w-full text-black bg-white shadow-lg hover:shadow-xl"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* SignUp button */}
          <CommonButton
            type="submit"
            text="Sign Up"
            isLoading={loading}
            loadingText="Signing Up..."
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
            Already have an account?{" "}
            <Link
              to="/Login"
              className="font-semibold playfair text-blue-800 hover:text-blue-500 hover:underline  "
            >
              Login
            </Link>
          </p>
        </form>

        {/* Divider for social login options */}
        <div className="divider divider-neutral text-black font-semibold">
          OR
        </div>

        {/* Social login component */}
        <SocialLogins />
      </div>
    </section>
  );
};

export default SignUp;
