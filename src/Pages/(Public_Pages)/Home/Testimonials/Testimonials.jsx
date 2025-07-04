import { FaAngleLeft, FaAngleRight, FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import Rating from "react-rating";
import PropTypes from "prop-types";

const Testimonials = ({ testimonialsData }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Automatically change the testimonial every 5 seconds
  useEffect(() => {
    if (!testimonialsData || testimonialsData.length === 0) return;

    const interval = setInterval(handleNext, 3000);
    return () => clearInterval(interval);
  }, [testimonialsData]);

  // Function to handle next testimonial
  const handleNext = () => {
    if (!testimonialsData || testimonialsData.length === 0) return;
    setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length);
  };

  // Function to handle previous testimonial
  const handlePrev = () => {
    if (!testimonialsData || testimonialsData.length === 0) return;
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length
    );
  };

  const testimonial = testimonialsData[currentTestimonial];

  return (
    <div className="bg-gradient-to-b from-sky-50 to-sky-400">
      <div className="max-w-[1200px] mx-auto text-black">
        {/* Top Section */}
        <div className="text-xl py-10 text-center">
          <p className="text-3xl md:text-5xl font-bold italic text-blue-700">
            What People Think About Us
          </p>
          <p className="text-lg md:text-xl">
            See what people think about us and know more
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="bg-white flex items-center justify-between md:h-[320px] h-[420px] relative">
          {/* Left Arrow */}
          <div
            className="absolute left-0 flex items-center justify-center w-8 md:w-12 h-full cursor-pointer hover:bg-gray-300"
            onClick={handlePrev}
          >
            <FaAngleLeft className="text-3xl md:text-4xl text-blue-500" />
          </div>

          {/* Testimonial Card */}
          <div
            className="bg-blue-50 min-h-[300px] p-5 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center px-5 md:px-10 py-10 hover:shadow-2xl w-full mx-5 md:mx-20 transition-transform duration-700 ease-in-out"
            key={testimonial._id}
          >
            {/* Left Section */}
            <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto"
              />
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.title}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 mt-5 md:mt-0 text-center md:text-left">
              <h1 className="text-black text-xl md:text-2xl mb-2">
                {testimonial.mainMessage}
              </h1>
              <p className="text-gray-600">{testimonial.content}</p>

              {/* Rating Section */}
              <div className="my-4">
                <p className="text-black font-semibold text-lg">Rating: </p>
                <Rating
                  initialRating={testimonial.rating}
                  emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                  fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                  readonly
                />
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <div
            className="absolute right-0 flex items-center justify-center w-8 md:w-12 h-full cursor-pointer hover:bg-gray-300"
            onClick={handleNext}
          >
            <FaAngleRight className="text-3xl md:text-4xl text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

Testimonials.propTypes = {
  testimonialsData: PropTypes.array.isRequired,
};

export default Testimonials;
