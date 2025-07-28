import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { FaArrowLeft, FaInfo } from "react-icons/fa";

// Modals
import GigDetailsModal from "../Home/FeaturedGigs/GigDetailsModal/GigDetailsModal";

const GigBiddingPage = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();
  const { gigId } = useParams();

  // Navigation
  const navigate = useNavigate();

  // State Management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGigID, setSelectedGigID] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlreadyBidedModal, setShowAlreadyBidedModal] = useState(false);

  // Fetch Gig Data
  const {
    data: SelectedGigData,
    isLoading: SelectedGigIsLoading,
    error: SelectedGigError,
  } = useQuery({
    queryKey: ["SelectedGigData", gigId],
    queryFn: () => axiosPublic.get(`/Gigs?id=${gigId}`).then((res) => res.data),
    enabled: !!gigId,
  });

  // Fetch User Data
  const {
    data: UsersData,
    isLoading: UsersIsLoading,
    error: UsersError,
  } = useQuery({
    queryKey: ["UsersData", user],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user?.email}`).then((res) => res.data),
    enabled: !!user,
  });

  // Check if user has already Bided for this job
  const {
    data: CheckIfBided,
    isLoading: CheckIfBidedIsLoading,
    error: CheckIfBidedError,
  } = useQuery({
    queryKey: ["CheckIfBided", user?.email, gigId],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/GigBids/Exists?email=${user?.email}&gigId=${gigId}`
      );
      return data.exists;
    },
    enabled: !!user?.email && !!gigId,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show login modal if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [loading, user]);

  // Show already Bided modal if user has already Bided for this job
  useEffect(() => {
    if (!CheckIfBidedIsLoading && CheckIfBided) {
      setShowAlreadyBidedModal(true);
    }
  }, [CheckIfBided, CheckIfBidedIsLoading]);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Submit Bid
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const bidData = {
        name: UsersData.name,
        phone: UsersData.phone,
        email: UsersData.email,
        gigId: SelectedGigData._id,
        coverLetter: data.coverLetter,
        submittedAt: new Date().toISOString(),
        bidAmount: parseFloat(data.bidAmount),
        deliveryDays: parseInt(data.deliveryDays),
      };

      await axiosPublic.post("/GigBids", bidData);

      Swal.fire({
        icon: "success",
        title: "Bid Submitted",
        text: "Your proposal has been successfully submitted.",
      });

      reset();

      // Navigate one step back
      navigate(-1);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading / Error Handling
  if (SelectedGigIsLoading || UsersIsLoading || loading) return <Loading />;
  if (SelectedGigError || UsersError || CheckIfBidedError) return <Error />;

  const budget = SelectedGigData?.budget || {
    min: 0,
    max: 1000,
    currency: "USD",
  };
  const posterName = SelectedGigData?.postedBy?.name || "Unknown";

  // Check if application deadline has passed
  const deadlinePassed =
    new Date(SelectedGigData.deliveryDeadline) < new Date();

  return (
    <>
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6 px-20 mx-auto">
        <CommonButton
          type="button"
          text="Back"
          icon={<FaArrowLeft />}
          iconSize="text-sm"
          iconPosition="before"
          clickEvent={() => navigate(-1)}
          bgColor="white"
          textColor="text-black"
          borderRadius="rounded-md"
          px="px-10"
          py="py-2"
        />

        <CommonButton
          type="button"
          text="Details"
          clickEvent={() => {
            document.getElementById("Gig_Details_Modal")?.showModal();
            setSelectedGigID(SelectedGigData._id);
          }}
          icon={<FaInfo />}
          iconSize="text-sm"
          iconPosition="before"
          bgColor="white"
          textColor="text-black"
          borderRadius="rounded-md"
          px="px-10"
          py="py-2"
        />
      </div>

      {/* Bidding Form */}
      <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Submit Your Bid for: {SelectedGigData.title}
            </h1>
            <p className="text-sm text-gray-600">Posted by: {posterName}</p>
          </div>

          {deadlinePassed ? (
            <div className="text-red-600 font-semibold text-lg bg-red-100 p-4 rounded">
              The application deadline has passed.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Bid Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bid Amount (in {budget.currency}){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("bidAmount", {
                    required: "Bid amount is required",
                    min: {
                      value: budget.min,
                      message: `Minimum bid is ${budget.min}`,
                    },
                    max: {
                      value: budget.max,
                      message: `Maximum bid is ${budget.max}`,
                    },
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
                {errors.bidAmount && (
                  <p className="text-red-500 text-sm">
                    {errors.bidAmount.message}
                  </p>
                )}
              </div>

              {/* Delivery Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time (in days){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("deliveryDays", {
                    required: "Delivery time is required",
                    min: { value: 1, message: "Minimum 1 day required" },
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
                {errors.deliveryDays && (
                  <p className="text-red-500 text-sm">
                    {errors.deliveryDays.message}
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  {...register("coverLetter", {
                    required: "Cover letter is required",
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
                {errors.coverLetter && (
                  <p className="text-red-500 text-sm">
                    {errors.coverLetter.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <CommonButton
                type="submit"
                text="Submit Bid"
                isLoading={isSubmitting}
                bgColor="blue"
                textColor="text-white"
                px="px-5"
                py="py-2"
                borderRadius="rounded"
                width="full"
              />
            </form>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-black">🔒 Login Required</h3>
            <p className="text-black font-medium">
              You must be logged in to apply for this gig.
            </p>
            <div className="flex justify-end gap-4">
              <CommonButton
                type="button"
                text="Login"
                clickEvent={() => {
                  setShowLoginModal(false);
                  window.location.href = "/Login";
                }}
                bgColor="blue"
                textColor="text-white"
                px="px-6"
                py="py-2"
                borderRadius="rounded"
              />
              <CommonButton
                type="button"
                text="Cancel"
                clickEvent={() => {
                  setShowLoginModal(false);
                  navigate(-1);
                }}
                bgColor="gray"
                textColor="text-white"
                px="px-6"
                py="py-2"
                borderRadius="rounded"
              />
            </div>
          </div>
        </div>
      )}

      {showAlreadyBidedModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white min-w-xl space-y-5 rounded-xl shadow-lg max-w-md w-full p-6 relative">
            {/* Title */}
            <h3 className="text-lg font-bold text-black mb-2">Already Bided</h3>

            {/* Sub Title */}
            <p className="text-black font-semibold mb-4">
              You have already Bided for this Gig.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <CommonButton
                text="View Bids"
                clickEvent={() => {
                  setShowAlreadyBidedModal(false);
                  navigate(`/GigBids`);
                }}
                bgColor="blue"
                textColor="text-white"
                px="px-6"
                py="py-2"
                borderRadius="rounded"
              />

              <CommonButton
                text="Back"
                clickEvent={() => {
                  setShowAlreadyBidedModal(false);
                  navigate(-1); // Go back
                }}
                bgColor="gray"
                textColor="text-white"
                px="px-6"
                py="py-2"
                borderRadius="rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gig Modal */}
      <dialog id="Gig_Details_Modal" className="modal">
        <GigDetailsModal
          selectedGigID={selectedGigID}
          setSelectedGigID={setSelectedGigID}
        />
      </dialog>
    </>
  );
};

export default GigBiddingPage;
