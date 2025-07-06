import { useState } from "react";
import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Icons
import { FaArrowRight } from "react-icons/fa";

// Shared
import CourseCard from "../../../../Shared/CourseCard/CourseCard";

// Modals
import CourseDetailsModal from "./CourseDetailsModal/CourseDetailsModal";

const FeaturedCourses = ({ CoursesData }) => {
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Explore Our Courses
            </h2>
            <p className="lg:text-xl text-gray-200">
              Build in-demand skills and accelerate your career with expert-led
              learning.
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

      {/* Course Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
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
