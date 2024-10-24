import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import ModalSalaryInsights from "../Shared/ModalSalaryInsights/ModalSalaryInsights";
import InfiniteScroll from "react-infinite-scroll-component"; // Importing InfiniteScroll
import { Helmet } from "react-helmet";

const SalaryInsights = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState(""); // State for search
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const jobsPerPage = 9; // Jobs per page
  const [selectedJob, setSelectedJob] = useState(null); // State for modal
  const [selectedCareerPath, setSelectedCareerPath] = useState(""); // State for careerPath filter
  const [selectedIndustry, setSelectedIndustry] = useState(""); // State for potentialIndustries filter
  const [selectedSkill, setSelectedSkill] = useState(""); // State for skillsRequired filter
  const [hasMore, setHasMore] = useState(true); // State to track if more jobs are available

  // Fetching SalaryInsightData
  const {
    data: SalaryInsightData,
    isLoading: SalaryInsightDataIsLoading,
    error: SalaryInsightDataError,
  } = useQuery({
    queryKey: ["SalaryInsightData"],
    queryFn: () => axiosPublic.get(`/Salary-Insight`).then((res) => res.data),
  });

  // Loading state
  if (SalaryInsightDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (SalaryInsightDataError) {
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

  // Extract unique career paths, industries, and skills from SalaryInsightData
  const careerPaths = Array.from(
    new Set(SalaryInsightData.flatMap((item) => item.careerPath))
  );
  const potentialIndustries = Array.from(
    new Set(SalaryInsightData.flatMap((item) => item.potentialIndustries))
  );
  const skills = Array.from(
    new Set(SalaryInsightData.flatMap((item) => item.skillsRequired))
  );

  // Filtering logic
  const filteredJobs = SalaryInsightData.filter((job) => {
    const matchesSearchTerm = job.jobTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCareerPath = selectedCareerPath
      ? job.careerPath.includes(selectedCareerPath)
      : true;
    const matchesIndustry = selectedIndustry
      ? job.potentialIndustries.includes(selectedIndustry)
      : true;
    const matchesSkill = selectedSkill
      ? job.skillsRequired.includes(selectedSkill)
      : true;
    return (
      matchesSearchTerm && matchesCareerPath && matchesIndustry && matchesSkill
    );
  });

  const currentJobs = filteredJobs.slice(0, currentPage * jobsPerPage);

  // Infinite Scroll logic
  const loadMoreJobs = () => {
    if (currentJobs.length >= filteredJobs.length) {
      setHasMore(false);
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Modal control
  const openModal = (job) => {
    setSelectedJob(job);
    const modal = document.getElementById("SalaryInsightsModal");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("SalaryInsightsModal");
    modal.close();
    setSelectedJob(null);
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Salary Insights</title>
      </Helmet>
      <div className="pt-20">
        {/* Title */}
        <div className="text-black mx-auto max-w-[1200px] text-center lg:text-left ">
          <p className="text-2xl font-bold pt-5">Salary Insights</p>
          <p>Know about the salary insights of different industries.</p>
        </div>

        {/* Search Box and Filters */}
        <div className="flex flex-col lg:flex-row max-w-[1200px] text-black mt-2 mx-auto space-y-2 lg:space-y-0">
          {/* Search bar */}
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
            {/* Career Path Selector */}
            <div>
              <select
                value={selectedCareerPath}
                onChange={(e) => setSelectedCareerPath(e.target.value)}
                className="border border-gray-300 p-2 bg-white text-black w-[300px] lg:w-[220px]  h-12"
              >
                <option value="">All Career Paths</option>
                {careerPaths.map((path, index) => (
                  <option key={index} value={path}>
                    {path}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Selector */}
            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="border border-gray-300 p-2 bg-white text-black w-[300px] lg:w-[220px]  h-12"
              >
                <option value="">All Industries</option>
                {potentialIndustries.map((industry, index) => (
                  <option key={index} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Selector */}
            <div>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="border border-gray-300 p-2 bg-white text-black w-[300px] lg:w-[220px]  h-12"
              >
                <option value="">All Skills</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentJobs.length}
          next={loadMoreJobs}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={<p></p>}
        >
          {/* Salary Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-10 px-3 mx-auto max-w-[1200px]">
            {currentJobs.map((salaryInsight, index) => (
              <div
                key={index}
                className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-orange-50 hover:shadow-2xl"
              >
                <div className="card-body">
                  <p className="font-bold text-2xl">{salaryInsight.jobTitle}</p>
                  <p className="text-green-500 font-semibold">
                    Average Salary: {salaryInsight.averageSalary}
                  </p>
                  <p className="text-blue-500">
                    Experience Level: {salaryInsight.experienceLevel}
                  </p>
                  {salaryInsight.jobType && (
                    <p className="text-gray-500">
                      Job Type: {salaryInsight.jobType}
                    </p>
                  )}
                  <div className="card-actions justify-end">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-lg font-semibold text-white"
                      onClick={() => openModal(salaryInsight)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* Modal */}
      <dialog id="SalaryInsightsModal" className="modal">
        {selectedJob && (
          <ModalSalaryInsights
            selectedJob={selectedJob}
            closeModal={closeModal}
          ></ModalSalaryInsights>
        )}
      </dialog>
    </div>
  );
};

export default SalaryInsights;
