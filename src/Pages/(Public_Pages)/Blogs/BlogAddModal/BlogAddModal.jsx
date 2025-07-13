import React from "react";
import { ImCross } from "react-icons/im";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

import Picture from "../../../../assets/icons/picture.png";
import BlogImageDropZone from "./BlogImageDropZone/BlogImageDropZone";

const BlogAddModal = ({ BlogsRefetch }) => {
  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const blogData = {
        ...data,
        tags: data.tags.split(",").map((tag) => tag.trim()),
        publishedAt: new Date().toISOString(),
        readTime: `${data.readTime} min`,
      };

      const res = await axiosPublic.post("/Blogs", blogData);
      if (res?.data?.insertedId || res?.data?.acknowledged) {
        Swal.fire("Success", "Blog added successfully!", "success");
        reset();
        BlogsRefetch?.();
        document.getElementById("Blog_Add_Modal")?.close();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add blog", "error");
    }
  };

  return (
    <div className="modal-box min-w-[430px] relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6 text-black">
      {/* Close Button */}
      <div
        onClick={() => {
          document.getElementById("Blog_Add_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Blog Form */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Blog</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Image Container */}
        <BlogImageDropZone />

        {/* Title */}
        <div className="flex flex-col">
          <label className="font-medium">Title</label>
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder="Blog Title"
            className="p-2 border rounded"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Title is required</span>
          )}
        </div>

        {/* Author */}
        <div className="flex flex-col">
          <label className="font-medium">Author</label>
          <input
            {...register("author", { required: true })}
            type="text"
            placeholder="Author Name"
            className="p-2 border rounded"
          />
          {errors.author && (
            <span className="text-red-500 text-sm">Author is required</span>
          )}
        </div>

        {/* Excerpt */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-medium">Excerpt</label>
          <textarea
            {...register("excerpt", { required: true })}
            placeholder="Short summary of the blog"
            className="p-2 border rounded"
            rows={2}
          />
          {errors.excerpt && (
            <span className="text-red-500 text-sm">Excerpt is required</span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-medium">Content</label>
          <textarea
            {...register("content", { required: true })}
            placeholder="Full content of the blog"
            className="p-2 border rounded"
            rows={6}
          />
          {errors.content && (
            <span className="text-red-500 text-sm">Content is required</span>
          )}
        </div>

        {/* Image URL */}
        <div className="flex flex-col">
          <label className="font-medium">Image URL</label>
          <input
            {...register("image", { required: true })}
            type="text"
            placeholder="https://..."
            className="p-2 border rounded"
          />
          {errors.image && (
            <span className="text-red-500 text-sm">Image URL is required</span>
          )}
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="font-medium">Category</label>
          <input
            {...register("category", { required: true })}
            type="text"
            placeholder="e.g. Developer Tools"
            className="p-2 border rounded"
          />
          {errors.category && (
            <span className="text-red-500 text-sm">Category is required</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label className="font-medium">Tags (comma separated)</label>
          <input
            {...register("tags", { required: true })}
            type="text"
            placeholder="e.g. React, UI/UX, Design"
            className="p-2 border rounded"
          />
          {errors.tags && (
            <span className="text-red-500 text-sm">Tags are required</span>
          )}
        </div>

        {/* Read Time */}
        <div className="flex flex-col">
          <label className="font-medium">Read Time (in minutes)</label>
          <input
            {...register("readTime", { required: true })}
            type="number"
            min={1}
            placeholder="e.g. 5"
            className="p-2 border rounded"
          />
          {errors.readTime && (
            <span className="text-red-500 text-sm">Read time is required</span>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Submit Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogAddModal;
