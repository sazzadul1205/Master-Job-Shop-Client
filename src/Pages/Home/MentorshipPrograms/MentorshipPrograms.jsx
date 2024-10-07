import { Link } from "react-router-dom";
import { FaArrowRight, FaStar } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { useState } from "react";
import Rating from "react-rating";

const MentorshipPrograms = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedMentor, setSelectedMentor] = useState(null); // State for selected mentor

  // Fetching MentorshipData
  const {
    data: MentorshipData,
    isLoading: MentorshipDataIsLoading,
    error: MentorshipDataError,
  } = useQuery({
    queryKey: ["MentorshipData"],
    queryFn: () => axiosPublic.get(`/Mentorship`).then((res) => res.data),
  });

  // Loading state
  if (MentorshipDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (MentorshipDataError) {
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

  const openModal = (mentor) => {
    setSelectedMentor(mentor);
    const modal = document.getElementById("Mentor_Profiles_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Mentor_Profiles_view");
    modal.close();
    setSelectedMentor(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="flex items-center px-5">
          <div className="">
            <p className="text-5xl font-bold italic text-blue-700">
              Mentorship Programs
            </p>
            <p className="text-xl">
              Join a mentorship program to advance your skills and career.
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/Courses"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Mentorship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {MentorshipData.slice(0, 6).map((mentor, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-emerald-50 hover:shadow-2xl"
            >
              <div className="card-body">
                {/* Mentor mentorImage */}
                {mentor.mentorImage && (
                  <img
                    src={mentor.mentorImage}
                    alt={`${mentor.mentorName} mentorImage`}
                    className="w-full h-48 object-cover mb-4"
                  />
                )}

                {/* Mentor Name */}
                <p className="font-bold text-2xl">
                  {mentor.mentorName || "Mentor Name"}
                </p>

                {/* Expertise */}
                <p className="text-gray-500">
                  {mentor.expertise || "Expertise Area"}
                </p>

                {/* Duration */}
                <p className="text-blue-500 font-semibold">
                  Duration: {mentor.duration || "6 weeks"}
                </p>

                {/* Description */}
                <p className="text-black">
                  {mentor.description || "Mentorship Program Description"}
                </p>

                {/* Card Actions */}
                <div className="card-actions justify-end mt-5">
                  <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                    Join Now
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                    onClick={() => openModal(mentor)}
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="Mentor_Profiles_view" className="modal">
        {selectedMentor && (
          <div className="modal-box bg-emerald-50 text-black max-w-[800px]">
            {/* Top */}
            <div className="py-1">
              <div className="flex justify-between">
                <div>
                  {/* Name */}
                  <p className="font-bold text-2xl">
                    {selectedMentor.mentorName}
                  </p>

                  {/* Expertise */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Expertise:</span>
                    {selectedMentor.expertise}
                  </p>

                  {/* Duration */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">Duration:</span>
                    {selectedMentor.duration}
                  </p>

                  {/* contactEmail */}
                  <p className="text-lg">
                    <span className="font-bold mr-5">ContactEmail:</span>
                    {selectedMentor.contactEmail}
                  </p>

                  {/* price */}
                  <p className="text-lg py-2 leading-5">
                    <span className="font-bold pr-3">price:</span>
                    {selectedMentor.price}
                  </p>
                </div>

                {/* Mentor Image */}
                {selectedMentor.mentorImage && (
                  <img
                    src={selectedMentor.mentorImage}
                    alt={`${selectedMentor.mentorName} Image`}
                    className="w-60 h-60 object-cover mb-4"
                  />
                )}
              </div>

              {/* Bio */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">Bio:</span>
                {selectedMentor.mentorBio}
              </p>

              {/* Description */}
              <p className="text-lg">
                <span className="font-bold mr-5">Description:</span>
                {selectedMentor.description}
              </p>

              {/* sessionFormat */}
              <p className="text-lg py-2 leading-5">
                <span className="font-bold pr-3">sessionFormat:</span>
                {selectedMentor.sessionFormat}
              </p>

              <div className="flex justify-between items-center">
                {/* Languages */}
                <p className="text-lg py-2 leading-5">
                  <span className="font-bold pr-3">Languages:</span>
                  <ul className="list-disc list-inside p-1">
                    {selectedMentor.languages.map((language, index) => (
                      <li key={index}>{language}</li>
                    ))}
                  </ul>
                </p>

                <div>
                  <h4 className="font-semibold mb-2">Company Rating:</h4>
                  <Rating
                    initialRating={selectedMentor.rating}
                    emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                    fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                    readonly
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white"
              >
                Join Now
              </button>
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
  );
};

export default MentorshipPrograms;
