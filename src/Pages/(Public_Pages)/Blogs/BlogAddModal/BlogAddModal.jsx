import { useState } from "react";

// Icons
import { ImCross } from "react-icons/im";

// Packages
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../../../Shared/CommonButton/CommonButton";

// Components
import BlogImageDropZone from "./BlogImageDropZone/BlogImageDropZone";
import BlogContentTipTap from "./BlogContentTipTap/BlogContentTipTap";
import BlogTagInput from "./BlogTagInput/BlogTagInput";

// Image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const BlogAddModal = ({ BlogsRefetch }) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Form Control
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  // Submitted Form
  const onSubmit = async (data) => {
    try {
      // Validate that blog content exists
      if (!content) {
        Swal.fire("Error", "Blog content is required.", "error");
        return;
      }

      // Validate that an image has been selected
      if (!previewImage) {
        Swal.fire("Error", "Blog image is required.", "error");
        return;
      }

      // Set loading state true to indicate processing
      setLoading(true);

      let uploadedImageUrl = null;

      // Upload the image if previewImage is present (base64 string)
      if (previewImage) {
        const formData = new FormData();
        // Append only base64 string (strip out data:image/*;base64, prefix)
        formData.append("image", previewImage.split(",")[1]);

        try {
          // POST request to image hosting API
          const res = await axiosPublic.post(Image_Hosting_API, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // Extract uploaded image URL from response
          uploadedImageUrl = res?.data?.data?.display_url;

          if (!uploadedImageUrl) {
            throw new Error("Image upload succeeded but URL is missing.");
          }
        } catch (error) {
          // Show error alert on image upload failure and stop submission
          Swal.fire({
            icon: "error",
            title: "Image Upload Failed",
            text: `Failed to upload the image. ${
              error?.response?.data?.message ||
              error.message ||
              "Please try again."
            }`,
          });
          setLoading(false);
          return;
        }
      }

      // Prepare final blog payload to send to server
      const blogData = {
        ...data,
        // Ensure tags is an array and trim each tag string
        tags: Array.isArray(data.tags)
          ? data.tags.map((tag) => tag.trim())
          : [],
        content, // Rich text HTML content
        image: uploadedImageUrl, // Uploaded image URL from hosting service
        publishedAt: new Date().toISOString(), // Current timestamp
        readTime: `${data.readTime} min`, // Format read time
      };

      // POST blog data to your Blogs API endpoint
      const res = await axiosPublic.post("/Blogs", blogData);

      // Check for successful insertion acknowledgement
      if (res?.data?.insertedId || res?.data?.acknowledged) {
        // Show success alert with 2-second timer, no confirmation button
        await Swal.fire({
          icon: "success",
          title: "Blog Added!",
          text: "Your blog has been added successfully.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Reset form, clear content and preview image states
        reset();
        setContent(null);
        setPreviewImage(null);

        // Trigger refetch to update blog list if refetch function is provided
        BlogsRefetch?.();

        // Close the modal dialog
        document.getElementById("Blog_Add_Modal")?.close();
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      // Log error and display error alert to user
      console.error("❌ Error Posting Blog:", err);
      Swal.fire("Error", "Failed to add blog", "error");
    } finally {
      // Always reset loading state when process finishes
      setLoading(false);
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

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-4 text-center playfair">
        Add New Blog
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image */}
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

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <CommonButton
            type="submit"
            text="Submit Blog"
            isLoading={loading}
            loadingText="Publishing..."
            textColor="text-white"
            bgColor="blue"
            px="px-10"
            py="py-3"
            borderRadius="rounded"
            width="fit"
            className="hover:bg-gray-800"
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
BlogAddModal.propTypes = {
  BlogsRefetch: PropTypes.func,
};

export default BlogAddModal;
