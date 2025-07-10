// Packages
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Css
import "./NewsLetter.css";
import CommonButton from "../../../../Shared/CommonButton/CommonButton";

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
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-10">
      <div className="max-w-2xl mx-auto text-black">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">
            Sign in to NewsLetter
          </h2>
          <p className="lg:text-xl text-gray-200">
            Sign in to our NewsLetter for Latest News
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-5 px-5">
          {/* Name Input */}
          <div className="mb-4 items-center">
            <label className="block mb-2 playfair w-[120px] font-semibold mr-2 text-white">
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
            <label className="block mb-2 playfair w-[120px] font-semibold mr-2 text-white">
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
            <CommonButton
              type="submit"
              text="Subscribe"
              bgColor="white"
              width="full"
              py="py-3"
              px="px-5"
              textColor="text-black"
              borderRadius="rounded-md"
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsLetter;
