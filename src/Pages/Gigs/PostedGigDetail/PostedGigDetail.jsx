import { Link, useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Shared/Loader/Loader";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import Rating from "react-rating";
import { AuthContext } from "../../../Provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import GiaModalCard from "./GiaModalCard/GiaModalCard";

const PostedGigDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);
  const axiosPublic = useAxiosPublic();

  const {
    data: gigDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["PostedGigsDetailsData", id],
    queryFn: () => axiosPublic.get(`/Posted-Gig/${id}`).then((res) => res.data),
  });

  useEffect(() => {
    if (user && gigDetails && gigDetails.peopleBided) {
      setHasApplied(
        gigDetails.peopleBided.some(
          (app) => app.biderEmail?.toLowerCase() === user.email?.toLowerCase()
        )
      );
    }
  }, [user, gigDetails]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-red-500 text-3xl mb-8">
          Something went wrong:{" "}
          {error.response?.data?.message || "Please reload the page."}
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto text-black pt-24">
        <button
          className="flex text-2xl items-center hover:text-red-500"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-5" /> Back
        </button>
        <div className="py-5 w-1/2">
          <p className="font-bold text-3xl py-2">{gigDetails.gigTitle}</p>
          <p className="text-xl grid grid-cols-2 py-1">
            <span className="font-bold mr-5">Client Name:</span>
            {gigDetails.clientName}
          </p>
          <p className="text-xl grid grid-cols-2 py-1">
            <span className="font-bold mr-5">Gig Type:</span>
            {gigDetails.gigType}
          </p>
          <p className="text-xl grid grid-cols-2 py-1">
            <span className="font-bold mr-5">Location:</span>
            {gigDetails.location}
          </p>
          <p className="text-xl grid grid-cols-2 py-1">
            <span className="font-bold mr-5">Payment Rate:</span>
            {gigDetails.paymentRate}
          </p>
          <p className="text-xl grid grid-cols-2 py-1">
            <span className="font-bold mr-5">Duration:</span>
            {gigDetails.duration}
          </p>
        </div>
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Responsibilities:</h4>
          <p>{gigDetails.responsibilities}</p>
        </div>
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Required Skills :</h4>
          <p>{gigDetails.requiredSkills}</p>
        </div>
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Working Hours :</h4>
          <p>{gigDetails.workingHours}</p>
        </div>
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Project Expectations :</h4>
          <p>{gigDetails.projectExpectations}</p>
        </div>
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Communication :</h4>
          <p>{gigDetails.Communication}</p>
        </div>
        <div className="text-xl mt-8">
          <h4 className="font-semibold">Additional Benefits :</h4>
          <p>{gigDetails.additionalBenefits}</p>
        </div>
        <div className="flex justify-between items-center mt-5">
          <p>
            <span className="font-bold">Posted:</span>
            {new Date(gigDetails.postedDate).toLocaleDateString()}
          </p>
          <div>
            <h4 className="font-semibold mb-2">Company Rating:</h4>
            <Rating
              initialRating={parseFloat(gigDetails.rating)}
              emptySymbol={<FaStar className="text-gray-400 text-2xl" />}
              fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
              readonly
            />
          </div>
        </div>
        <div className="text-xl bg-sky-100 py-3 px-5 flex justify-between items-center mt-5">
          <p>People Applied: {gigDetails?.peopleBided?.length || 0}</p>
          <div>
            {user ? (
              hasApplied ? (
                <button
                  className="bg-gray-500 w-40 py-2 text-white font-bold"
                  disabled
                >
                  Already Bided
                </button>
              ) : (
                <button
                  className="bg-green-500 hover:bg-green-400 w-40 py-2 text-white font-bold"
                  onClick={() =>
                    document.getElementById("Apply_for_Gig").showModal()
                  }
                >
                  Bid
                </button>
              )
            ) : (
              <Link to={"/Login"}>
                <button className="bg-blue-500 hover:bg-blue-400 w-40 py-2 text-white font-bold">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
        <dialog id="Apply_for_Gig" className="modal">
          <GiaModalCard gigDetails={gigDetails} id={id} refetch={refetch} />
        </dialog>
      </div>
    </div>
  );
};

export default PostedGigDetail;
