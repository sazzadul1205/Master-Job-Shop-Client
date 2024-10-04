import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";

const FeaturedJobs = () => {
  const [selectedJob, setSelectedJob] = useState(null); // State for the selected job for the modal
  const axiosPublic = useAxiosPublic();

  const calculateDaysAgo = (isoString) => {
    const postedDate = new Date(isoString);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      return "Today";
    }
    return `${daysDiff} days ago`;
  };

  const openModal = (job) => {
    setSelectedJob(job);
    const modal = document.getElementById("my_modal_2");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_2");
    modal.close();
    setSelectedJob(null); // Clear selected job when closing
  };

  // Fetching PostedJobsData
  const {
    data: PostedJobsData,
    isLoading: PostedJobsDataIsLoading,
    error: PostedJobsDataError,
  } = useQuery({
    queryKey: ["PostedJobsData"],
    queryFn: () => axiosPublic.get(`/Posted-Job`).then((res) => res.data),
  });

  // Loading state
  if (PostedJobsDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (PostedJobsDataError) {
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
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-20">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Featured Jobs
          </p>
          <p className="text-xl">Find your dream job and help yourself</p>
        </div>

        {/* Job Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {PostedJobsData.slice(0, 6).map((job) => (
            <div
              key={job._id}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
            >
              {/* Card */}
              <div className="card-body">
                <p className="font-bold text-2xl text-black">{job.jobTitle}</p>
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
                <div className="card-actions justify-end mt-5">
                  <Link to={`/PostedJobsDetails/${job._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                      Apply Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                    onClick={() => openModal(job)}
                  >
                    View More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {selectedJob && (
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box bg-white text-black max-w-[700px] bg-gradient-to-br from-blue-100 to-blue-50">
              {/* Top part */}
              <div className="flex items-center justify-between">
                {/* Content */}
                <div>
                  <p className="text-2xl font-bold">
                    {selectedJob.companyName}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-2">Position:</span>
                    {selectedJob.jobTitle}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Location:</span>
                    {selectedJob.location}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Job Type:</span>
                    {selectedJob.jobType}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Salary:</span>
                    {selectedJob.salary}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Posted Date:</span>
                    {new Date(selectedJob.postedDate).toLocaleDateString()}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Available Until:</span>
                    {new Date(selectedJob.availableUntil).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold mr-5">Company Link:</span>
                    <a
                      href={selectedJob.companyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedJob.companyLink}
                    </a>
                  </p>
                </div>
                {/* Image */}
                {selectedJob.companyLogo && (
                  <img
                    src={selectedJob.companyLogo}
                    alt={selectedJob.companyName}
                    className="border border-gray-200"
                  />
                )}
              </div>

              {/* Description */}
              <p className="py-4">{selectedJob.jobDescription}</p>

              {/* Responsibilities */}
              <div>
                <h4 className="font-semibold">Responsibilities:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {selectedJob.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="font-semibold">Qualifications:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {selectedJob.qualifications.map((qualification, index) => (
                    <li key={index}>{qualification}</li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div className="flex items-center justify-between mx-5">
                <div>
                  <h4 className="font-semibold">Tools and Technologies:</h4>
                  <ul className="list-disc gap-3 mb-4 flex mt-2">
                    {selectedJob.toolsAndTechnologies.map((tool, index) => (
                      <p
                        key={index}
                        className="py-1 px-6 bg-gray-300 rounded-full"
                      >
                        {tool}
                      </p>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Company Rating:</h4>
                  <Rating
                    initialRating={selectedJob.companyRating}
                    emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                    fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                    readonly
                  />
                </div>
              </div>

              <div className="modal-action">
                <Link to={`/PostedJobsDetails/${selectedJob._id}`}>
                  <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                    Apply Now
                  </button>
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg font-semibold text-white"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default FeaturedJobs;
