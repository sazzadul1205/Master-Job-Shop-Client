import { useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import CourseCard from "../../../Shared/CourseCard/CourseCard";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

const Courses = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGigID, setSelectedGigID] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");

  // Fetch All Courses Once
  const {
    data: allCourses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get("/Courses").then((res) => res.data),
  });

  // Filtered Courses using useMemo for performance
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const keywordMatch =
        searchTerm === "" ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        course.instructor?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const categoryMatch =
        category === "" ||
        course.category.toLowerCase() === category.toLowerCase();

      const levelMatch =
        level === "" || course.level.toLowerCase() === level.toLowerCase();

      const languageMatch =
        language === "" ||
        course.language.toLowerCase() === language.toLowerCase();

      return keywordMatch && categoryMatch && levelMatch && languageMatch;
    });
  }, [searchTerm, category, level, language, allCourses]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  // Clear all filters
  const handleClear = () => {
    setSearchTerm("");
    setLanguage("");
    setCategory("");
    setLevel("");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative text-center">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-200 rounded-full p-3 cursor-pointer"
            title="Toggle Filters"
          >
            {showFilters ? (
              <FaTimes className="text-lg text-black font-bold" />
            ) : (
              <FaSearch className="text-lg text-black font-bold" />
            )}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white px-4 md:px-20 pb-2">
          Explore Courses
        </h1>
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Discover our curated collection of expert-led courses. Learn new
          skills and enhance your career at your own pace.
        </p>
      </div>

      {/* Filters */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black px-20 pt-10">
          {/* Keyword */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Keyword
            </label>
            <input
              type="text"
              placeholder="Title, skill, instructor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded bg-white text-black"
            >
              <option value="">All</option>
              <option value="Data Science">Data Science</option>
              <option value="Web Development">Web Development</option>
              <option value="Design">Design</option>
            </select>
          </div>

          {/* Level */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="p-2 border rounded bg-white text-black"
            >
              <option value="">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border rounded bg-white text-black"
            >
              <option value="">All</option>
              <option value="English">English</option>
              <option value="Bangla">Bangla</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Clear all and Found Document  */}
        <div className="flex justify-between items-center px-20 py-3">
          {/* Documents Found */}
          <div className="text-lg text-white playfair">
            {filteredCourses.length} Gig{filteredCourses.length !== 1 && "s"}{" "}
            found
          </div>

          {/* Remove Button */}
          <div className="flex gap-2">
            <CommonButton
              clickEvent={handleClear}
              text="Clear"
              icon={<FaTimes />}
              bgColor="white"
              textColor="text-black"
              px="px-10"
              py="py-2"
              borderRadius="rounded"
              iconSize="text-base"
              width="auto"
            />
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="py-6 px-20">
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                setSelectedGigID={setSelectedGigID}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No courses found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
