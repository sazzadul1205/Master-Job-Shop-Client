import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import AddInternshipApplicant from "./AddInternshipApplicant/AddInternshipApplicant";

const InternshipDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hasApplied, setHasApplied] = useState(false); // To track if user has applied
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

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

          <div className="text-xl bg-sky-100 py-3 px-5 flex justify-between items-center">
            <p>People Applied: {Internship?.applicants?.length || 0}</p>{" "}
            {/* Displaying the total count */}
            <div>
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
          </div>
        </div>
      </div>

      {/* Modal for Add Reviews */}
      <dialog id="Add_Application" className="modal">
        <AddInternshipApplicant
          refetch={refetch}
          Internship={Internship}
          id={id}
        ></AddInternshipApplicant>
      </dialog>
    </div>
  );
};

export default InternshipDetails;
