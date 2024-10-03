import PropTypes from "prop-types";

const CourseCard = ({
  courseTitle,
  instructor,
  duration,
  level,
  description,
}) => {
  return (
    <div className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl">
      <div className="card-body">
        {/* Course Title */}
        <p className="font-bold text-2xl">{courseTitle || "Course Title"}</p>

        {/* Instructor Name */}
        <p className="text-gray-500">
          Instructor: {instructor || "Instructor Name"}
        </p>

        {/* Duration */}
        <p className="text-gray-500">Duration: {duration || "Duration"}</p>

        {/* Level */}
        <p className="text-gray-500">
          Level: {level || "Beginner/Intermediate/Advanced"}
        </p>

        {/* Description */}
        <p className="text-gray-700 mt-2">
          {description || "Course Description"}
        </p>

        {/* Card Actions */}
        <div className="card-actions justify-end mt-5">
          <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-lg font-semibold text-white">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes
CourseCard.propTypes = {
  courseTitle: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default CourseCard;
