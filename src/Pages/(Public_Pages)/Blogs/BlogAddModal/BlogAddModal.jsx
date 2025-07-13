import { useState } from "react";
import { ImCross } from "react-icons/im";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

import BlogImageDropZone from "./BlogImageDropZone/BlogImageDropZone";
import BlogTagInput from "./BlogTagInput/BlogTagInput";
import BlogContentTipTap from "./BlogContentTipTap/BlogContentTipTap";

const BlogAddModal = ({ BlogsRefetch }) => {
  const axiosPublic = useAxiosPublic();

  const [content, setContent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
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
    <div className="modal-box min-w-[1220px] relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6 text-black">
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
      <h2 className="text-2xl font-semibold mb-4 text-center playfair">
        Add New Blog
      </h2>

      {/* Forms */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image Container */}
        <BlogImageDropZone
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />

        {/* Title */}
        <div className="flex flex-col">
          <label className="font-medium playfair pb-2">Title</label>
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
          <label className="font-medium playfair pb-2">Author</label>
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
          <label className="font-medium playfair pb-2">Excerpt</label>
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
        <BlogContentTipTap content={content} setContent={setContent} />

        {/* Category */}
        <div className="flex flex-col">
          <label className="font-medium playfair pb-2">Category</label>
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
        <BlogTagInput
          register={register}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
        />

        {/* Read Time */}
        <div className="flex flex-col">
          <label className="font-medium playfair pb-2">
            Read Time (in minutes)
          </label>
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
