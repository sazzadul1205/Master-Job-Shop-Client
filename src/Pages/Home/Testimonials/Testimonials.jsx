import { FaAngleLeft, FaAngleRight, FaStar } from "react-icons/fa";
import { useState } from "react";
import Rating from "react-rating"; // Import react-rating

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "John Doe",
      title: "Manager at Emirates",
      mainMessage: "This service has changed my life for the better!",
      content:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus quasi sed voluptas nostrum cupiditate.",
      rating: 4.5,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Jane Smith",
      title: "CEO at TechInnovators",
      mainMessage: "The best experience I’ve had with any service provider.",
      content:
        "This company is extremely professional and efficient. Their solutions helped us grow significantly.",
      rating: 5,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "David Brown",
      title: "Project Lead at Constructions Ltd.",
      mainMessage: "Reliable and professional at every step of the way.",
      content:
        "From the planning to execution, everything was spot-on. I will definitely use their services again.",
      rating: 4.2,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Emily Johnson",
      title: "Marketing Director at CreativeWorks",
      mainMessage: "Their creativity and vision were exactly what we needed!",
      content:
        "Our campaigns have never been more successful thanks to their unique approach and innovative ideas.",
      rating: 4.8,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 5,
      name: "Michael Lee",
      title: "Founder of HealthFirst",
      mainMessage: "Highly recommended for their commitment and service.",
      content:
        "The team was professional, responsive, and truly cared about delivering quality results.",
      rating: 4.7,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 6,
      name: "Sophia Davis",
      title: "Operations Manager at Global Ventures",
      mainMessage: "Efficient, effective, and on-time.",
      content:
        "Their attention to detail and timely delivery helped us achieve all our goals for this project.",
      rating: 4.6,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 7,
      name: "James White",
      title: "Freelancer",
      mainMessage: "The best support I have ever experienced!",
      content:
        "Customer support was extremely helpful and made the entire process seamless for me.",
      rating: 5,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 8,
      name: "Ava Harris",
      title: "Entrepreneur",
      mainMessage: "Their service helped my business grow rapidly.",
      content:
        "I couldn’t be happier with the way they understood my needs and delivered a custom solution.",
      rating: 4.9,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 9,
      name: "William Clark",
      title: "CFO at FinancePro",
      mainMessage: "They truly exceeded my expectations.",
      content:
        "The professionalism and expertise of their team helped us solve complex issues efficiently.",
      rating: 4.3,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 10,
      name: "Isabella Martinez",
      title: "HR Manager at TalentCorp",
      mainMessage: "Amazing service from start to finish.",
      content:
        "They made the entire process stress-free and were always available to assist whenever needed.",
      rating: 4.9,
      image: "https://via.placeholder.com/100",
    },
  ];

  // State to manage which testimonial is displayed (for slider)
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Function to handle next testimonial
  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length);
  };

  // Function to handle previous testimonial
  const handlePrev = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length
    );
  };

  const testimonial = testimonialsData[currentTestimonial];

  return (
    <div className="bg-gradient-to-b from-sky-50 to-sky-400">
      <div className="max-w-[1200px] mx-auto text-black">
        {/* Top Section */}
        <div className="text-xl py-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            What People think about us
          </p>
          <p className="text-xl">
            See what people think about us and know more
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="bg-white flex items-center py-4 justify-between h-[320px]">
          {/* Left Arrow */}
          <div className="cursor-pointer" onClick={handlePrev}>
            <FaAngleLeft className="text-4xl text-blue-500 w-14" />
          </div>

          {/* Testimonial Card */}
          <div className="bg-blue-50 p-5 rounded-lg shadow-md flex justify-between items-center px-10 py-10 hover:shadow-2xl w-full">
            {/* left */}
            <div className="flex items-center gap-5">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <div>
                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                <p className="text-gray-600">{testimonial.title}</p>
              </div>
            </div>

            {/* Right */}
            <div className="w-1/2">
              <h1 className="text-black text-2xl mb-2">
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
          <div className="cursor-pointer" onClick={handleNext}>
            <FaAngleRight className="text-4xl text-blue-500 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
