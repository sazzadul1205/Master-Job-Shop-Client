import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "react-rating";
import { FaStar } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import JobModalCard from "./JobModalCard/JobModalCard";
import BackButton from "../../Shared/BackButton/BackButton";

const PostedJobDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false);
  const axiosPublic = useAxiosPublic();

  const {
    data: jobDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["PostedJobsDetailsData", id],
    queryFn: () => axiosPublic.get(`/Posted-Job/${id}`).then((res) => res.data),
  });

  useEffect(() => {
    if (user && jobDetails) {
      // Check if the user has already applied
      setHasApplied(
        jobDetails.PeopleApplied.some((app) => app.email === user.email)
      );
    }
  }, [user, jobDetails]);

  if (isLoading) return <Loader />;

  if (error)
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

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black pt-28 bg-slate-50 opacity-80 px-5 py-5">
        {/* Back Button */}
        <BackButton />

        {/* Content */}
        <div className="py-5">
          {/* Top part */}
          <div className="flex flex-col-reverse md:flex-row justify-between gap-5">
            {/* Content */}
            <div>
              {/* Company Name */}
              <p className="text-2xl font-bold ">{jobDetails.companyName}</p>

              {/* Job Title */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Position:</span>
                <span className="ml-5">{jobDetails.jobTitle}</span>
              </p>

              {/* Location */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Location:</span>
                <span className="ml-5">{jobDetails.location}</span>
              </p>

              {/* ob Type */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Job Type:</span>
                <span className="ml-5">{jobDetails.jobType}</span>
              </p>

              {/* Salary */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Salary:</span>
                <span className="ml-5">{jobDetails.salary}</span>
              </p>

              {/* Posted Date */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Posted Date:</span>
                <span className="ml-5">{jobDetails.postedDate}</span>
              </p>

              {/* Available Until */}
              <p className="text-lg flex flex-col md:flex-row">
                <span className="font-bold w-28">Available Until:</span>
                <span className="ml-5">{jobDetails.availableUntil}</span>
              </p>
            </div>

            {/* Company Logo */}
            <div className="mb-8 lg:mb-0  ">
              {jobDetails.companyLogo && (
                <img
                  src={jobDetails.companyLogo}
                  alt={jobDetails.companyName}
                  className="border border-gray-200 "
                />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="py-4 text-lg">{jobDetails.jobDescription}</p>

          {/* Responsibilities */}
          <div>
            <h4 className="font-semibold mb-2 ">Responsibilities:</h4>
            <ul className="list-disc pl-5 mb-4">
              {jobDetails.responsibilities.map((responsibility, index) => (
                <li className="my-2" key={index}>
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>

          {/* Qualifications */}
          <div>
            <h4 className="font-semibold mb-2 ">Qualifications:</h4>
            <ul className="list-disc pl-5 mb-4">
              {jobDetails.qualifications.map((qualification, index) => (
                <li className="my-2" key={index}>
                  {qualification}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="flex flex-col md:flex-row   justify-between mx-5">
            <div>
              <h4 className="font-semibold">Tools and Technologies:</h4>
              <ul className="list-disc gap-3 mb-4 flex flex-col md:flex-row mt-2">
                {jobDetails.toolsAndTechnologies.map((tool, index) => (
                  <p
                    key={index}
                    className="py-1 px-6 bg-gray-300 rounded-full text-center"
                  >
                    {tool}
                  </p>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company Rating:</h4>
              <Rating
                initialRating={jobDetails.companyRating}
                emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                readonly
              />
            </div>
          </div>
        </div>
        <div className="text-xl bg-sky-100 py-3 px-5 flex flex-col md:flex-row justify-between items-center">
          <p>People Applied: {jobDetails?.PeopleApplied?.length || 0}</p>{" "}
          {/* Displaying the total count */}
          <div>
            {user ? (
              hasApplied ? (
                <button
                  className="bg-gray-500 w-44 py-2 text-white font-bold"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-400 w-44 py-2 text-white font-bold"
                  onClick={() =>
                    document.getElementById("Apply_To_Job").showModal()
                  }
                >
                  Apply
                </button>
              )
            ) : (
              <Link to={"/Login"}>
                <button className="bg-blue-500 hover:bg-blue-400 w-44 py-2 text-white font-bold">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <dialog id="Apply_To_Job" className="modal">
        <JobModalCard
          jobDetails={jobDetails}
          id={id}
          refetch={refetch}
        ></JobModalCard>
      </dialog>
    </div>
  );
};

export default PostedJobDetail;
