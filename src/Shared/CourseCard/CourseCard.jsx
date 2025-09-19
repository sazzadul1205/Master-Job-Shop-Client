import { Link } from "react-router-dom";

// Packages
import PropTypes from "prop-types";

// Assets
import DefaultUserLogo from "../../assets/DefaultUserLogo.jpg";

// Format price
const formatPrice = (fee) => {
  if (!fee || fee.isFree) return "Free";
  return `${fee.currency} ${fee.amount}${
    fee.discount ? ` (−${fee.discount}%)` : ""
  }${fee.negotiable ? " • Negotiable" : ""}`;
};

// Calculate days ago
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
    <div className="flex flex-col justify-between border border-gray-200 rounded-xl shadow-md hover:shadow-2xl p-6 bg-white transition duration-300 min-h-[280px] relative ">
      {/* Posted Time (Top Left) */}
      <p className="absolute top-3 right-4 text-xs text-gray-400">
        Posted: {calculateDaysAgo(course?.postedAt)}
      </p>

      {/* Mentor Info */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <img
          src={course?.Mentor?.profileImage || DefaultUserLogo}
          alt={course?.Mentor?.name || "Mentor"}
          className="w-12 h-12 rounded-full object-cover border"
        />

        {/* Name & Position */}
        <div>
          {/* Name */}
          <p className="text-sm font-semibold text-gray-800">
            {course?.Mentor?.name || "Mentor"}
          </p>

          {/* Position */}
          <p className="text-xs text-gray-500">{course?.Mentor?.position}</p>
        </div>
      </div>

      {/* Course Title & Subtitle */}
      <div className="mb-2">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>

        {/* Subtitle */}
        {course.subTitle && (
          <p className="text-sm text-gray-800 italic">{course.subTitle}</p>
        )}

        {/* Category */}
        <p className="text-sm text-gray-600">
          {course.category} › {course.subCategory}
        </p>
      </div>

      {/* Category & Level */}
      <div className="flex gap-5 items-center text-sm text-gray-600 mb-2">
        {/* Level */}
        <p>
          <span className="font-medium">Level:</span> {course.level}
        </p>

        {/* Separator */}
        <p className=""> || </p>

        {/* Duration & Modules */}
        <p>
          <span className="font-medium">Duration:</span> {course.durationHours}{" "}
          hours • {course.modulesNumber || course.modules?.length || 0} modules
        </p>
      </div>

      {/* Price */}
      <p className="text-sm text-gray-600 mb-3">
        <span className="font-medium text-gray-700">Price:</span>{" "}
        <span className="text-green-700 font-semibold">
          {formatPrice(course.fee)}
        </span>
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-auto pt-2">
        <Link to={`/Courses/Apply/${course?._id}`}>
          <button className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
            Enroll Now
          </button>
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
  course: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    level: PropTypes.string,
    durationHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modulesNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modules: PropTypes.array,
    postedAt: PropTypes.string,
    fee: PropTypes.shape({
      isFree: PropTypes.bool,
      amount: PropTypes.number,
      discount: PropTypes.number,
      currency: PropTypes.string,
      negotiable: PropTypes.bool,
    }),
    Mentor: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      profileImage: PropTypes.string,
      bio: PropTypes.string,
      rating: PropTypes.string,
      position: PropTypes.string,
    }),
  }).isRequired,
  setSelectedCourseID: PropTypes.func.isRequired,
};

export default CourseCard;
