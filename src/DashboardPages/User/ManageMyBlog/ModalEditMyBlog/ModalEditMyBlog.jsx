/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const ModalEditMyBlog = ({ blogData, refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();

  // Populate form with blog data
  useEffect(() => {
    if (blogData) {
      reset({
        title: blogData.title,
        author: blogData.author,
        summary: blogData.summary,
        detailedSummary: blogData.detailedSummary,
        image: blogData.image,
      });
    }
  }, [blogData, reset]);

  // Function to handle blog update submission
  const onSubmit = async (data) => {
    try {
      const updatedBlog = {
        ...data, // Override with new form data
      };

      // Send update request
      await axiosPublic.put(`/blogs/${blogData._id}`, updatedBlog);
      refetch(); // Refetch the blog data after update

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Blog updated successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Close modal after success
      document.getElementById("Edit_Blog_Modal").close();
    } catch (error) {
      console.error("Failed to update blog:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update blog. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0 rounded-none">
      <div className="flex justify-between items-center p-5 bg-blue-400 text-white">
        <p className="text-xl">Edit Blog</p>
        <button
          onClick={() => document.getElementById("Edit_Blog_Modal").close()}
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 space-y-4 text-black"
      >
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Title:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter blog title"
          />
        </div>

        {/* Author */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Author:</label>
          <input
            className="input input-bordered w-full bg-white border-black rounded-none"
            type="text"
            {...register("author", { required: true })}
            placeholder="Enter author's name"
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Summary:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
            {...register("summary", { required: true })}
            placeholder="Enter summary"
            rows="3"
          />
        </div>

        {/* Detailed Summary */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="font-bold w-48 text-xl">Detailed Summary:</label>
          <textarea
            className="textarea textarea-bordered w-full bg-white border-black rounded-none h-36 text-lg"
            {...register("detailedSummary", { required: true })}
            placeholder="Enter detailed summary"
            rows="5"
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
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

export default ModalEditMyBlog;
