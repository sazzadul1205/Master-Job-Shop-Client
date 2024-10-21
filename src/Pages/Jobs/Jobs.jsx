import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import ModalJobDetails from "../Shared/ModalJobDetails/ModalJobDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import { Helmet } from "react-helmet";

const Jobs = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosPublic = useAxiosPublic();
  const jobsPerPage = 9;

  const {
    data: PostedJobsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["PostedJobsData"],
    queryFn: () => axiosPublic.get(`/Posted-Job`).then((res) => res.data),
  });

  if (isLoading) return <Loader />;
  if (error) {
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

  const uniqueJobTitles = [
    ...new Set(PostedJobsData.map((job) => job.jobTitle)),
  ];
  const uniqueJobTypes = [...new Set(PostedJobsData.map((job) => job.jobType))];
  const uniqueLocations = [
    ...new Set(PostedJobsData.map((job) => job.location)),
  ];

  const filteredJobs = PostedJobsData.filter((job) => {
    const matchesSearch = job.jobTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTitle = selectedTitle === "" || job.jobTitle === selectedTitle;
    const matchesJobType =
      selectedJobType === "" || job.jobType === selectedJobType;
    const matchesLocation =
      selectedLocation === "" || job.location === selectedLocation;
    return matchesSearch && matchesTitle && matchesJobType && matchesLocation;
  });

  const hasMore = currentPage * jobsPerPage < filteredJobs.length;

  const loadMoreJobs = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const calculateDaysAgo = (isoString) => {
    const daysDiff = Math.floor(
      (new Date() - new Date(isoString)) / (1000 * 60 * 60 * 24)
    );
    return daysDiff === 0 ? "Today" : `${daysDiff} days ago`;
  };

  const openModal = (job) => {
    setSelectedJob(job);
    document.getElementById("my_modal_2").showModal();
  };

  const closeModal = () => {
    document.getElementById("my_modal_2").close();
    setSelectedJob(null);
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Jobs</title>
      </Helmet>
      <div className="pt-20 ">
        {/* Title */}
        <div className="text-black text-center lg:text-left pt-5 mx-auto max-w-[1200px]">
          <h1 className="text-2xl font-bold m-0">Our Posted Jobs</h1>
          <p>Find Your Preferred Job</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center py-3 mx-auto max-w-[1200px] text-black  gap-3">
          {/* Search */}
          <label className="input input-bordered flex items-center w-[300px] md:w-[500px] lg:w-[300px] bg-white mx-auto">
            <input
              type="text"
              className="grow py-2 px-3 focus:outline-none rounded-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="h-5 w-5 opacity-70 text-black" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto">
            {/* Job Title */}
            <select
              className="border border-gray-300 p-2 w-[300px] lg:w-[230px] bg-white text-black"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
            >
              <option value="">All Job Titles</option>
              {uniqueJobTitles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>

            {/* Job Type */}
            <select
              className="border border-gray-300 p-2 w-[300px] lg:w-[230px] bg-white text-black"
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
            >
              <option value="">All Job Types</option>
              {uniqueJobTypes.map((jobType, index) => (
                <option key={index} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>

            {/* Location Selector */}
            <select
              className="border border-gray-300 p-2 w-[300px] lg:w-[230px] bg-white text-black"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Infinite Scroll */}
        <InfiniteScroll
          dataLength={currentPage * jobsPerPage}
          next={loadMoreJobs}
          hasMore={hasMore}
          loader={
            <h4 className="text-2xl text-center font-bold py-5 text-blue-500">
              Loading...
            </h4>
          }
          endMessage={
            <p className="text-2xl text-center font-bold py-5 text-red-500"></p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-10 mx-auto max-w-[1200px] px-5">
            {filteredJobs.slice(0, currentPage * jobsPerPage).map((job) => (
              <div
                key={job._id}
                className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
              >
                {/* Card */}
                <div className="card-body">
                  <p className="font-bold text-2xl text-black">
                    {job.jobTitle}
                  </p>
                  <p className="text-gray-500">{job.companyName}</p>
                  <p className="text-gray-500">{job.location}</p>
                  {job.jobType && (
                    <p className="text-blue-500 font-semibold">
                      Job Type: {job.jobType}
                    </p>
                  )}
                  {job.salary && (
                    <p className="text-green-500">Salary: {job.salary}</p>
                  )}
                  {job.postedDate && (
                    <p className="text-black">
                      Posted: {calculateDaysAgo(job.postedDate)}
                    </p>
                  )}
                  <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                    <Link to={`/PostedJobsDetails/${job._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                        Apply Now
                      </button>
                    </Link>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
                      onClick={() => openModal(job)} // Open modal on button click
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* View Modal */}
      <dialog id="my_modal_2" className="modal">
        {selectedJob && (
          <ModalJobDetails selectedJob={selectedJob} closeModal={closeModal} />
        )}
      </dialog>
    </div>
  );
};

export default Jobs;
