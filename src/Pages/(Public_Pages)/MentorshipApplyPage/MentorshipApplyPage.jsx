import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Icons
import { FaArrowLeft, FaInfo } from "react-icons/fa";

// Packages
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Shared
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Modal
import MentorshipDetailsModal from "../Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";

const MentorshipApplyPage = () => {
  const axiosPublic = useAxiosPublic();

  // Auth Hook
  const { user, loading } = useAuth();

  // Params from URL
  const { mentorshipId } = useParams();

  // Navigation
  const navigate = useNavigate();

  // UI & State Variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch selected Mentorship
  const {
    data: SelectedMentorshipData,
    isLoading: SelectedMentorshipIsLoading,
    error: SelectedMentorshipError,
  } = useQuery({
    queryKey: ["SelectedMentorshipData", mentorshipId],
    queryFn: () =>
      axiosPublic.get(`/Mentorship?id=${mentorshipId}`).then((res) => res.data),
    enabled: !!mentorshipId,
  });

  // Fetch logged-in user data
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

  // Check if user already applied to this course
  const {
    data: CheckIfApplied,
    isLoading: CheckIfAppliedIsLoading,
    error: CheckIfAppliedError,
  } = useQuery({
    queryKey: ["CheckIfApplied", user?.email, mentorshipId],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/MentorshipApplications/Exists?email=${user?.email}&mentorshipId=${mentorshipId}`
      );
      return data.exists;
    },
    enabled: !!user?.email && !!mentorshipId,
  });

  // Scroll to top on mount
  useEffect(() => window.scrollTo(0, 0), []);

  // Show login modal if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [loading, user]);

  // Show already applied modal if user applied
  useEffect(() => {
    if (!CheckIfAppliedIsLoading && CheckIfApplied) {
      setShowAlreadyAppliedModal(true);
    }
  }, [CheckIfApplied, CheckIfAppliedIsLoading]);

  // Submit handler
  const onSubmit = async (data) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      // Start loading
      setIsSubmitting(true);

      // Create FormData object
      const formData = new FormData();
      formData.append("file", data.resume[0]);

      // Upload resume to backend
      const res = await axiosPublic.post("/PDFUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle errors
      if (!res.data?.url) throw new Error("Failed to upload PDF");

      // Create application data
      const applicationData = {
        ...data,
        mentorshipId: mentorshipId,
        email: UsersData?.email,
        phone: UsersData?.phone,
        resumeUrl: res.data.url,
        appliedAt: new Date().toISOString(),
      };

      // Send application to backend
      await axiosPublic.post("/MentorshipApplications", applicationData);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err) {
      // Handle errors
      console.log("Error:", err);

      // Handle errors
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
      navigate(-1);
      reset();
    }
  };

  // Loading/Error UI
  if (
    SelectedMentorshipIsLoading ||
    CheckIfAppliedIsLoading ||
    UsersIsLoading ||
    loading
  )
    return <Loading />;

  if (UsersError || SelectedMentorshipError || CheckIfAppliedError)
    return <Error />;

  console.log("Mentorship Data :", SelectedMentorshipData);

  return (
    <div className="pb-5">
      {/* Top bar with Back and Details */}
      <div className="flex items-center justify-between mb-4 px-20">
        <CommonButton
          type="button"
          text="Back"
          icon={<FaArrowLeft />}
          clickEvent={() => navigate(-1)}
          bgColor="white"
          textColor="text-black"
          px="px-10"
          py="py-2"
          borderRadius="rounded-md"
        />

        <CommonButton
          type="button"
          text="Details"
          clickEvent={() => {
            document.getElementById("Mentorship_Details_Modal")?.showModal();
            setSelectedMentorshipID(SelectedMentorshipData._id);
          }}
          icon={<FaInfo />}
          bgColor="white"
          textColor="text-black"
          px="px-10"
          py="py-2"
          borderRadius="rounded-md"
        />
      </div>

      {/* Application Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white text-black max-w-5xl mx-auto p-10 rounded "
      >
        {/* Applicant Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Applicant Information
          </h2>

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={UsersData?.name || user?.displayName}
              {...register("name", { required: "Name is required" })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <label className="block font-medium mb-1">
              Portfolio / LinkedIn / GitHub (optional)
            </label>
            <input
              type="url"
              {...register("portfolio")}
              placeholder="https://your-portfolio.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Motivation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Application Details
          </h2>

          <div>
            <label className="block font-medium mb-1">
              Why are you applying? <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register("motivation", {
                required: "Motivation is required",
              })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Tell the mentor why you're a good fit."
            />
            {errors.motivation && (
              <p className="text-red-500 text-sm">
                {errors.motivation.message}
              </p>
            )}
          </div>

          {/* Goals */}
          <div>
            <label className="block font-medium mb-1">
              What do you want to achieve from this mentorship?
            </label>
            <textarea
              rows={3}
              {...register("goals")}
              placeholder="Your learning goals, career objectives..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Skills Check */}
        {SelectedMentorshipData?.skillsCovered?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Relevant Skills
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SelectedMentorshipData.skillsCovered.map((skill) => (
                <label key={skill} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("skills")}
                    value={skill}
                    className="checkbox checkbox-success"
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {SelectedMentorshipData?.prerequisites?.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Prerequisites
            </h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
              {SelectedMentorshipData.prerequisites.map((pre, i) => (
                <li key={i}>{pre}</li>
              ))}
            </ul>
            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                {...register("acknowledge", {
                  required: "You must confirm you meet the prerequisites",
                })}
                className="checkbox checkbox-success"
              />
              I meet the prerequisites listed above
            </label>
            {errors.acknowledge && (
              <p className="text-red-500 text-sm">
                {errors.acknowledge.message}
              </p>
            )}
          </div>
        )}

        {/* Resume Upload */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Resume
          </h2>
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Resume (PDF) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".pdf"
            id="resume"
            {...register("resume", { required: "Resume is required" })}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-gray-50 border border-gray-300 rounded-lg"
          />
          {errors.resume && (
            <p className="text-sm text-red-500 mt-1">{errors.resume.message}</p>
          )}
        </div>

        {/* Payment Section */}
        {/* Payment & Confirmation (only if paid mentorship) */}
        {SelectedMentorshipData?.fee?.isFree === false && (
          <div className="space-y-4">
            {/* Payment Method */}
            <div>
              <label className="block font-medium mb-1">Payment Method</label>
              <p className="text-gray-800 font-semibold capitalize">
                {(() => {
                  switch (SelectedMentorshipData?.fee?.paymentMethod) {
                    case "paypal":
                      return "PayPal";
                    case "stripe":
                      return "Stripe";
                    case "bankTransfer":
                      return "Bank Transfer";
                    case "mobilePayment":
                      return "Mobile Payment (bKash, Paytm, etc.)";
                    case "other":
                      return "Other";
                    default:
                      return "Not specified";
                  }
                })()}
              </p>
            </div>

            {/* Payment Link (if available) */}
            {SelectedMentorshipData?.fee?.paymentLink && (
              <div>
                <label className="block font-medium mb-1">Payment Link</label>
                <a
                  href={SelectedMentorshipData.fee.paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {SelectedMentorshipData.fee.paymentLink}
                </a>
              </div>
            )}

            {/* Confirmation Type Input */}
            <div>
              <label className="block font-medium mb-1">
                Confirmation Type:{" "}
                <span className="text-gray-800 font-semibold capitalize">
                  {SelectedMentorshipData?.fee?.confirmationType}
                </span>
              </label>

              {SelectedMentorshipData?.fee?.confirmationType ===
                "receiptLink" && (
                <input
                  type="url"
                  placeholder="Enter your receipt link"
                  {...register("confirmation", {
                    required: "Receipt link is required",
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              )}

              {SelectedMentorshipData?.fee?.confirmationType ===
                "transactionId" && (
                <input
                  type="text"
                  placeholder="Enter your transaction ID"
                  {...register("confirmation", {
                    required: "Transaction ID is required",
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              )}

              {SelectedMentorshipData?.fee?.confirmationType ===
                "screenshot" && (
                <input
                  type="file"
                  accept="image/*"
                  {...register("confirmation", {
                    required: "Payment screenshot is required",
                  })}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer
            bg-gray-50 border border-gray-300 rounded-lg"
                />
              )}

              {SelectedMentorshipData?.fee?.confirmationType ===
                "referenceNumber" && (
                <input
                  type="text"
                  placeholder="Enter your bank reference number"
                  {...register("confirmation", {
                    required: "Reference number is required",
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              )}

              {errors.confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmation.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-6">
          <CommonButton
            type="submit"
            text="Submit Application"
            bgColor="blue"
            textColor="text-white"
            px="px-5"
            py="py-2"
            borderRadius="rounded"
            width="full"
            isLoading={isSubmitting}
          />
        </div>
      </form>

      {/* Login Modal via State */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white min-w-xl space-y-5 rounded-xl shadow-lg max-w-md w-full p-6 relative">
            {/* Title */}
            <h3 className="text-lg font-bold text-black mb-2">
              🔒 Login Required
            </h3>

            {/* Sub Title */}
            <p className="text-black font-semibold mb-4">
              You must be logged in to apply for this Mentorship.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              {/* Login Button */}
              <CommonButton
                type="button"
                text="Login"
                clickEvent={() => {
                  setShowLoginModal(false);
                  window.location.href = "/Login";
                }}
                bgColor="blue"
                textColor="text-white"
                px="px-10"
                py="py-2"
                borderRadius="rounded"
                width="auto"
              />

              {/* Cancel Button */}
              <CommonButton
                type="button"
                text="Cancel"
                clickEvent={() => {
                  setShowLoginModal(false);
                  navigate(-1); // Go back
                }}
                bgColor="gray"
                textColor="text-white"
                px="px-10"
                py="py-2"
                borderRadius="rounded"
                width="auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal via State */}
      {showAlreadyAppliedModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white min-w-xl space-y-5 rounded-xl shadow-lg max-w-md w-full p-6 relative">
            {/* Title */}
            <h3 className="text-lg font-bold text-black mb-2">
              Already Applied
            </h3>

            {/* Sub Title */}
            <p className="text-black font-semibold mb-4">
              You have already applied for this Mentorship.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <CommonButton
                text="View Application"
                clickEvent={() => {
                  setShowAlreadyAppliedModal(false);
                  navigate(`/MentorshipApplications`);
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
                  setShowAlreadyAppliedModal(false);
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

      {/* Mentorship Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </div>
  );
};

export default MentorshipApplyPage;
