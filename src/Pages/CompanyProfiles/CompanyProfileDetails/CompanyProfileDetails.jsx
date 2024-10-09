import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import Rating from "react-rating";
import { useState } from "react";

const CompanyProfileDetails = () => {
  const { id } = useParams(); // Get the company profile ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for back navigation
  const axiosPublic = useAxiosPublic();
  const [selectedJob, setSelectedJob] = useState(null); // State for the selected job for the modal

  // Fetching company profile details by ID
  const {
    data: companyProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CompanyProfileDetailsData", id],
    queryFn: () =>
      axiosPublic.get(`/Company-Profiles/${id}`).then((res) => res.data), // Fetch company profile by ID
  });

  // Fetching PostedJobsData after company profile is fetched (dependent on companyProfile)
  const {
    data: PostedJobsData = [],
    isLoading: PostedJobsDataIsLoading,
    error: PostedJobsDataError,
  } = useQuery({
    queryKey: ["PostedJobsData", companyProfile?.companyCode],
    queryFn: () =>
      axiosPublic
        .get(`/Posted-Job?companyCode=${companyProfile.companyCode}`)
        .then((res) => res.data),
  });

  // Loading state
  if (isLoading || PostedJobsDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (error || PostedJobsDataError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong:{" "}
          {error?.response?.data?.message ||
            PostedJobsDataError?.response?.data?.message ||
            "Please reload the page."}
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
    setSelectedJob(job); // Set the selected job for the modal
    const modal = document.getElementById("View_FeaturedJobs_Details");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("View_FeaturedJobs_Details");
    modal.close();
    setSelectedJob(null); // Clear selected job on modal close
  };

  // Render company profile details
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        {/* Company Profile Details */}
        <div className="">
          {/* Top section */}
          <div className="flex justify-between">
            <div className="py-2">
              <h1 className="text-3xl font-bold mb-2">
                {companyProfile.companyName}
              </h1>
              <p className="text-lg mb-2">
                <strong>Industry:</strong> {companyProfile.industry}
              </p>
              <p className="text-lg mb-2">
                <strong>Location:</strong> {companyProfile.location}
              </p>
              <p className="text-lg mb-2">
                <strong>Website:</strong>{" "}
                <a
                  href={companyProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {companyProfile.website}
                </a>
              </p>
              <p className=" mb-4">
                <strong>Description:</strong> {companyProfile.description}
              </p>
            </div>
            <img
              src={companyProfile.logo}
              alt={`${companyProfile.companyName} Logo`}
              className="w-80 h-52 mb-4 "
            />
          </div>

          {/* Company Details */}
          <div className="py-2">
            <h2 className="text-2xl font-semibold mb-2">Company Details</h2>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2 ">
              <strong>Founding Year:</strong>{" "}
              {companyProfile.companyDetails.foundingYear}
            </p>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>Employees:</strong>{" "}
              {companyProfile.companyDetails.employees}
            </p>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>Revenue:</strong> {companyProfile.companyDetails.revenue}
            </p>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>CEO:</strong> {companyProfile.companyDetails.ceo}
            </p>
          </div>

          <div className="grid grid-cols-2">
            {/* Services Offered */}
            <div className="py-2">
              <h3 className="text-2xl font-semibold py-2 mt-4">
                Services Offered
              </h3>
              <ul className="list-disc list-inside">
                {companyProfile.companyDetails.services.map(
                  (service, index) => (
                    <li key={index} className="text-lg">
                      {service}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Clients */}
            <div className="py-2">
              <h3 className="text-2xl font-semibold py-2 mt-4">Clients</h3>
              <ul className="list-disc list-inside">
                {companyProfile.companyDetails.clients.map((client, index) => (
                  <li key={index} className="text-lg">
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Key Projects</h3>
            <ul className="list-disc list-inside">
              {companyProfile.companyDetails.keyProjects.map(
                (project, index) => (
                  <li key={index} className="text-lg">
                    <strong>{project.projectName}:</strong>{" "}
                    {project.description} ({project.year})
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Awards */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Awards</h3>
            <ul className="list-disc list-inside">
              {companyProfile.companyDetails.awards.map((award, index) => (
                <li key={index} className="text-lg">
                  <strong>{award.awardName}</strong> ({award.year}) -{" "}
                  {award.organization}
                </li>
              ))}
            </ul>
          </div>

          {/* Office Locations */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">
              Office Locations
            </h3>
            <ul className="list-disc list-inside">
              {companyProfile.companyDetails.officeLocations.map(
                (location, index) => (
                  <li key={index} className="text-lg">
                    {location}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Partnerships */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Partnerships</h3>
            <ul className="list-disc list-inside">
              {companyProfile.companyDetails.partnerships.map(
                (partnership, index) => (
                  <li key={index} className="text-lg">
                    <strong>{partnership.partnerName}</strong> (since{" "}
                    {partnership.since}) - {partnership.description}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Social Media</h3>
            <ul className="list-disc list-inside">
              {Object.entries(companyProfile.companyDetails.socialMedia).map(
                ([platform, link], index) => (
                  <li key={index} className="text-lg">
                    <strong>{platform}:</strong>{" "}
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Our Posted Jobs */}
          <div className="max-w-[1200px] mx-auto text-black pt-5">
            {/* Top section */}
            <div className="flex items-center ">
              <div className="">
                <p className="text-2xl font-bold italic text-blue-700">
                  Our Posted Jobs
                </p>
              </div>
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
                    <div className="card-actions justify-end mt-5">
                      <Link to={`/PostedJobsDetails/${job._id}`}>
                        <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                          Apply Now
                        </button>
                      </Link>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                        onClick={() => openModal(job)} // Open modal on button click
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Modal */}
            <dialog id="View_FeaturedJobs_Details" className="modal">
              {selectedJob && (
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
                        {new Date(
                          selectedJob.availableUntil
                        ).toLocaleDateString()}
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
                      {selectedJob.responsibilities.map(
                        (responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Qualifications */}
                  <div>
                    <h4 className="font-semibold">Qualifications:</h4>
                    <ul className="list-disc pl-5 mb-4">
                      {selectedJob.qualifications.map(
                        (qualification, index) => (
                          <li key={index}>{qualification}</li>
                        )
                      )}
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
                        emptySymbol={
                          <FaStar className="text-gray-400 text-2xl" />
                        }
                        fullSymbol={
                          <FaStar className="text-yellow-500 text-2xl" />
                        }
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
              )}
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileDetails;
