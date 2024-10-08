import { useContext, useState, useEffect } from "react";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Shared/Loader/Loader";

const Blogs = () => {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;
  const axiosPublic = useAxiosPublic();

  // Initialize votes based on BlogsData when BlogsData is available
  const [votes, setVotes] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // State for selected blog

  // Fetching BlogsData
  const {
    data: BlogsData = [],
    isLoading: BlogsDataIsLoading,
    error: BlogsDataError,
  } = useQuery({
    queryKey: ["BlogsData"],
    queryFn: () => axiosPublic.get(`/Blogs`).then((res) => res.data),
  });

  // Loading state
  useEffect(() => {
    if (BlogsData.length) {
      setVotes(
        BlogsData.map((blog) => ({
          id: blog._id,
          upVotes: blog.upVotes,
          downVotes: blog.downVotes,
          userVote: blog.peopleUpVoted.includes(user?.email)
            ? "up"
            : blog.peopleDownVoted.includes(user?.email)
            ? "down"
            : null,
          peopleUpVoted: blog.peopleUpVoted || [],
          peopleDownVoted: blog.peopleDownVoted || [],
        }))
      );
    }
  }, [BlogsData, user]);

  // Error state
  if (BlogsDataIsLoading) {
    return <Loader />;
  }

  if (BlogsDataError) {
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

  // Calculate the index range of blogs to display for the current page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = BlogsData.slice(indexOfFirstBlog, indexOfLastBlog);

  const handleVote = async (id, type) => {
    if (!user) {
      alert("Please log in first to vote.");
      return;
    }

    // Updating local state optimistically
    setVotes((prevVotes) =>
      prevVotes.map((vote) => {
        if (vote.id === id) {
          const updatedVote = { ...vote };
          const userEmail = user.email;

          if (type === "up") {
            if (vote.userVote === "up") {
              updatedVote.upVotes -= 1;
              updatedVote.peopleUpVoted = updatedVote.peopleUpVoted.filter(
                (email) => email !== userEmail
              );
              updatedVote.userVote = null;
            } else {
              updatedVote.upVotes += 1;
              updatedVote.peopleUpVoted.push(userEmail);
              updatedVote.downVotes -= vote.userVote === "down" ? 1 : 0;
              updatedVote.peopleDownVoted = updatedVote.peopleDownVoted.filter(
                (email) => email !== userEmail
              );
              updatedVote.userVote = "up";
            }
          } else if (type === "down") {
            if (vote.userVote === "down") {
              updatedVote.downVotes -= 1;
              updatedVote.peopleDownVoted = updatedVote.peopleDownVoted.filter(
                (email) => email !== userEmail
              );
              updatedVote.userVote = null;
            } else {
              updatedVote.downVotes += 1;
              updatedVote.peopleDownVoted.push(userEmail);
              updatedVote.upVotes -= vote.userVote === "up" ? 1 : 0;
              updatedVote.peopleUpVoted = updatedVote.peopleUpVoted.filter(
                (email) => email !== userEmail
              );
              updatedVote.userVote = "down";
            }
          }

          // Trigger the API call to update the vote on the server
          (async () => {
            try {
              await axiosPublic.post(`/Blogs/${id}/vote`, {
                type,
                email: userEmail,
              });
            } catch (error) {
              console.error("Error voting:", error);
              alert(
                "There was an error processing your vote. Please try again."
              );
            }
          })();

          return updatedVote;
        }
        return vote;
      })
    );
  };

  // Determine the number of pages
  const totalPages = Math.ceil(BlogsData.length / blogsPerPage);

  const handleReadMore = (blog) => {
    setSelectedBlog(blog); // Set selected blog details
    document.getElementById("View_Details_Blogs").showModal(); // Show modal
  };

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-50 text-black py-10">
      <div className="max-w-[1200px] mx-auto pt-14">
        <h1 className="text-4xl font-bold text-center mb-6">These are Our Blogs</h1>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center my-8">
          <button
            className="w-20 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-400"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="w-20 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-400"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => {
            const blogVotes = votes.find((vote) => vote.id === blog._id) || {
              upVotes: 0,
              downVotes: 0,
              userVote: null,
              peopleUpVoted: [],
              peopleDownVoted: [],
            };
            return (
              <div
                key={blog._id}
                className="border rounded shadow-lg bg-white pb-5 transition-transform duration-300 hover:scale-105"
              >
                <div className="flex justify-between py-3 bg-blue-50 px-5">
                  <div
                    className="flex text-xl items-center cursor-pointer"
                    onClick={() => handleVote(blog._id, "up")}
                  >
                    {blogVotes.userVote === "up" ? (
                      <BiSolidUpvote className="text-green-500" />
                    ) : (
                      <BiUpvote className="text-green-500" />
                    )}
                    <span className="ml-1">{blogVotes.upVotes}</span>
                  </div>
                  <div
                    className="flex text-xl items-center cursor-pointer"
                    onClick={() => handleVote(blog._id, "down")}
                  >
                    <span className="mr-1">{blogVotes.downVotes}</span>
                    {blogVotes.userVote === "down" ? (
                      <BiSolidDownvote className="text-red-500" />
                    ) : (
                      <BiDownvote className="text-red-500" />
                    )}
                  </div>
                </div>
                <div className="px-5">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="mb-4 rounded"
                  />
                  <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {blog.date} | By {blog.author}
                  </p>
                  <p className="text-lg mb-4">
                    {blog.summary.length > 100
                      ? `${blog.summary.substring(0, 100)}...`
                      : blog.summary}
                  </p>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleReadMore(blog)} // Use the updated handler
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center my-8">
          <button
            className="w-20 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-400"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="w-20 py-2 mx-2 bg-blue-500 text-white rounded hover:bg-blue-400"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Modal for blog details */}
        <dialog id="View_Details_Blogs" className="modal">
          {selectedBlog && (
            <div className="modal-box bg-white max-w-[800px]">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="mb-4 w-full"
              />
              <h2 className="text-2xl font-semibold mb-2">
                {selectedBlog.title}
              </h2>
              <p className="text-gray-600 mb-2">
                {selectedBlog.date} | By {selectedBlog.author}
              </p>
              <div>
                <p className="text-xl font-bold pb-2 pt-5">Summary : </p>
                <p className="text-lg">{selectedBlog.summary}</p>
              </div>
              <div>
                <p className="text-xl font-bold pb-2 pt-5">
                  Detailed Summary :{" "}
                </p>
                <p className="text-lg">{selectedBlog.detailedSummary}</p>
              </div>

              <p className="text-lg mb-4">{selectedBlog.content}</p>
              <div className="modal-action">
                <button
                  className="bg-green-500 hover:bg-green-400 text-white px-10 py-2 text-xl font-bold"
                  onClick={() => {
                    setSelectedBlog(null); // Clear selected blog on close
                    document.getElementById("View_Details_Blogs").close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </dialog>
      </div>
    </div>
  );
};

export default Blogs;
