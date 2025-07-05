import { useForm } from "react-hook-form";
import Logo from "../../../assets/Logo.png";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const SignUp = () => {
  const { createUser, updateUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false); // New state for loading
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const onSubmit = (data) => {
    const { email, password, displayName, photoURL } = data;

    const UserData = {
      displayName: displayName,
      email: email,
      role: "member",
      createdDate: formattedDateTime,
      photoURL: photoURL,
    };

    // Validate password
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password must be at least 6 characters long",
      });
      return;
    } else if (!/[A-Z]/.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password must contain at least one capital letter",
      });
      return;
    }

    setLoading(true); // Set loading to true when form is submitted

    // Create User
    createUser(email, password)
      .then((res) => {
        const user = res.user;
        console.log(user);
        // Update user with additional data (displayName, photoURL)
        updateUser(displayName, photoURL)
          .then(() => {
            // Post user data to backend
            axiosPublic.post("/Users", UserData).then((res) => {
              if (res.data.insertedId) {
                showSuccessAlert();
                reset();
                navigate(location?.state ? location.state : "/");
              }
              setLoading(false); // Set loading to false after submission
            });
          })
          .catch((error) => {
            showErrorAlert("Failed to update user profile.");
            setLoading(false); // Set loading to false on error
            console.log(error);
          });
      })
      .catch((error) => {
        showErrorAlert(error.message);
        setLoading(false); // Set loading to false on error
      });
  };

  return (
    <section className="bg-gradient-to-br from-blue-500 to-blue-100">
      <div className="flex flex-col items-center justify-center md:px-6 py-8 mx-auto md:h-screen pt-28 md:pt-80 lg:pt-0 lg:py-0">
        <div className=" md:w-1/2 lg:w-1/4 h-auto bg-gradient-to-br from-blue-500 to-blue-200 rounded-xl shadow-xl hover:shadow-2xl mb-0 md:mb-36 lg:mb-0 p-6 border-2 border-blue-700">
          {/* Form */}
          <div className="flex items-center text-center mx-auto w-[250px]">
            <img src={Logo} alt="Logo.png" className="w-16" />
            <p className="text-2xl text-white font-bold">Master Job Shop</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center text-2xl font-bold text-black pt-2 mb-6">
              Please Sign Up
            </p>

            {/* Name */}
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 text-xl font-semibold">
                Your Name
              </label>
              <input
                type="text"
                {...register("displayName", { required: "Name is required" })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="John Doe"
              />
              {errors.displayName && (
                <p className="text-red-500">{errors.displayName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 text-xl font-semibold">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="name@mail.com"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Image */}
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 text-xl font-semibold">
                Image URL
              </label>
              <input
                type="url"
                {...register("photoURL")}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="https://i.ibb.co/p3HZ1Kb/ubisoft.png"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block mb-1 text-gray-700 text-xl font-semibold">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="********"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-300"
              } text-white font-bold py-3 px-4 rounded`}
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Signing Up..." : "Sign Up"} {/* Change button text */}
            </button>

            <p className="text-lg font-light text-black mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;

const showSuccessAlert = () => {
  Swal.fire({
    icon: "success",
    title: "Sign Up Successful!",
    text: "You are now a user. Welcome!",
  });
};

const showErrorAlert = (errorMessage) => {
  Swal.fire({
    icon: "error",
    title: "Sign Up Failed",
    text: errorMessage,
  });
};
