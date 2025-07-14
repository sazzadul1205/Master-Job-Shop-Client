import PropTypes from "prop-types";

// Icons
import { ImCross } from "react-icons/im";

// Assess
import DefaultBlogImage from "../../../../../assets/DefaultBlogImage.jpg";

const BlogDetailsModal = ({ selectedBlog, setSelectedBlog }) => {
  if (!selectedBlog) return null;

  const {
    title,
    excerpt,
    content,
    author,
    publishedAt,
    image,
    tags,
    category,
    readTime,
  } = selectedBlog;

  return (
    <div className="modal-box min-w-[1080px] relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <div
        onClick={() => {
          setSelectedBlog("");
          document.getElementById("Blog_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Blog Image */}
      <img
        src={image || DefaultBlogImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DefaultBlogImage;
        }}
        alt={title}
        className="w-[1200px] h-[500px] object-cover rounded-lg mb-4"
      />

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>

      {/* Metadata */}
      <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-4">
        {/* Author */}
        <span>
          By <span className="font-medium text-gray-700">{author}</span>
        </span>

        {/* Published Date */}
        <span>
          {new Date(publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short", // abbreviated month like "Jan"
            day: "2-digit",
          })}
        </span>

        {/* Category */}
        {category && <span>Category: {category}</span>}

        {/* Read Time */}
        {readTime && <span>Read Time: {readTime}</span>}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags?.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Excerpt */}
      <p className="text-gray-700 font-medium italic mb-4">{excerpt}</p>

      <div
        className="text-gray-800 leading-relaxed whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

// Prop Validation
BlogDetailsModal.propTypes = {
  selectedBlog: PropTypes.shape({
    title: PropTypes.string,
    excerpt: PropTypes.string,
    content: PropTypes.string,
    author: PropTypes.string,
    publishedAt: PropTypes.string,
    image: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    readTime: PropTypes.string,
  }),
  setSelectedBlog: PropTypes.func.isRequired,
};

export default BlogDetailsModal;
