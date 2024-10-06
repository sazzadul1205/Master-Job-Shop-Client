import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Courses = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");

  const jobsPerPage = 9;

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

  // Extract unique levels and formats from CoursesData
  const levels = [...new Set(CoursesData.map((course) => course.level))];
  const formats = [...new Set(CoursesData.map((course) => course.format))];

  // Filtered Courses based on search term, selected level, and selected format
  const filteredCourses = CoursesData.filter((course) => {
    const matchesSearchTerm =
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    const matchesFormat = selectedFormat
      ? course.format === selectedFormat
      : true;

    return matchesSearchTerm && matchesLevel && matchesFormat;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / jobsPerPage);
  const currentJobs = filteredCourses.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] pt-20">
        {/* Top Section */}
        <div className="flex justify-between items-center gap-5 pt-5">
          {/* Title */}
          <div className="text-black">
            <h1 className="text-2xl font-bold m-0 pt-5">Our Course</h1>
            <p>Join our Courses to get more Experience</p>
          </div>

          {/* Search */}
          <div>
            <label className="input input-bordered flex items-center gap-2 w-[500px] bg-white">
              <input
                type="text"
                className="grow py-2 px-3 focus:outline-none"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="h-4 w-4 opacity-70 text-black" />
            </label>
          </div>

          {/* Dropdown for Level Title Filter */}
          <select
            className="border border-gray-300 p-2 w-[200px] bg-white text-black"
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

          {/* Dropdown for Format Title Filter */}
          <select
            className="border border-gray-300 p-2 w-[200px] bg-white text-black"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="">All Level Titles</option>
            {formats.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`px-4 py-2 font-semibold text-lg ${
                currentPage === num + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </button>
          ))}
        </div>

        {/* Course Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-5">
          {currentJobs.map((course, index) => (
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
      </div>
    </div>
  );
};

export default Courses;
