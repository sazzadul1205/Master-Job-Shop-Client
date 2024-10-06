import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";

const FeaturedCourses = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching CoursesData
  const {
    data: CoursesData,
    isLoading: CoursesDataIsLoading,
    error: CoursesDataError,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get(`/Courses`).then((res) => res.data),
  });

  // Loading state
  if (CoursesDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CoursesDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex items-center pt-20 px-5">
          <div className="">
            <p className="text-5xl font-bold italic text-blue-700">
              Available Courses
            </p>
            <p className="text-xl">
              Enhance your skills and advance your career!
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Courses"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Course Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {CoursesData.slice(0, 6).map((course, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
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
                  <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-lg font-semibold text-white">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;
