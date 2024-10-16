import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Rating from "react-rating";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../Shared/Loader/Loader";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import JobModalCard from "./JobModalCard/JobModalCard";

const PostedJobDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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

  console.log(jobDetails);
  
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
      <div className="max-w-[1200px] mx-auto text-black pt-28">
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-5" /> Back
        </button>
        <div className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-3xl py-2">{jobDetails.jobTitle}</p>
              <p className="text-2xl grid grid-cols-2 py-1">
                <span className="font-semibold mr-10">Company Name:</span>
                {jobDetails.companyName}
              </p>
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Location:</span>
                {jobDetails.location}
              </p>
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Job Type:</span>
                {jobDetails.jobType}
              </p>
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Salary:</span>
                {jobDetails.salary}
              </p>
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Posted Date:</span>
                {new Date(jobDetails.postedDate).toLocaleDateString()}
              </p>
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Available Until:</span>
                {new Date(jobDetails.availableUntil).toLocaleDateString()}
              </p>
              <p className="text-xl grid grid-cols-2 py-1">
                <span className="font-bold text-xl mr-5">Company Link:</span>
                <a
                  href={jobDetails.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {jobDetails.companyLink}
                </a>
              </p>
            </div>
            {jobDetails.companyLogo && (
              <img
                src={jobDetails.companyLogo}
                alt={jobDetails.companyName}
                className="border-2 border-black"
              />
            )}
          </div>

          <div className="text-xl mt-8">
            <h4 className="font-semibold">Description:</h4>
            <p>{jobDetails.jobDescription}</p>
          </div>

          <div className="text-xl mt-8">
            <h4 className="font-semibold">Responsibilities:</h4>
            <ul className="list-disc pl-5 mb-4">
              {jobDetails.responsibilities?.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>

          <div className="text-xl mt-8">
            <h4 className="font-semibold">Qualifications:</h4>
            <ul className="list-disc pl-5 mb-4">
              {jobDetails.qualifications?.map((qual, idx) => (
                <li key={idx}>{qual}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xl mt-8">
              <h4 className="font-semibold">Tools and Technologies:</h4>
              <ul className="list-disc gap-3 mb-4 flex mt-2">
                {jobDetails.toolsAndTechnologies?.map((tool, idx) => (
                  <p key={idx} className="py-1 px-6 bg-gray-300 rounded-full">
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
        <div className="text-xl bg-sky-100 py-3 px-5 flex justify-between items-center">
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
