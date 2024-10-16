import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import ModalViewBlogs from "./ModalViewBlogs/ModalViewBlogs";
import { CiViewBoard } from "react-icons/ci";
import { useContext, useState } from "react";
import ModalAddBlogs from "./ModalAddBlogs/ModalAddBlogs";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";

const ManageBlogs = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [viewBlogData, setViewBlogData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch Blogs data
  const {
    data: BlogsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["BlogsData"],
    queryFn: () => axiosPublic.get(`/Blogs`).then((res) => res.data),
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

  // View blog details
  const handleViewBlog = (blog) => {
    setViewBlogData(blog);
    document.getElementById("Modal_Blog_View").showModal();
  };

  // Show delete confirmation modal
  const handleSingleDelete = (blog) => {
    setSelectedBlogId(blog._id);
    setViewBlogData(blog); // Set the blog data you're deleting
    setShowDeleteModal(true);
  };

  // Handle form submission for deletion
  const onSubmit = async (data) => {
    const currentDate = new Date();
    const formattedDateTime = currentDate.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    try {
      const deleteLogData = {
        DeletedBy: user.email,
        PostedBy: viewBlogData?.postedBy, // Ensure this data is from the blog being deleted
        DeletedDate: formattedDateTime,
        Type: "Blog",
        deletedContent: viewBlogData?.title,
        reason: data.deleteReason,
      };

      console.log(deleteLogData);

      // Post delete log data and delete the blog
      await axiosPublic.post(`/Delete-Log`, [deleteLogData]);
      await axiosPublic.delete(`/Blogs/${selectedBlogId}`);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog deleted successfully.",
        confirmButtonText: "Okay",
      });

      refetch();
      reset();
      setShowDeleteModal(false);
      setSelectedBlogId(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete blog. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Blogs
      </p>

      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch />
        </label>
      </div>

      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 px-10 py-2 text-white font-bold"
          onClick={() => document.getElementById("Create_New_Blog").showModal()}
        >
          + Add New Blog
        </button>
      </div>

      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Posted By</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {BlogsData.length > 0 ? (
              BlogsData.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-14 h-14"
                    />
                  </td>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>{blog.postedBy}</td>
                  <td>{blog.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                        onClick={() => handleViewBlog(blog)}
                      >
                        <CiViewBoard />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                        onClick={() => handleSingleDelete(blog)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <dialog id="Modal_Blog_View" className="modal">
        {viewBlogData && <ModalViewBlogs blogData={viewBlogData} />}
      </dialog>

      <dialog id="Create_New_Blog" className="modal">
        <ModalAddBlogs refetch={refetch} />
      </dialog>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Blog</h2>
            <p className="font-bold mb-4">
              Are you sure you want to delete this blog?
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 font-bold">
                  Reason for Deletion:
                </label>
                <textarea
                  {...register("deleteReason", { required: true })}
                  className="textarea textarea-bordered w-full bg-white border-black h-40"
                  placeholder="Enter the reason for deletion"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-400 text-white px-5 py-2"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-400 text-white px-5 py-2"
                >
                  Confirm Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ManageBlogs;
