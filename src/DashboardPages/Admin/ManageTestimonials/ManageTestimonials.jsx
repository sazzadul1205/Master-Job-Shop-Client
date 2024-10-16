import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import Swal from "sweetalert2";

const ManageTestimonials = () => {
  const axiosPublic = useAxiosPublic();
  const [testimonialId, setSelectedTestimonialId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch Testimonials data
  const {
    data: TestimonialsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
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

  // Handle delete action
  const handleDelete = async () => {
    try {
      await axiosPublic.delete(`/Testimonials/${testimonialId}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Testimonial has been deleted successfully.",
      });
      setShowDeleteModal(false);
      refetch(); // Refetch testimonials to refresh the list
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete the testimonial.",
      });
      console.log(error);
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Testimonials
      </p>

      {/* Search Bar */}
      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch />
        </label>
      </div>

      {/* Testimonials Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Title</th>
              <th>Main Message</th>
              <th>Content</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {TestimonialsData.length > 0 ? (
              TestimonialsData.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td>
                    <img
                      src={testimonial?.image}
                      alt={testimonial?.name}
                      className="w-16 h-16 object-cover "
                    />
                  </td>
                  <td>{testimonial?.name}</td>
                  <td>{testimonial?.title}</td>
                  <td>{testimonial?.mainMessage}</td>
                  <td>{testimonial?.content}</td>
                  <td>{testimonial?.rating}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                        onClick={() => {
                          setSelectedTestimonialId(testimonial._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[500px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Testimonial</h2>
            <p className="font-bold mb-4">
              Are you sure you want to delete this testimonial?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-400 text-white px-5 py-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 text-white px-5 py-2"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
