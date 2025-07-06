import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import CourseCard from "../../../../Shared/CourseCard/CourseCard";
import { useState } from "react";

const FeaturedCourses = ({ CoursesData }) => {
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white">Available Courses</h2>
            <p className="lg:text-xl">
              Enhance your skills and advance your career!
            </p>
          </div>

          {/* Go To Button */}
          <Link
            to={"/Courses"}
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Courses Cards Section */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {CoursesData.slice(0, 6).map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              setSelectedCourseID={setSelectedCourseID}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

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
