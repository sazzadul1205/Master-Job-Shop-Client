import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import Rating from "react-rating";
import { useState } from "react";
import BackButton from "../../Shared/BackButton/BackButton";
import { Helmet } from "react-helmet";

const CompanyProfileDetails = () => {
  const { id } = useParams(); // Get the company profile ID from the URL
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Master Job Shop || Company Profile Details</title>
      </Helmet>
      <div className="max-w-[1200px] mx-auto text-black pt-28 bg-slate-50 opacity-80 px-5 py-5">
        {/* Back button with navigation */}
        <BackButton></BackButton>

        {/* Company Profile Details */}
        <div className="pt-3">
          {/* Top section */}
          <div className="flex flex-col-reverse md:flex-row justify-between gap-5">
            {/* Content */}
            <div>
              {/* companyName */}
              <p className="font-bold text-2xl">{companyProfile.companyName}</p>

              {/* Location */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Location:</span>
                <span className="ml-5"> {companyProfile.location}</span>
              </p>

              {/* Industry */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Industry:</span>
                <span className="ml-5"> {companyProfile.industry}</span>
              </p>

              {/* Website */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold mr-5">Website:</span>
                <a
                  href={companyProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-5"
                >
                  {companyProfile.website}
                </a>
              </p>

              {/* Description */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Description:</span>
                <span className="ml-5">{companyProfile.description}</span>
              </p>
            </div>
            {/* Company Logo */}
            <div>
              {companyProfile.logo && (
                <img
                  src={companyProfile.logo}
                  alt={`${companyProfile.companyName} Logo`}
                  className="w-full md:w-52 h-full md:h-w-52 object-cover mb-4"
                />
              )}
            </div>
          </div>

          {/* Company Details */}
          <div className=" mt-4">
            <h4 className="font-bold text-lg text-blue-500">
              Company Details:
            </h4>

            {/* foundingYear */}
            <p className="text-lg flex ">
              <span className="font-bold w-28">Founding Year:</span>
              <span className="ml-5">
                {companyProfile.companyDetails.foundingYear}
              </span>
            </p>

            {/* employees */}
            <p className="text-lg flex ">
              <span className="font-bold w-28">Employees:</span>
              <span className="ml-5">
                {companyProfile.companyDetails.employees}
              </span>
            </p>

            {/* revenue */}
            <p className="text-lg flex ">
              <span className="font-bold w-28">Revenue:</span>
              <span className="ml-5">
                {companyProfile.companyDetails.revenue}
              </span>
            </p>

            {/* ceo */}
            <p className="text-lg flex ">
              <span className="font-bold w-28">CEO:</span>
              <span className="ml-5"> {companyProfile.companyDetails.ceo}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
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
                  <li key={index} className="text-sm md:text-lg ">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
              {PostedJobsData.slice(0, 6).map((job) => (
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
