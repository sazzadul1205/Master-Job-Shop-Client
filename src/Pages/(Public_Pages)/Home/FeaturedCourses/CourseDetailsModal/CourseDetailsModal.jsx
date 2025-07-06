import PropTypes from "prop-types";

// Packages
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Assess
import DefaultUserLogo from "../../../../../assets/DefaultUserLogo.jpg";

// Icons
import { ImCross } from "react-icons/im";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";
import CommonButton from "../../../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Utilities
const formatPrice = (price) => {
  if (!price || price.isFree) return "Free";
  return `${price.currency}${price.amount}${
    price.discount ? ` (−${price.discount}%)` : ""
  }`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CourseDetailsModal = ({ selectedCourseID, setSelectedCourseID }) => {
  const axiosPublic = useAxiosPublic();

  // Fetching Selected Course Data
  const {
    data: SelectedCourseData,
    isLoading: SelectedCourseIsLoading,
    error: SelectedCourseError,
  } = useQuery({
    queryKey: ["SelectedCourseData", selectedCourseID],
    queryFn: () =>
      axiosPublic
        .get(`/Courses?id=${selectedCourseID}`)
        .then((res) => res.data),
    enabled: !!selectedCourseID, // Only run when selectedCourseID is truthy
  });

  // Loading
  if (SelectedCourseIsLoading)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedCourseID("");
            document.getElementById("Course_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Loading />
      </div>
    );

  // Error
  if (SelectedCourseError)
    return (
      <div className="min-w-5xl max-h-[90vh]">
        {/* Close Button */}
        <div
          onClick={() => {
            setSelectedCourseID("");
            document.getElementById("Course_Details_Modal")?.close();
          }}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </div>
        <Error />
      </div>
    );

  // No Data Fetched
  if (!SelectedCourseData) return null;

  return (
    <div className="modal-box min-w-5xl relative bg-white rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
      {/* Close Button */}
      <div
        onClick={() => {
          setSelectedCourseID("");
          document.getElementById("Course_Details_Modal")?.close();
        }}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-black mb-4">
        {SelectedCourseData.title}
      </h2>
      <p className="text-gray-600 mb-6">{SelectedCourseData.description}</p>

      {/* Instructor Info */}
      <div className="flex items-center mb-6">
        <img
          src={SelectedCourseData.instructor?.profileImage || DefaultUserLogo}
          alt="Instructor"
          className="w-14 h-14 rounded-full mr-4 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">
            {SelectedCourseData.instructor?.name || "Instructor"}
          </p>
          <p className="text-sm text-gray-500">
            {SelectedCourseData.instructor?.bio}
          </p>
          <p className="text-xs text-gray-400">
            Rating: {SelectedCourseData.instructor?.rating || "N/A"} | Students
            Taught: {SelectedCourseData.instructor?.studentsTaught || 0}
          </p>
        </div>
      </div>

      {/* Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
        <p>
          <strong>Category:</strong> {SelectedCourseData.category} ›{" "}
          {SelectedCourseData.subCategory}
        </p>
        <p>
          <strong>Level:</strong> {SelectedCourseData.level}
        </p>
        <p>
          <strong>Duration:</strong> {SelectedCourseData.durationHours} hours
        </p>
        <p>
          <strong>Lessons:</strong> {SelectedCourseData.lessons} | Modules:{" "}
          {SelectedCourseData.modules}
        </p>
        <p>
          <strong>Language:</strong> {SelectedCourseData.language}
        </p>
        <p>
          <strong>Certificate:</strong>{" "}
          {SelectedCourseData.certificateAvailable
            ? "Available"
            : "Not included"}
        </p>
        <p>
          <strong>Price:</strong>{" "}
          <span className="text-green-700 font-medium">
            {formatPrice(SelectedCourseData.price)}
          </span>
        </p>
        <p>
          <strong>Schedule:</strong> {SelectedCourseData.schedule?.type} •{" "}
          {SelectedCourseData.schedule?.releaseMode}{" "}
          {SelectedCourseData.schedule?.startDate && (
            <>
              • Starts on:{" "}
              <span className="text-black font-medium">
                {formatDate(SelectedCourseData.schedule?.startDate)}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Skills & Prerequisites */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-1">Skills Covered:</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {SelectedCourseData.skillsCovered?.length > 0 ? (
            SelectedCourseData.skillsCovered.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))
          ) : (
            <li>No specific skills listed.</li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-1">Prerequisites:</p>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {SelectedCourseData.prerequisites?.length > 0 ? (
            SelectedCourseData.prerequisites.map((pre, idx) => (
              <li key={idx}>{pre}</li>
            ))
          ) : (
            <li>No prerequisites required.</li>
          )}
        </ul>
      </div>

      {/* Action & Published */}
      <div className="flex items-center justify-between mt-6">
        <Link to={`/Courses/${SelectedCourseData._id}`}>
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
        <p className="text-xs text-gray-400">
          Published: {formatDate(SelectedCourseData.publishedAt)}
        </p>
      </div>
    </div>
  );
};

// Prop Validation
CourseDetailsModal.propTypes = {
  selectedCourseID: PropTypes.string,
  setSelectedCourseID: PropTypes.func.isRequired,
};

export default CourseDetailsModal;
