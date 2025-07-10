import { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import JobCard from "../../../Shared/JobCard/JobCard";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import JobDetailsModal from "../Home/FeaturedJobs/JobDetailsModal/JobDetailsModal";

const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];
const categories = ["Development", "Design", "Marketing", "Writing", "Sales"];
const levels = ["Entry", "Mid", "Senior"];
const workingModes = ["Remote", "Onsite", "Hybrid"];

const Jobs = () => {
  const axiosPublic = useAxiosPublic();

  const [selectedJobID, setSelectedJobID] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
    category: "",
    level: "",
    mode: "",
    minSalary: "",
    maxSalary: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFilters({
      keyword: "",
      location: "",
      jobType: "",
      category: "",
      level: "",
      mode: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  // Fetching Jobs Data
  const {
    data: JobsData,
    isLoading: JobsIsLoading,
    error: JobsError,
  } = useQuery({
    queryKey: ["JobsData"],
    queryFn: () => axiosPublic.get(`/Jobs`).then((res) => res.data),
  });

  const filteredJobs = useMemo(() => {
    return JobsData.filter((job) => {
      const {
        keyword,
        location,
        jobType,
        category,
        level,
        mode,
        minSalary,
        maxSalary,
      } = filters;

      const matchesKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.name.toLowerCase().includes(keyword.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(keyword.toLowerCase())
        );

      const matchesLocation =
        !location ||
        job.location.toLowerCase().includes(location.toLowerCase());

      const matchesType = !jobType || job.type === jobType;
      const matchesCategory = !category || job.category === category;
      const matchesLevel = !level || job.level === level;

      const matchesMode =
        !mode ||
        (mode === "Remote" && job.remote) ||
        (mode === "Onsite" && job.onsite) ||
        (mode === "Hybrid" && job.hybrid);

      const jobMin = job.salaryRange?.min || 0;
      const jobMax = job.salaryRange?.max || 0;
      const salaryMinOk = !minSalary || jobMax >= Number(minSalary);
      const salaryMaxOk = !maxSalary || jobMin <= Number(maxSalary);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesCategory &&
        matchesLevel &&
        matchesMode &&
        salaryMinOk &&
        salaryMaxOk
      );
    });
  }, [JobsData, filters]);

  // Loading
  if (JobsIsLoading) {
    return <Loading />;
  }

  // Error
  if (JobsError) {
    return <Error />;
  }

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <div>
        {/* Titles */}
        <h1 className="text-3xl font-bold text-white px-4 md:px-20 text-center">
          🔍 Advanced Job Search
        </h1>
        {/* Sub Title */}
        <p className="text-gray-200 font-semibold text-xl px-4 md:px-20 text-center">
          Filter roles by type, skill, and location to find your next
          opportunity.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black px-20 pt-10">
        {/* Keyword */}
        <div className="flex flex-col">
          <label
            htmlFor="keyword"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Keyword
          </label>
          <input
            id="keyword"
            type="text"
            name="keyword"
            placeholder="Title, skill, company"
            value={filters.keyword}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label
            htmlFor="location"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            name="location"
            placeholder="e.g. Remote, Dhaka"
            value={filters.location}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          />
        </div>

        {/* Job Type */}
        <div className="flex flex-col">
          <label
            htmlFor="jobType"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Job Type
          </label>
          <select
            id="jobType"
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          >
            <option value="">All Job Types</option>
            {jobTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="flex flex-col">
          <label
            htmlFor="level"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Experience Level
          </label>
          <select
            id="level"
            name="level"
            value={filters.level}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div className="flex flex-col">
          <label
            htmlFor="mode"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Work Mode
          </label>
          <select
            id="mode"
            name="mode"
            value={filters.mode}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          >
            <option value="">All Modes</option>
            {workingModes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Min Salary */}
        <div className="flex flex-col">
          <label
            htmlFor="minSalary"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Minimum Salary
          </label>
          <input
            id="minSalary"
            type="number"
            name="minSalary"
            placeholder="USD"
            value={filters.minSalary}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          />
        </div>

        {/* Max Salary */}
        <div className="flex flex-col">
          <label
            htmlFor="maxSalary"
            className="mb-1 text-lg text-white playfair font-medium"
          >
            Maximum Salary
          </label>
          <input
            id="maxSalary"
            type="number"
            name="maxSalary"
            placeholder="USD"
            value={filters.maxSalary}
            onChange={handleChange}
            className="p-2 border rounded text-black bg-white"
          />
        </div>
      </div>

      {/* Clear all and Found Document  */}
      <div className="flex justify-between items-center px-20 py-3">
        {/* Documents Found */}
        <div className="text-lg text-white playfair">
          {filteredJobs.length} job{filteredJobs.length !== 1 && "s"} found
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

      {/* Display Jobs */}
      <div className="grid grid-cols-3 gap-3 py-6 px-20">
        {filteredJobs.map((job) => (
          <div key={job._id}>
            <JobCard job={job} setSelectedJobID={setSelectedJobID} />
          </div>
        ))}
      </div>

      {/* Jobs Modal */}
      <dialog id="Jobs_Details_Modal" className="modal">
        <JobDetailsModal
          selectedJobID={selectedJobID}
          setSelectedJobID={setSelectedJobID}
        />
      </dialog>
    </div>
  );
};

export default Jobs;
