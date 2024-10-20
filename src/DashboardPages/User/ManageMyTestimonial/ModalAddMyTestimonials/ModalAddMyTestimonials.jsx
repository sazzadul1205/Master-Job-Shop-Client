/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Rating from "react-rating"; // Assuming you are using 'react-rating' package
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2"; // Import sweetalert2

const ModalAddMyTestimonials = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(0); // State for rating

  const onSubmit = async (data) => {
    const testimonialData = {
      ...data,
      postedBy: user.email, // Automatically set postedBy to the current user email
      rating, // Include the rating value
    };

    try {
      await axiosPublic.post("/Testimonials", testimonialData);
      reset(); // Reset form after submission
      refetch(); // Refetch testimonials after submission

      // Show success alert using sweetalert2
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your testimonial has been submitted.",
        confirmButtonText: "OK",
      });

      document.getElementById("Create_New_Testimonial").close(); // Close modal
    } catch (error) {
      console.error("Error adding testimonial:", error);

      // Show error alert using sweetalert2
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while submitting your testimonial.",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Create New Testimonial</p>
        <button
          onClick={() =>
            document.getElementById("Create_New_Testimonial").close()
          }
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Name */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Name:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("name", { required: true })}
            placeholder="Enter your name"
          />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter job title"
          />
        </div>

        {/* Main Message */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Main Message:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("mainMessage", { required: true })}
            placeholder="Enter main message"
          />
        </div>

        {/* Content */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Content:</label>
          <textarea
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...register("content", { required: true })}
            placeholder="Enter testimonial content"
          />
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-xl">Rating:</label>
          <Rating
            initialRating={rating}
            emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
            onChange={(value) => setRating(value)} // Set the rating value in state
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 font-bold text-white px-5 py-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddMyTestimonials;
