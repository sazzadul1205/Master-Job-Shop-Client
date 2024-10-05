import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import Loader from "../Shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Rating from "react-rating";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { useForm } from "react-hook-form";

const PostedJobDetail = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate for back navigation
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetching job detail by ID
  const {
    data: jobDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["PostedJobsDetailsData", id],
    queryFn: () => axiosPublic.get(`/Posted-Job/${id}`).then((res) => res.data), // Fetch job by ID
  });

  // Handle form submission for applicants
  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
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

  // Render job details once data is fetched
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 ">
      <div className="max-w-[1200px] mx-auto text-black pt-24">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        {/* Top part */}
        <div className="flex items-center justify-between pt-2">
          {/* Content */}
          <div>
            <p className="text-2xl grid grid-cols-2 py-1">
              <span className="font-semibold mr-10">Company Name:</span>
              {jobDetails.companyName}
            </p>
            <p className="text-xl grid grid-cols-2 py-1">
              <span className="font-semibold mr-10 ">Position:</span>
              {jobDetails.jobTitle}
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
          {/* Image */}
          {jobDetails.companyLogo && (
            <img
              src={jobDetails.companyLogo}
              alt={jobDetails.companyName}
              className="border-2 border-black"
            />
          )}
        </div>

        {/* Description */}
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Description:</h4>
          <p>{jobDetails.jobDescription}</p>
        </div>

        {/* Responsibilities */}
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Responsibilities:</h4>
          <ul className="list-disc pl-5 mb-4">
            {jobDetails.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>

        {/* Qualifications */}
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Qualifications:</h4>
          <ul className="list-disc pl-5 mb-4">
            {jobDetails.qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div className="flex items-center justify-between ">
          <div className="text-xl mt-8">
            <h4 className="font-semibold">Tools and Technologies:</h4>
            <ul className="list-disc gap-3 mb-4 flex mt-2">
              {jobDetails.toolsAndTechnologies.map((tool, index) => (
                <p key={index} className="py-1 px-6 bg-gray-300 rounded-full">
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

        {/* List */}
        <div className="overflow-x-auto py-5">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold my-4">Applicants</p>
            <button
              className="bg-green-500 hover:bg-green-400 px-10 py-3 text-white font-bold"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Apply
            </button>
          </div>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Applied Date</th>
                <th className="border px-4 py-2">About Me</th>
              </tr>
            </thead>
            <tbody>
              {jobDetails.PeopleApplied &&
              jobDetails.PeopleApplied.length > 0 ? (
                jobDetails.PeopleApplied.map((applicant, index) => (
                  <tr key={index} className="border-t">
                    <td className="border px-4 py-2">
                      {applicant.image ? (
                        <img
                          src={applicant.image}
                          alt={applicant.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="border px-4 py-2">{applicant.name}</td>
                    <td className="border px-4 py-2">{applicant.email}</td>
                    <td className="border px-4 py-2">
                      {new Date(applicant.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{applicant.AboutMe}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-red-500 font-bold py-4"
                  >
                    No applicants yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <dialog id="my_modal_1" className="modal">
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="dialog"
            className="modal-box"
          >
            <h3 className="font-bold text-lg">Submit your application</h3>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                {...register("name", { required: true })}
                className="input input-bordered w-full mt-4"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">Name is required</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                {...register("email", { required: true })}
                className="input input-bordered w-full mt-4"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </div>
            <div>
              <textarea
                placeholder="About Me"
                {...register("aboutMe", { required: true })}
                className="textarea textarea-bordered w-full mt-4"
              />
              {errors.aboutMe && (
                <p className="text-red-500 text-sm mt-1">
                  A description is required
                </p>
              )}
            </div>
            <div className="modal-action">
              <button className="btn bg-red-500 text-white hover:bg-red-400">
                Close
              </button>
              <button
                className="btn bg-green-500 text-white hover:bg-green-400"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default PostedJobDetail;
