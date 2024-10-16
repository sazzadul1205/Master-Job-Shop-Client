import PropTypes from "prop-types"; // Import PropTypes
import { ImCross } from "react-icons/im";

const ModalViewBlogs = ({ blogData }) => {
  return (
    <div className="modal-box bg-white max-w-[1000px] p-0 pb-10">
      {/* Top part */}
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p className="font-bold text-xl">View Blog</p>
        <button
          onClick={() => document.getElementById("Modal_Blog_View").close()}
          title="Close"
          aria-label="Close Modal"
        >
          <ImCross className="hover:text-gray-700" />
        </button>
      </div>

      {/* Blog Content */}
      <div className="p-5 space-y-4">
        {/* Blog Image */}
        <div className="w-full flex justify-center">
          <img
            src={blogData.image}
            alt={blogData.title}
            className="w-full max-w-lg h-auto object-cover rounded"
          />
        </div>

        {/* Blog Title */}
        <h2 className="text-2xl font-bold text-gray-900">{blogData.title}</h2>

        {/* Blog Metadata (Author, Date, Posted By) */}
        <div className="flex justify-between items-center text-gray-700">
          <p>
            Author: <span className="font-semibold">{blogData.author}</span>
          </p>
          <p>
            Date: <span className="font-semibold">{blogData.date}</span>
          </p>
          <p>
            Posted By:{" "}
            <span className="font-semibold">{blogData.postedBy}</span>
          </p>
        </div>

        {/* Summary */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-800">Summary</h3>
          <p>{blogData.summary}</p>
        </div>

        {/* Detailed Summary */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-800">
            Detailed Summary
          </h3>
          <p>{blogData.detailedSummary}</p>
        </div>

        {/* Blog Link */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-800">Read More:</h3>
          <a
            href={blogData.link}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {blogData.link}
          </a>
        </div>

        {/* Votes */}
        <div className="flex justify-start space-x-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-green-600">{blogData.upVotes}</span>
            <p>Up Votes</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-600">{blogData.downVotes}</span>
            <p>Down Votes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add prop-types validation
ModalViewBlogs.propTypes = {
  blogData: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    postedBy: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    detailedSummary: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    upVotes: PropTypes.number.isRequired,
    downVotes: PropTypes.number.isRequired,
  }).isRequired,
};

export default ModalViewBlogs;
