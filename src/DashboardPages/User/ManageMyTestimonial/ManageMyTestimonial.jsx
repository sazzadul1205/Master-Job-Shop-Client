import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useState } from "react";
import Loader from "../../../Pages/Shared/Loader/Loader";
import ModalAddMyTestimonials from "./ModalAddMyTestimonials/ModalAddMyTestimonials";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ModalEditMyTestimonials from "./ModalEditMyTestimonials/ModalEditMyTestimonials";
import Swal from "sweetalert2";

const ManageMyTestimonial = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [editTestimonialsData, setEditTestimonialsData] = useState(null);

  // Fetch Testimonials data
  const {
    data: MyTestimonials = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MyTestimonials"],
    queryFn: () =>
      axiosPublic
        .get(`/Testimonials?postedBy=${user.email}`)
        .then((res) => res.data),
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

  // Check if there are no testimonials posted yet
  if (MyTestimonials.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-gray-800 font-bold text-2xl mb-4">
              No Testimonials Posted Yet
            </p>
            <p className="text-gray-600 mb-4">Please create a testimonial.</p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document.getElementById("Create_New_Testimonial").showModal()
              }
            >
              Create Testimonial
            </button>
          </div>
        </div>

        {/* Modal Create New Testimonial */}
        <dialog id="Create_New_Testimonial" className="modal rounded-none">
          <ModalAddMyTestimonials refetch={refetch} />
        </dialog>
      </div>
    );
  }

  // Handle Edit Testimonials
  const handleEditTestimonials = (testimonial) => {
    setEditTestimonialsData(testimonial);
    document.getElementById("Edit_Testimonials_Modal").showModal();
  };

  // Handle Delete Testimonials
  const handleDeleteTestimonials = async (testimonialId) => {
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
        await axiosPublic.delete(`/Testimonials/${testimonialId}`);
        Swal.fire("Deleted!", "Your testimonial has been deleted.", "success");
        refetch(); // Refetch to update the list of testimonials
      } catch {
        Swal.fire(
          "Error!",
          "There was an error deleting your testimonial.",
          "error"
        );
      }
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage My Testimonials
      </p>

      <div className="p-10">
        {MyTestimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="bg-white shadow-lg rounded-lg p-6 mb-4"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-center">
              {testimonial.name}
            </h3>
            <p className="text-sm text-gray-500 text-center">
              {testimonial.title}
            </p>
            <blockquote className="mt-4 italic text-lg text-gray-700 text-center">
              {`"${testimonial.mainMessage}"`}
            </blockquote>
            <p className="mt-4 text-sm text-gray-600 text-center">
              {testimonial.content}
            </p>
            <div className="mt-4 text-center">
              <span className="text-yellow-400 font-bold">
                {testimonial.rating}
              </span>{" "}
              / 5
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold flex items-center justify-center px-4 py-2"
                onClick={() => handleEditTestimonials(testimonial)}
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-400 text-white font-bold flex items-center justify-center px-4 py-2"
                onClick={() => handleDeleteTestimonials(testimonial._id)} // Call delete function
              >
                <MdDelete className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Testimonials Modal */}
      <dialog id="Edit_Testimonials_Modal" className="modal">
        {editTestimonialsData && (
          <ModalEditMyTestimonials
            testimonialData={editTestimonialsData}
            refetch={refetch}
          />
        )}
      </dialog>
    </div>
  );
};

export default ManageMyTestimonial;
