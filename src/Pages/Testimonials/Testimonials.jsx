import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";

const Testimonials = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching TestimonialsData
  const {
    data: TestimonialsData = [],
    isLoading: TestimonialsDataIsLoading,
    error: TestimonialsDataError,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
  });

  // Loading state
  if (TestimonialsDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (TestimonialsDataError) {
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

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-50">
      <div className="max-w-[1200px] mx-auto px-4 py-28">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-black">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TestimonialsData.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-white shadow-lg rounded-lg p-6"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
