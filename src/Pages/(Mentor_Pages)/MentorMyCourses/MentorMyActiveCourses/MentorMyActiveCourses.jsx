import Error from "../../../../Shared/Error/Error";
import Loading from "../../../../Shared/Loading/Loading";

const MentorMyActiveCourses = ({ error, refetch, CoursesData, isLoading }) => {
  // Loading State
  if (isLoading) return <Loading />;

  // Error State
  if (error) return <Error />;

  console.log(CoursesData[9]);

  return (
    <div className="text-black">
      {/* Title */}
      <h3 className="text-2xl font-bold mb-6">
        Ongoing Courses ( {CoursesData?.length || 0} )
      </h3>
    </div>
  );
};

export default MentorMyActiveCourses;
