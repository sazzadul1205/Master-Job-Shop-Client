import { useState, useMemo } from "react";

// Icons
import { FaSearch, FaTimes } from "react-icons/fa";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import CourseCard from "../../../Shared/CourseCard/CourseCard";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Modal
import CourseDetailsModal from "../Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";

const Courses = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState(null);

  // Filter States
  const [level, setLevel] = useState("All");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Courses
  const {
    data: CoursesData = [],
    isLoading: CoursesIsLoading,
    error: CoursesError,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get("/Courses").then((res) => res.data),
  });

  // always declare before using
  const allCategories = useMemo(() => {
    if (!CoursesData) return ["All"];
    const set = new Set(CoursesData.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [CoursesData]);

  const allLevels = useMemo(() => {
    if (!CoursesData) return ["All"];
    const set = new Set(CoursesData.map((c) => c.level));
    return ["All", ...Array.from(set)];
  }, [CoursesData]);

  const allLanguages = useMemo(() => {
    if (!CoursesData) return ["All"];
    const set = new Set(CoursesData.map((c) => c.language));
    return ["All", ...Array.from(set)];
  }, [CoursesData]);

  // Filter + sort courses
  const filteredCourses = useMemo(() => {
    if (!CoursesData) return [];
    const result = CoursesData.filter((course) => {
      const keywordMatch =
        searchTerm === "" ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        course.Mentor?.name // 👈 fixed: your data has "Mentor", not "instructor"
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const categoryMatch =
        category === "All" ||
        course.category.toLowerCase() === category.toLowerCase();

      const levelMatch =
        level === "All" || course.level.toLowerCase() === level.toLowerCase();

      const languageMatch =
        language === "All" ||
        course.language.toLowerCase() === language.toLowerCase();

      return keywordMatch && categoryMatch && levelMatch && languageMatch;
    });

    return result.sort((a, b) => {
      const dateA = new Date(a.postedAt || a.startDate || 0);
      const dateB = new Date(b.postedAt || b.startDate || 0);
      return dateB - dateA;
    });
  }, [searchTerm, category, level, language, CoursesData]);
  // Loading / Error UI
  if (CoursesIsLoading) return <Loading />;
  if (CoursesError) return <Error />;

  // Reset filters
  const handleClear = () => {
    setLevel("All");
    setSearchTerm("");
    setCategory("All");
    setLanguage("All");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative text-center">
        {/* Search Toggle */}
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-white px-4 md:px-20 pb-2">
          Explore Courses
        </h1>

        {/* Sub Title */}
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Discover our curated collection of expert-led courses. Learn new
          skills and enhance your career at your own pace.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5 px-10">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
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
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
              {allLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
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
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Button & Results */}
        <div className="flex justify-between items-center px-20 py-3">
          <div className="text-lg text-white playfair">
            {filteredCourses.length} Course
            {filteredCourses.length !== 1 && "s"} found
          </div>

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

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-5 px-10">
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <div className="flex-grow h-[2px] bg-white opacity-70"></div>
          <span className="w-3 h-3 bg-white rounded-full"></span>
        </div>
      </div>

      {/* Course Cards */}
      <div className="py-6 px-20">
        {filteredCourses.length > 0 ? (
          // Display course cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                setSelectedCourseID={setSelectedCourseID}
              />
            ))}
          </div>
        ) : (
          // Display no courses found message
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No courses found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Course Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
    </div>
  );
};

export default Courses;
