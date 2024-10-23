import { useContext, useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import ModalAddMyBlog from "./ModalAddMyBlog/ModalAddMyBlog";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import ModalEditMyBlog from "./ModaleditMyBlog/ModaleditMyBlog";
import Swal from "sweetalert2";

const ManageMyBlog = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [editBlogData, setEditBlogData] = useState(null);

  // Fetch Blogs data
  const {
    data: MyBlogs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyBlogs"],
    queryFn: () =>
      axiosPublic.get(`/Blogs?postedBy=${user.email}`).then((res) => res.data),
  });

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Check if there are no blogs posted yet
  if (MyBlogs.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-gray-800 font-bold text-2xl mb-4">
              No Blogs Posted Yet
            </p>
            <p className="text-gray-600 mb-4">Please create a blog.</p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document.getElementById("Create_New_Blog").showModal()
              }
            >
              Create Blog
            </button>
          </div>
        </div>

        {/* Modal Create New Blog */}
        <dialog id="Create_New_Blog" className="modal rounded-none">
          <ModalAddMyBlog refetch={refetch} />
        </dialog>
      </div>
    );
  }

  // Handle Edit Blog
  const handleEditBlog = (blog) => {
    setEditBlogData(blog);
    document.getElementById("Edit_Blog_Modal").showModal();
  };

  // Handle Close Edit Blog Modal
  const closeEditModal = () => {
    document.getElementById("Edit_Blog_Modal").close();
    setEditBlogData(null); // Reset state after closing modal
  };

  // Handle Delete Blog
  const handleDeleteBlog = async (blogId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/Blogs/${blogId}`);
        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
        refetch(); // Refetch to update the list of blogs
      } catch (err) {
        console.log(err);

        Swal.fire("Error!", "There was an error deleting your blog.", "error");
      }
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage My Blogs
      </p>

      {/* Blog Content */}
      <div className="p-5 space-y-4">
        {MyBlogs.map((blog) => (
          <div key={blog._id} className="border-b border-gray-300 pb-4 mb-4">
            {/* Blog Image */}
            <div className="w-full flex justify-center">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full max-w-lg h-auto object-cover rounded"
              />
            </div>

            {/* Blog Title */}
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              {blog.title}
            </h2>

            {/* Blog Metadata (Author, Date, Posted By) */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-gray-700 mt-2 space-y-1 sm:space-y-0">
              <p>
                Author: <span className="font-semibold">{blog.author}</span>
              </p>
              <p>
                Date: <span className="font-semibold">{blog.date}</span>
              </p>

              <p>
                Posted By:{" "}
                <span className="font-semibold">{blog.postedBy}</span>
              </p>
            </div>

            {/* Summary */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-gray-800">Summary</h3>
              <p className="break-words overflow-hidden">{blog.summary}</p>
            </div>

            {/* Detailed Summary */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-gray-800">
                Detailed Summary
              </h3>
              <p className="break-words overflow-hidden">
                {blog.detailedSummary}
              </p>
            </div>

            {/* Blog Link */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-gray-800">
                Read More:
              </h3>
              <a
                href={blog.link}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {blog.link}
              </a>
            </div>

            {/* Votes */}
            <div className="flex justify-start space-x-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-600">{blog.upVotes}</span>
                <p>Up Votes</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-600">{blog.downVotes}</span>
                <p>Down Votes</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <button
                className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold flex items-center justify-center px-4 py-2 mb-2 sm:mb-0"
                onClick={() => handleEditBlog(blog)}
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-400 text-white font-bold flex items-center justify-center px-4 py-2"
                onClick={() => handleDeleteBlog(blog._id)}
              >
                <MdDelete className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Blog Modal */}
      <dialog id="Edit_Blog_Modal" className="modal">
        {editBlogData && (
          <ModalEditMyBlog
            blogData={editBlogData}
            refetch={refetch}
            closeModal={closeEditModal}
          />
        )}
      </dialog>
    </div>
  );
};

export default ManageMyBlog;
