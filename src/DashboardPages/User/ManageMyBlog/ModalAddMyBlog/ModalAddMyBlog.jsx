/* eslint-disable react/prop-types */
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ModalAddMyBlog = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();

  // Current date for deletion log
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const onSubmit = async (data) => {
    const blogData = {
      ...data,
      date: formattedDateTime,
      postedBy: user.email, // Automatically set postedBy to the current user email
      upVotes: 0,
      downVotes: 0,
      peopleUpVoted: [],
      peopleDownVoted: [],
    };

    try {
      await axiosPublic.post("/Blogs", blogData); // POST request to /Blogs endpoint
      reset(); // Reset form after submission
      refetch(); // Refetch blogs after submission

      // Show success alert using sweetalert2
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your blog has been submitted.",
        confirmButtonText: "OK",
      });

      document.getElementById("Create_New_Blog").close(); // Close modal
    } catch (error) {
      console.error("Error adding blog:", error);

      // Show error alert using sweetalert2
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while submitting your blog.",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Create New Blog</p>
        <button
          onClick={() => document.getElementById("Create_New_Blog").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Title */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter blog title"
          />
        </div>

        {/* Author */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Author:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("author", { required: true })}
            placeholder="Enter author's name"
          />
        </div>

        {/* Summary */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Summary:</label>
          <textarea
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...register("summary", { required: true })}
            placeholder="Enter summary"
            rows="3"
          />
        </div>

        {/* Detailed Summary */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Detailed Summary:</label>
          <textarea
            className="input input-bordered w-full bg-white border-black rounded-none"
            {...register("detailedSummary", { required: true })}
            placeholder="Enter detailed summary"
            rows="5"
          />
        </div>

        {/* Image URL */}
        <div className="flex items-center gap-2">
          <label className="font-bold w-48 text-xl">Image URL:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("image", { required: true })}
            placeholder="Enter image URL"
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

export default ModalAddMyBlog;
