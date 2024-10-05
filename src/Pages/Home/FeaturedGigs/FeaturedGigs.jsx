import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Rating from "react-rating";
import Loader from "../../Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const FeaturedGigs = () => {
  const [selectedGig, setSelectedGig] = useState(null);
  const axiosPublic = useAxiosPublic();

  const calculateDaysAgo = (dateString) => {
    const today = new Date();
    const postedDate = new Date(dateString);
    const diffTime = Math.abs(today - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Fetching PostedGigsData
  const {
    data: PostedGigsData,
    isLoading: PostedGigsDataIsLoading,
    error: PostedGigsDataError,
  } = useQuery({
    queryKey: ["PostedGigsData"],
    queryFn: () => axiosPublic.get(`/Posted-Gig`).then((res) => res.data),
  });

  // Loading state
  if (PostedGigsDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (PostedGigsDataError) {
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

  const openModal = (gig) => {
    setSelectedGig(gig);
    const modal = document.getElementById("my_modal_1");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_1");
    modal.close();
    setSelectedGig(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Featured Gigs
          </p>
          <p className="text-xl">
            Explore high-potential commission-based opportunities to boost your
            career and earnings.
          </p>
        </div>

        {/* Gig Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {PostedGigsData.slice(0, 6).map((gig, index) => (
            <div
              key={index}
              className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-red-50 hover:shadow-2xl"
            >
              <div className="card-body">
                <p className="font-bold text-2xl">
                  {gig.gigTitle || "Gig Title"}
                </p>
                {gig.gigType && (
                  <p className="text-red-500">Gig Type: {gig.gigType}</p>
                )}
                <p className="text-gray-500">
                  {gig.clientName || "Client/Company Name"}
                </p>
                <p className="text-gray-500">
                  {gig.location || "Location or Remote"}
                </p>
                {gig.paymentRate && (
                  <p className="text-green-500">
                    Payment Rate: {gig.paymentRate}
                  </p>
                )}
                {gig.duration && (
                  <p className="text-blue-500">Duration: {gig.duration}</p>
                )}
                {gig.postedDate && (
                  <p className="text-black">
                    Posted: {calculateDaysAgo(gig.postedDate)}
                  </p>
                )}

                {/* Card Actions */}
                <div className="card-actions justify-end mt-5">
                  <Link to={`/PostedGigsDetails/${gig._id}`}>
                    <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                      Apply Now
                    </button>
                  </Link>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                    onClick={() => openModal(gig)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        {selectedGig && (
          <div className="modal-box bg-red-50 text-black max-w-[700px]">
            {/* Top */}
            <div className="py-1">
              <p className="font-bold text-2xl">{selectedGig.gigTitle}</p>
              <p className="text-lg">
                <span className="font-bold mr-5">Client Name:</span>
                {selectedGig.clientName}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Gig Type:</span>
                {selectedGig.gigType}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Location:</span>
                {selectedGig.location}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Payment Rate:</span>
                {selectedGig.paymentRate}
              </p>
              <p className="text-lg">
                <span className="font-bold mr-5">Duration:</span>
                {selectedGig.duration}
              </p>
            </div>

            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Responsibilities:</span>
              {selectedGig.responsibilities}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Required Skills:</span>
              {selectedGig.requiredSkills}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Working Hours:</span>
              {selectedGig.workingHours}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Project Expectations:</span>
              {selectedGig.projectExpectations}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Communication:</span>
              {selectedGig.communication}
            </p>
            <p className="text-lg py-3 leading-5">
              <span className="font-bold pr-3">Additional Benefits:</span>
              {selectedGig.additionalBenefits}
            </p>
            <div className="flex justify-between items-center mt-5">
              <p>
                <span className="font-bold">Posted:</span>
                {new Date(selectedGig.postedDate).toLocaleDateString()}
              </p>
              <div>
                <h4 className="font-semibold mb-2">Company Rating:</h4>
                <Rating
                  initialRating={selectedGig.rating}
                  emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
                  fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
                  readonly
                />
              </div>
            </div>
            <div className="modal-action">
              <Link to={`/PostedGigsDetails/${selectedGig._id}`}>
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
  );
};

export default FeaturedGigs;
