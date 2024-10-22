import { useState, useEffect } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Courses = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCertification, setSelectedCertification] = useState("");
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const coursesPerPage = 9;

  // Fetching CoursesData
  const {
    data: CoursesData,
    isLoading: CoursesDataIsLoading,
    error: CoursesDataError,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get(`/Courses`).then((res) => res.data),
  });

  useEffect(() => {
    if (CoursesData) {
      setCourses(CoursesData.slice(0, coursesPerPage));
    }
  }, [CoursesData]);

  const loadMoreCourses = () => {
    const nextPage = currentPage + 1;
    const newCourses = CoursesData.slice(0, nextPage * coursesPerPage);
    setCourses(newCourses);
    setCurrentPage(nextPage);

    // Check if more courses are available
    if (newCourses.length >= CoursesData.length) {
      setHasMore(false);
    }
  };

  // Loading state
  if (CoursesDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CoursesDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please try again later.
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

  // Extract unique levels, durations, and certifications from CoursesData
  const levels = [...new Set(CoursesData?.map((course) => course.level))];
  const durations = [...new Set(CoursesData?.map((course) => course.duration))];
  const certifications = [
    ...new Set(CoursesData?.map((course) => course.certification)),
  ];

  // Filtered Courses based on search term, selected level, selected duration, and selected certification
  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm =
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    const matchesDuration = selectedDuration
      ? course.duration === selectedDuration
      : true;
    const matchesCertification = selectedCertification
      ? course.certification === selectedCertification
      : true;

    return (
      matchesSearchTerm &&
      matchesLevel &&
      matchesDuration &&
      matchesCertification
    );
  });

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Courses</title>
      </Helmet>

      <div className="pt-20">
        {/* Title */}
        <div className="text-black mx-auto max-w-[1200px] text-center lg:text-left ">
          <h1 className="text-2xl font-bold m-0 pt-5">Our Courses</h1>
          <p>Join our Courses to get more experience</p>
        </div>

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row max-w-[1200px] text-black mt-2 mx-auto space-y-2 lg:space-y-0">
          {/* Search */}

          <label className="input input-bordered flex items-center w-[300px] md:w-[500px] bg-white mx-auto">
            <input
              type="text"
              className="grow py-2 px-3 focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-4 w-4 opacity-70 text-black" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  mx-auto">
            {/* Dropdown for Level Title Filter */}
            <select
              className="border border-gray-300 p-3 w-[300px] bg-white text-black"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">All Level Titles</option>
              {levels.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>

            {/* Dropdown for Duration Filter */}
            <select
              className="border border-gray-300 p-3 w-[300px] bg-white text-black"
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            >
              <option value="">Course Duration</option>
              {durations.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>

            {/* Dropdown for Certification Filter */}
            <select
              className="border border-gray-300 p-3 w-[300px] bg-white text-black"
              value={selectedCertification}
              onChange={(e) => setSelectedCertification(e.target.value)}
            >
              <option value="">Certifications</option>
              {certifications.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Infinite Scroll */}
        <InfiniteScroll
          dataLength={courses.length}
          next={loadMoreCourses}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={<p></p>}
        >
          {/* Course Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-10 px-3 mx-auto max-w-[1200px]">
            {filteredCourses.map((course, index) => (
              <div
                key={index}
                className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl"
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
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Courses;
