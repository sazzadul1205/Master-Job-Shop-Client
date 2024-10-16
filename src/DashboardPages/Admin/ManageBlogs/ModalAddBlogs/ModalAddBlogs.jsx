import { useContext } from "react";
import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalAddBlogs = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const blogData = {
      title: data.gigTitle,
      date: new Date().toLocaleDateString(),
      author: user?.displayName || "Anonymous",
      postedBy: user.email,
      summary: data.summary,
      detailedSummary: data.detailedSummary,
      link: data.link,
      image: data.image,
      upVotes: 0,
      downVotes: 0,
      peopleUpVoted: [],
      peopleDownVoted: [],
    };

    try {
      const response = await axiosPublic.post("/blogs", blogData);
      console.log("Blog added:", response.data);
      Swal.fire({
        icon: "success",
        title: "Blog Added!",
        text: "Your blog post has been added successfully.",
        confirmButtonText: "Okay",
      });

      reset();
      refetch();
      document.getElementById("Create_New_Blog").close();
    } catch (error) {
      console.error("Error adding blog:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while adding your blog. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Add New Blogs</p>
        <button
          onClick={() => document.getElementById("Create_New_Blog").close()}
        >
          <ImCross className="hover:text-black font-bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        {/* Blog Title */}
        <div className="mb-4">
          <label className="block text-black font-bold">Blog Title:</label>
          <input
            type="text"
            {...register("gigTitle", { required: "Gig Title is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.gigTitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.gigTitle && (
            <span className="text-red-500">{errors.gigTitle.message}</span>
          )}
        </div>

        {/* Summary */}
        <div className="mb-4">
          <label className="block text-black font-bold">Summary:</label>
          <textarea
            {...register("summary", { required: "Summary is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.summary ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.summary && (
            <span className="text-red-500">{errors.summary.message}</span>
          )}
        </div>

        {/* Detailed Summary */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Detailed Summary:
          </label>
          <textarea
            {...register("detailedSummary", {
              required: "Detailed Summary is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.detailedSummary ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.detailedSummary && (
            <span className="text-red-500">
              {errors.detailedSummary.message}
            </span>
          )}
        </div>

        {/* Blog Link */}
        <div className="mb-4">
          <label className="block text-black font-bold">Link:</label>
          <input
            type="text"
            {...register("link", { required: "Link is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.link ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.link && (
            <span className="text-red-500">{errors.link.message}</span>
          )}
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-black font-bold">Image URL:</label>
          <input
            type="text"
            {...register("image", { required: "Image URL is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white px-10 py-2 text-lg font-bold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddBlogs;

// PropTypes validation
ModalAddBlogs.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
