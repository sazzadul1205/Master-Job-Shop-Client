import { useForm } from "react-hook-form";
import "./NewsLetter.css"; // Ensure to import your CSS file

const NewsLetter = () => {
  // Initialize the form methods
  const {
    register,
    handleSubmit,
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

  const onSubmit = (data) => {
    console.log(data);
    const Subscriber = {
      name: data.name,
      email: data.email,
      date: formattedDateTime,
    };

    console.log(Subscriber);
  };
  return (
    <div className=" Newsletter-item z-fixed py-20">
      <div className="max-w-2xl mx-auto text-black">
        {/* Title */}
        <div className="mx-auto text-black">
          {/* Optional: Add text color for better visibility */}
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
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

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
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

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
