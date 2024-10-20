/* eslint-disable react/prop-types */
import { FaStar } from "react-icons/fa";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import Rating from "react-rating"; // Ensure this import exists
import Swal from "sweetalert2"; // Import sweetalert2

const ModalEditMyTestimonials = ({ testimonialData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();
  const [rating, setRating] = useState(0); // State for rating

  // Populate form with fetched testimonial data
  useEffect(() => {
    if (testimonialData) {
      reset({
        name: testimonialData.name,
        title: testimonialData.title,
        mainMessage: testimonialData.mainMessage,
        content: testimonialData.content,
      });
      setRating(testimonialData.rating || 0); // Set the initial rating
    }
  }, [testimonialData, reset]);

  const onSubmit = async (data) => {
    try {
      // Prepare the data for updating
      const updatedData = {
        ...data,
        rating, // Include the rating value
      };

      // Make the PUT request to update the testimonial by ID
      await axiosPublic.put(
        `/Testimonials/${testimonialData._id}`,
        updatedData
      );

      // Show a success alert
      Swal.fire({
        title: "Success!",
        text: "Testimonial updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      document.getElementById("Edit_Testimonials_Modal").close();
      refetch(); // Refetch testimonials to update the list
    } catch (error) {
      // Show an error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update testimonial. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });

      console.error("Error updating testimonial:", error);
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Edit Testimonial</p>
        <button
          onClick={() =>
            document.getElementById("Edit_Testimonials_Modal").close()
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
            defaultValue={testimonialData?.name} // Use defaultValue for controlled input
          />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter your title"
            defaultValue={testimonialData?.title} // Use defaultValue for controlled input
          />
        </div>

        {/* Main Message */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Main Message:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("mainMessage", { required: true })}
            placeholder="Enter the main message"
            defaultValue={testimonialData?.mainMessage} // Use defaultValue for controlled input
          />
        </div>

        {/* Content */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Content:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none"
            {...register("content", { required: true })}
            placeholder="Enter additional content"
            defaultValue={testimonialData?.content} // Use defaultValue for controlled input
          />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Rating:</label>
          <Rating
            initialRating={rating} // Use state to control the rating
            onClick={(value) => setRating(value)} // Update state on rating change
            emptySymbol={<FaStar className="text-gray-300" />}
            fullSymbol={<FaStar className="text-yellow-400" />}
            className="flex text-2xl"
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

export default ModalEditMyTestimonials;
