import { useForm } from "react-hook-form";
import "./NewsLetter.css"; // Ensure to import your CSS file
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const NewsLetter = () => {
  const axiosPublic = useAxiosPublic();

  // Initialize the form methods
  const {
    register,
    handleSubmit,
    reset, // Added reset method to clear form after submission
    formState: { errors },
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

  const onSubmit = async (data) => {
    console.log(data);

    const Subscriber = {
      name: data.name,
      email: data.email,
      date: formattedDateTime,
    };

    try {
      const response = await axiosPublic.post(`/NewsLetter`, Subscriber); // Corrected payload

      if (response.data.insertedId) {
        Swal.fire(
          "Subscribed!",
          "You have successfully subscribed to the newsletter.",
          "success"
        );
        reset(); // Reset the form after successful submission
      }
    } catch (error) {
      console.error("Error adding content:", error);
      Swal.fire(
        "Error",
        "An error occurred while adding the content.",
        "error"
      );
    }
  };

  return (
    <div className="Newsletter-item z-fixed py-20">
      <div className="max-w-2xl mx-auto text-black">
        {/* Title */}
        <div className="mx-auto text-black">
          <p className="text-center text-3xl font-bold">
            Sign in to NewsLetter
          </p>
          <p className="text-center">
            Sign in to our NewsLetter for Latest News
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-5">
          {/* Name Input */}
          <div className="mb-4 items-center">
            <label className="block mb-2 w-[120px] font-semibold mr-2">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="border border-gray-300 p-3 w-full bg-white"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4 items-center">
            <label className="block mb-2 w-[120px] font-semibold mr-2">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="border border-gray-300 p-3 w-full bg-white"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white w-full py-3 font-semibold hover:bg-blue-600"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
