// Packages
import PropTypes from "prop-types";

// Component
import CourseInsights from "./CourseInsights/CourseInsights";
import MentorshipInsights from "./MentorshipInsights/MentorshipInsights";

const MentorDashboardInsights = ({
  MyCoursesData,
  MyMentorshipData,
  MyCoursesApplicationsData,
  MyMentorshipApplicationsData,
}) => {
  // Merge Mentorship with applications
  const mergedMentorship =
    MyMentorshipData?.map((mentorship) => {
      return {
        ...mentorship,
        applications: MyMentorshipApplicationsData?.[mentorship?._id] || [],
      };
    }) || [];

  // Merge Courses with applications
  const mergedCourses =
    MyCoursesData?.map((course) => {
      return {
        ...course,
        applications: MyCoursesApplicationsData?.[course?._id] || [],
      };
    }) || [];

  return (
    <div className="bg-white p-5 m-5 rounded-2xl shadow-md border border-gray-300 hover:shadow-2xl transition-shadow duration-300">
      {/* Header */}
      <h3 className="text-2xl font-semibold text-center text-gray-700 mb-4">
        Course and Mentorship Insights
      </h3>

      {/* Divider */}
      <p className="w-full h-1 bg-gray-300 my-2" />

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mentorship Insights */}
        <MentorshipInsights mentorship={mergedMentorship} />

        {/* Course Insights */}
        <CourseInsights course={mergedCourses} />
      </div>
    </div>
  );
};

// Prop Validation
MentorDashboardInsights.propTypes = {
  MyCoursesData: PropTypes.arrayOf(PropTypes.object),
  MyMentorshipData: PropTypes.arrayOf(PropTypes.object),
  MyCoursesApplicationsData: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
      })
    )
  ),
  MyMentorshipApplicationsData: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
      })
    )
  ),
};
export default MentorDashboardInsights;
