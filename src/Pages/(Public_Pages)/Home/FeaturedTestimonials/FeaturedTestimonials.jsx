import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

// Icons
import { FaAngleLeft, FaAngleRight, FaQuoteLeft } from "react-icons/fa";

// New Rating Component
import { Rating } from "react-simple-star-rating";

// Assets
import DefaultUserImage from "../../../..//assets/DefaultUserLogo.jpg";

const FeaturedTestimonials = ({ TestimonialsData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // AOS INIT
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Next Slide Control
  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === TestimonialsData.length - 1 ? 0 : prev + 1
      );
      setFade(true);
    }, 300);
  };

  // Prev Slide Control
  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? TestimonialsData.length - 1 : prev - 1
      );
      setFade(true);
    }, 300);
  };

  // Current Testimonial
  const testimonial = TestimonialsData[currentIndex];

  return (
    <section className="bg-gradient-to-tl from-blue-400 to-blue-600 py-20">
      <div className="px-5 md:px-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white">
            What People Think About Us
          </h2>
          <p className="lg:text-xl text-gray-200">
            Hear directly from those we&apos;ve served.
          </p>
        </div>

        <div
          data-aos="fade-up"
          key={testimonial.name + currentIndex}
          className={`testimonial-card relative bg-white rounded-lg shadow-lg md:h-[360px] p-6 flex items-center justify-between overflow-hidden transition-opacity duration-500 ease-in-out`}
          style={{ opacity: fade ? 1 : 0 }}
        >
          {/* Floating Icons */}
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute text-gray-200 text-4xl animate-float-icon pointer-events-none"
              style={{
                top: `${Math.random() * 80 + 5}%`,
                left: `${Math.random() * 80 + 5}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <FaQuoteLeft />
            </span>
          ))}

          {/* Left Arrow */}
          <div
            onClick={prevSlide}
            className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-10 md:w-12 cursor-pointer hover:bg-gray-100 z-10"
          >
            <FaAngleLeft className="text-3xl text-blue-500" />
          </div>

          {/* Testimonial Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 w-full px-10">
            <div className="flex flex-col items-center md:flex-row gap-4 w-full md:w-1/3">
              <img
                src={testimonial.image || DefaultUserImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultUserImage;
                }}
                alt={testimonial.name || "User"}
                className="w-24 h-24 rounded-full object-cover shadow-md"
              />
              <div className="text-center md:text-left">
                <h3 className="text-lg text-black font-semibold">
                  {testimonial.name}
                </h3>
                <p className="text-gray-600 text-sm">{testimonial.title}</p>
              </div>
            </div>

            <div className="w-full md:w-2/3 text-center md:text-left">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                <FaQuoteLeft className="inline mr-2 text-blue-400" />
                {testimonial.mainMessage}
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-black">
                  Rating:
                </span>
                <Rating
                  readonly
                  allowFraction
                  initialValue={testimonial.rating}
                  size={20}
                  SVGclassName="inline-block"
                />
                <span className="text-sm text-gray-700">
                  ({testimonial.rating?.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <div
            onClick={nextSlide}
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 md:w-12 cursor-pointer hover:bg-gray-100 z-10"
          >
            <FaAngleRight className="text-3xl text-blue-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturedTestimonials.propTypes = {
  TestimonialsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      mainMessage: PropTypes.string,
      content: PropTypes.string,
      rating: PropTypes.number,
      image: PropTypes.string,
    })
  ).isRequired,
};

export default FeaturedTestimonials;
