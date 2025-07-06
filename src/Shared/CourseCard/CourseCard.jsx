import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Assets
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Shared
import CommonButton from "../CommonButton/CommonButton";

// Utilities
const formatPrice = (price) => {
  if (!price || price.isFree) return "Free";
  return `${price.currency}${price.amount}${
    price.discount ? ` (−${price.discount}%)` : ""
  }`;
};

const calculateDaysAgo = (isoString) => {
  if (!isoString) return "Unknown";
  const postedDate = new Date(isoString);
  const today = new Date();
  const diff = today - postedDate;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
};

const CourseCard = ({ course, setSelectedCourseID }) => {
  return (
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-sm p-6 bg-gradient-to-bl from-white to-gray-100 hover:shadow-md transition duration-200 min-h-[250px]">
      {/* Instructor Info */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={course?.instructor?.profileImage || DefaultUserLogo}
          alt="Instructor"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm text-gray-700 font-medium">
          {course?.instructor?.name || "Instructor"}
        </span>
      </div>

      {/* Course Title */}
      <h3 className="text-lg font-semibold text-black mb-1">{course.title}</h3>

      {/* Category & Subcategory */}
      <p className="text-sm text-gray-500 mb-1">
        {course.category} › {course.subCategory}
      </p>

      {/* Level */}
      <p className="text-sm text-gray-600 mb-1">
        Level: <span className="text-gray-800">{course.level}</span>
      </p>

      {/* Duration */}
      <p className="text-sm text-gray-600 mb-1">
        Duration:{" "}
        <span className="text-gray-800">
          {course.durationHours} hours • {course.modules} modules
        </span>
      </p>

      {/* Price */}
      <p className="text-sm text-gray-600 mb-3">
        Price:{" "}
        <span className="text-green-700 font-semibold">
          {formatPrice(course.price)}
        </span>
      </p>

      {/* Posted Time */}
      <p className="text-xs text-gray-400 mb-3">
        Posted: {calculateDaysAgo(course?.publishedAt)}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2 mt-auto">
        <Link to={`/Courses/${course?._id}`}>
          <CommonButton
            text="Enroll Now"
            textColor="text-white"
            bgColor="blue"
            px="px-4"
            py="py-2"
            width="auto"
            className="text-sm font-medium"
          />
        </Link>

        <button
          onClick={() => {
            document.getElementById("Course_Details_Modal")?.showModal();
            setSelectedCourseID(course?._id);
          }}
          className="text-sm text-blue-700 hover:underline cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  setSelectedCourseID: PropTypes.func.isRequired,
};

export default CourseCard;
