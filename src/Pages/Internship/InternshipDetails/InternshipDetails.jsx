import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const InternshipDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetching Internship details by ID
  const {
    data: Internship,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["InternshipDetailsData", id],
    queryFn: () => axiosPublic.get(`/Internship/${id}`).then((res) => res.data),
  });

  // Function to check if the user has already applied
  const checkIfApplied = async () => {
    if (user) {
      try {
        const response = await axiosPublic.get(`/Internship/${id}`);
        const { applicants } = response.data;

        // Check if the user's email is in the applicants array
        const hasApplied = applicants.some(
          (applicants) => applicants.applicantEmail === user.email
        );
        setHasApplied(hasApplied);
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    }
  };

  // Use effect to fetch job data and check application status when the component loads
  useEffect(() => {
    if (user) {
      checkIfApplied(); // Check application status when the user is available
    }
  }, [id, user]);

  // Handle form submission for applicants
  const onSubmit = async (data) => {
    // Format the applicant data
    const applicantData = {
      applicantName: data.applicantName,
      applicantEmail: user.email,
      applicantImage: data.applicantImage,
      aboutApplicant: data.aboutApplicant,
      portfolioLink: data.portfolioLink,
      resumeLink: data.resumeLink,
    };

    reset();
    console.log(applicantData);
    try {
      const response = await axiosPublic.post(
        `/Internship/${id}/apply`,
        applicantData
      );

      if (response.status === 200) {
        // Show success Swal alert
        Swal.fire({
          title: "Success!",
          text: "Your application has been submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Close the modal
        document.getElementById("Add_Application").close();
        refetch();

        // Reset the form after submission
        reset();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          button: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to submit the application. Please try again later.",
        icon: "error",
        button: "OK",
      });
    }
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
          Something went wrong:{" "}
          {error.response?.data?.message || "Please reload the page."}
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
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24 pb-5">
        {/* Back button with navigation */}
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          <FaArrowLeft className="mr-5" />
          Back
        </button>

        <div className="py-1">
          {/* Content */}
          <div className="flex justify-between">
            <div className="py-2">
              {/* Company Name */}
              <p className="font-bold text-3xl">{Internship.companyName}</p>

              {/* Position */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold mr-5">Position:</span>
                {Internship.position}
              </p>

              {/* Duration */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold mr-5">Duration:</span>
                {Internship.duration}
              </p>

              {/* Location */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold mr-5">Location:</span>
                {Internship.location}
              </p>

              {/* Stipend */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold pr-3">Stipend:</span>
                {Internship.stipend}
              </p>

              {/* Application Deadline */}
              <p className="text-xl py-1 grid grid-cols-2">
                <span className="font-bold pr-3">Application Deadline:</span>
                {Internship.applicationDeadline}
              </p>
            </div>

            {/* Company Logo */}
            {Internship.companyLogo && (
              <img
                src={Internship.companyLogo}
                alt={`${Internship.companyName} Logo`}
                className="w-60 h-60 object-cover mb-4"
              />
            )}
          </div>

          {/* Skills Required */}
          <div className="py-2">
            <span className="font-bold pr-5 text-xl">Skills Required:</span>
            <ul className="list-disc pl-10">
              {Internship.skillsRequired.map((skill, index) => (
                <li key={index} className="text-lg">
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div className="py-2">
            <span className="font-bold pr-5 text-xl">Responsibilities:</span>
            <ul className="list-disc pl-10">
              {Internship.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-lg">
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>

          {/* Qualifications */}
          <div className="py-2">
            <span className="font-bold pr-5 text-xl">Qualifications:</span>
            <ul className="list-disc pl-10">
              {Internship.qualifications.map((qualification, index) => (
                <li key={index} className="text-lg">
                  {qualification}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="py-2">
            <span className="font-bold pr-5 text-xl">Contact:</span>
            <p className="text-lg">Email: {Internship.contact.email}</p>
            <p className="text-lg">
              Facebook:{" "}
              <a
                href={Internship.contact.facebook}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {Internship.contact.facebook}
              </a>
            </p>
            <p className="text-lg">
              Website:{" "}
              <a
                href={Internship.contact.website}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {Internship.contact.website}
              </a>
            </p>
          </div>

          {/* Bio */}
          <p className="text-lg py-2 leading-5">
            <span className="font-bold pr-5 text-xl">Bio:</span>
            {Internship.mentorBio}
          </p>

          {/* Description */}
          <p className="text-lg">
            <span className="font-bold pr-5 text-xl">Description:</span>
            {Internship.description}
          </p>

          {/* Applications */}
          <div className="overflow-x-auto mt-6">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold py-2">
                Participant Applications:
              </p>

              {user ? (
                hasApplied ? (
                  // If the user has already applied, show the "Already Applied" button
                  <button
                    className="bg-gray-500 px-10 py-3 text-white font-bold"
                    disabled
                  >
                    Already Applied
                  </button>
                ) : (
                  // If the user is logged in and hasn't applied, show the "Apply" button
                  <button
                    className="bg-green-500 hover:bg-green-600 px-10 py-2 text-white font-semibold"
                    onClick={() =>
                      document.getElementById("Add_Application").showModal()
                    }
                  >
                    Add Application
                  </button>
                )
              ) : (
                // If the user is not logged in, show the "Login" button
                <Link to={"/Login"}>
                  <button className="bg-blue-500 hover:bg-blue-400 px-10 py-3 text-white font-bold">
                    Login
                  </button>
                </Link>
              )}
            </div>
            <table className="table w-full">
              <thead>
                <tr className="bg-blue-500 text-white text-md">
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>About</th>
                  <th>Portfolio Link</th>
                  <th>Resume Link</th>
                </tr>
              </thead>
              <tbody>
                {Internship.applicants.map((applicant, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={applicant.applicantEmail}
                        alt={applicant.applicantName}
                      />
                    </td>
                    <td>{applicant.applicantName}</td>
                    <td>{applicant.applicantEmail}</td>
                    <td>{applicant.aboutApplicant}</td>
                    <td>{applicant.portfolioLink}</td>
                    <td>{applicant.resumeLink}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add Reviews */}
      <dialog id="Add_Application" className="modal">
        <div className="modal-box bg-white text-black border-2 border-red-500">
          <h3 className="font-bold text-xl text-center">Add Reviews</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Applicant Name */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Applicant Name
              </label>
              <input
                id="applicantName"
                type="text"
                {...register("applicantName", {
                  required: "applicantName is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter Applicant Name"
              />
              {errors.applicantName && (
                <p className="text-red-600">{errors.applicantName.message}</p>
              )}
            </div>

            {/* applicant Image */}
            <div>
              <label className="block text-sm font-bold mb-2">
                applicant Image URL
              </label>
              <input
                id="applicantImage"
                type="url"
                {...register("applicantImage", {
                  required: "applicant Image URL is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter applicant Image URL"
              />
              {errors.applicantImage && (
                <p className="text-red-600">{errors.applicantImage.message}</p>
              )}
            </div>

            {/* About Applicant */}
            <div>
              <label className="block text-sm font-bold mb-2">
                About Applicant
              </label>
              <textarea
                id="aboutApplicant"
                {...register("aboutApplicant", {
                  required: "About Applicant is required",
                })}
                className="w-full p-2 border h-36 border-gray-400 bg-white"
                placeholder="Enter About Applicant"
              />
              {errors.aboutApplicant && (
                <p className="text-red-600">{errors.aboutApplicant.message}</p>
              )}
            </div>

            {/* Portfolio Link */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Portfolio Link URL
              </label>
              <input
                id="portfolioLink"
                type="url"
                {...register("portfolioLink", {
                  required: "Portfolio Link URL is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter Portfolio Link URL"
              />
              {errors.portfolioLink && (
                <p className="text-red-600">{errors.portfolioLink.message}</p>
              )}
            </div>

            {/* Resume Link */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Resume Link URL
              </label>
              <input
                id="resumeLink"
                type="url"
                {...register("resumeLink", {
                  required: "Resume Link URL is required",
                })}
                className="w-full p-2 border border-gray-400 bg-white"
                placeholder="Enter Resume Link URL"
              />
              {errors.resumeLink && (
                <p className="text-red-600">{errors.resumeLink.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="modal-action">
              <button
                type="button"
                onClick={() =>
                  document.getElementById("Add_Application").close()
                }
                className="bg-red-500 hover:bg-red-600 px-5 py-3 font-semibold text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 px-5 py-3 font-semibold text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default InternshipDetails;
