import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowRight } from "react-icons/fa";

// Assets
import DefaultBlogImage from "../../../../assets/DefaultBlogImage.jpg";

// Modal
import BlogDetailsModal from "./BlogDetailsModal/BlogDetailsModal";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const FeaturedBlogs = ({ BlogsData }) => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold text-white">Latest Blog Posts</h2>
            <p className="lg:text-xl text-gray-200">
              Stay up to date with industry insights and tutorials from our
              experts.
            </p>
          </div>

          {/* Go To Button */}
          <Link
            to="/Blogs"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {BlogsData?.slice(0, 3).map((blog, index) => (
            <div
              onClick={() => {
                setSelectedBlog(blog);
                document.getElementById("Blog_Details_Modal")?.showModal();
              }}
              key={blog.id}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="bg-white rounded-md shadow hover:shadow-2xl transition overflow-hidden group"
            >
              <img
                src={blog.image || DefaultBlogImage}
                alt={blog.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultBlogImage;
                }}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Expert */}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Author */}
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-400">By {blog.author}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(blog.publishedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2 text-xs">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      <dialog id="Blog_Details_Modal" className="modal">
        <BlogDetailsModal
          selectedBlog={selectedBlog}
          setSelectedBlog={setSelectedBlog}
        />
      </dialog>
    </section>
  );
};

// Prop Validation
FeaturedBlogs.propTypes = {
  BlogsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      publishedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
};

export default FeaturedBlogs;
