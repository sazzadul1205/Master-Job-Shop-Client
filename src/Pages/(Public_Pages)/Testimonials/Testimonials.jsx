import { useState, useEffect } from "react";

// Icons
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Assets
import DefaultUserLogo from "../../../assets/DefaultUserLogo.jpg";

const Testimonials = () => {
  const axiosPublic = useAxiosPublic();
  const [focusedTestimonial, setFocusedTestimonial] = useState(null);

  // Disable scroll when modal is open
  useEffect(() => {
    if (focusedTestimonial) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [focusedTestimonial]);

  // Testimonials Data
  const {
    data: TestimonialsData,
    isLoading: TestimonialsIsLoading,
    error: TestimonialsError,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
  });

  // Loading / Error UI
  if (TestimonialsIsLoading) return <Loading />;
  if (TestimonialsError) return <Error />;

  // Helper function to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex text-yellow-400 text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {halfStar && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-20 relative">
      {/* Header */}
      <div className="text-center mb-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white">What Our Clients Say</h1>

        {/* Sub Title */}
        <p className="text-gray-200 font-semibold text-lg max-w-2xl mx-auto mt-2">
          Genuine feedback from industry leaders and professionals who’ve
          partnered with us.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5 px-10">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
        {TestimonialsData.map((testimonial) => (
          <div
            key={testimonial._id}
            onClick={() => setFocusedTestimonial(testimonial)}
            className="cursor-pointer bg-linear-to-bl from-gray-200 to-white rounded-lg shadow-md hover:shadow-lg transition p-6"
          >
            {/* Testimonial Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              {/* Image */}
              <img
                src={testimonial?.image || DefaultUserLogo}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DefaultUserLogo;
                }}
                alt={testimonial?.name}
                className="w-16 h-16 rounded-full object-cover border"
              />

              {/* Data */}
              <div>
                {/* Name */}
                <h4 className="font-semibold text-lg text-gray-800">
                  {testimonial?.name}
                </h4>

                {/* Title */}
                <p className="text-sm text-gray-500">{testimonial?.title}</p>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-2 font-medium text-gray-700">
              &quot;{testimonial?.mainMessage}&quot;
            </div>

            {/* Content */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {testimonial?.content}
            </p>

            {/* Rating */}
            {renderStars(testimonial?.rating)}
          </div>
        ))}
      </div>

      {/* Overlay Modal */}
      {focusedTestimonial && (
        <div
          onClick={() => setFocusedTestimonial(null)}
          className="fixed inset-0 bg-black/70 bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
          >
            {/* Testimonial Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              {/* Image */}
              <img
                src={focusedTestimonial?.image || DefaultUserLogo}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DefaultUserLogo;
                }}
                alt={focusedTestimonial?.name}
                className="w-16 h-16 rounded-full object-cover border"
              />

              {/* Data */}
              <div>
                {/* Name */}
                <h4 className="font-semibold text-lg text-gray-800">
                  {focusedTestimonial?.name}
                </h4>

                {/* Title */}
                <p className="text-sm text-gray-500">
                  {focusedTestimonial?.title}
                </p>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-2 font-medium text-gray-700">
              &quot;{focusedTestimonial?.mainMessage}&quot;
            </div>

            {/* Content */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {focusedTestimonial?.content}
            </p>

            {/* Rating */}
            {renderStars(focusedTestimonial?.rating)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
