import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const FeaturedCourses = ({ CoursesData }) => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center pt-20 px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-4xl md:text-5xl font-bold italic text-blue-700">
              Available Courses
            </p>
            <p className="lg:text-xl">
              Enhance your skills and advance your career!
            </p>
          </div>
          <button className="mt-4 md:mt-0 md:ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Courses"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Course Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 px-5 lg:px-0">
          {CoursesData.slice(0, 6).map((course, index) => (
            <div
              key={index}
              className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl"
            >
              <div className="card-body">
                {/* Course Title */}
                <p className="font-bold text-2xl">
                  {course.courseTitle || "Course Title"}
                </p>

                {/* Instructor Name */}
                <p className="text-gray-500">
                  Instructor: {course.instructor || "Instructor Name"}
                </p>

                {/* Duration */}
                <p className="text-gray-500">
                  Duration: {course.duration || "Duration"}
                </p>

                {/* Level */}
                <p className="text-gray-500">
                  Level: {course.level || "Beginner/Intermediate/Advanced"}
                </p>

                {/* Description */}
                <p className="text-gray-700 mt-2">
                  {course.description || "Course Description"}
                </p>

                {/* Card Actions */}
                <div className="card-actions justify-end mt-5">
                  <Link to={`/Courses/${course._id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-lg font-semibold text-white">
                      Enroll Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

// Add this at the end of your component
FeaturedCourses.propTypes = {
  CoursesData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      courseTitle: PropTypes.string.isRequired,
      instructor: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeaturedCourses;
