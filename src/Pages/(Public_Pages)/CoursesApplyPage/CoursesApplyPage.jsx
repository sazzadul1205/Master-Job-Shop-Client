import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaArrowLeft, FaInfo } from "react-icons/fa";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import FormInput from "../../../Shared/FormInput/FormInput";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

// Modals
import CourseDetailsModal from "../Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const CoursesApplyPage = () => {
  const axiosPublic = useAxiosPublic();

  // Auth Hook
  const { user, loading } = useAuth();

  // Params from URL
  const { courseId } = useParams();

  // Navigation
  const navigate = useNavigate();

  // UI & State
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // --------- Selected Course API ---------
  const {
    data: SelectedCourseData,
    isLoading: SelectedCourseIsLoading,
    error: SelectedCourseError,
  } = useQuery({
    queryKey: ["SelectedCourseData", courseId],
    queryFn: () =>
      axiosPublic.get(`/Courses?id=${courseId}`).then((res) => res.data),
    enabled: !!courseId,
  });

  // --------- User API ---------
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

  // --------- Check if user applied ---------
  const {
    data: CheckIfApplied,
    isLoading: CheckIfAppliedIsLoading,
    error: CheckIfAppliedError,
  } = useQuery({
    queryKey: ["CheckIfApplied", user?.email, courseId],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/CourseApplications/Exists?email=${user?.email}&courseId=${courseId}`
      );
      return data.exists;
    },
    enabled: !!user?.email && !!courseId,
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

  // Loading UI
  if (
    CheckIfAppliedIsLoading ||
    SelectedCourseIsLoading ||
    UsersIsLoading ||
    loading
  )
    return <Loading />;

  // Error UI
  if (SelectedCourseError || UsersError || CheckIfAppliedError)
    return <Error />;

  // Submit handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // --- Ensure User is Logged In ---
      if (!user) {
        setShowLoginModal(true);
        return;
      }

      // --- Handle Screenshot Upload if Required ---
      let confirmationValue = null;
      if (SelectedCourseData?.fee?.confirmationType === "screenshot") {
        if (data.confirmation && data.confirmation[0]) {
          const formData = new FormData();
          formData.append("image", data.confirmation[0]);

          const screenshotRes = await axiosPublic.post(
            Image_Hosting_API,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          confirmationValue = screenshotRes.data.data.display_url;
        }
      } else {
        // Use other confirmation types if provided
        confirmationValue =
          data.paymentLink ||
          data.transactionId ||
          data.receiptLink ||
          data.referenceNumber ||
          null;
      }

      // --- Build Application Payload ---
      const {
        // eslint-disable-next-line no-unused-vars
        resume,
        paymentLink,
        // eslint-disable-next-line no-unused-vars
        confirmation,
        receiptLink,
        transactionId,
        referenceNumber,
        ...rest
      } = data;

      // --- Build Application Payload ---
      const applicationPayload = {
        ...rest,
        status: "pending",
        userId: UsersData?._id,
        email: UsersData?.email,
        phone: UsersData?.phone,
        courseId: courseId,
        confirmationScreenshot: confirmationValue || null,
        paymentLink: paymentLink || null,
        transactionId: transactionId || null,
        receiptLink: receiptLink || null,
        referenceNumber: referenceNumber || null,
        appliedAt: new Date().toISOString(),
        profileImage: UsersData?.profileImage,
      };

      // --- Submit Application to Backend ---
      const applicationRes = await axiosPublic.post(
        "/CourseApplications",
        applicationPayload
      );

      // --- Build Notification Payload ---
      const notificationPayload = {
        title: "New Course Application",
        message: `${
          UsersData?.name || "A user"
        } has applied for the mentorship "${SelectedCourseData?.title}"`,
        userEmail: UsersData?.email,
        mentorId: SelectedCourseData?.Mentor?.email,
        type: "course_application",
        AppliedToId: courseId,
        applicationId: applicationRes.data.insertedId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      // --- Send Notification ---
      await axiosPublic.post("/Notifications", notificationPayload);

      // --- Success Message ---
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // --- Reset Form and Navigate Back ---
      reset();
      navigate(-1);
    } catch (err) {
      console.error("Error submitting application:", err);

      // Set error message state
      setErrorMessage(
        err?.message || "Something went wrong. Please try again."
      );

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            document.getElementById("Course_Details_Modal")?.showModal();
            setSelectedCourseID(SelectedCourseData._id);
          }}
          icon={<FaInfo />}
          bgColor="white"
          textColor="text-black"
          px="px-10"
          py="py-2"
          borderRadius="rounded-md"
        />
      </div>

      {/* Form  */}
      <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8 text-black">
        {/* Application Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-white text-black max-w-4xl mx-auto p-10 rounded-xl shadow-xl"
        >
          {/* Alert Messages */}
          {errorMessage && (
            <div className="bg-red-100 text-red-800 font-medium border border-red-400 px-4 py-2 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Applicant Info */}
          <div className="space-y-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Applicant Information
            </h2>

            {/* Name */}
            <FormInput
              label="Full Name"
              required
              placeholder="Enter your full name"
              register={register("name", { required: "Name is required" })}
              error={errors.name}
            />

            {/* Portfolio */}
            <FormInput
              label="Portfolio / LinkedIn / GitHub"
              required
              placeholder="https://your-portfolio.com"
              type="url"
              register={register("portfolio", {
                required: "Portfolio is required",
              })}
              error={errors.portfolio}
            />
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Application Details
            </h2>

            {/* Motivation */}
            <FormInput
              label="Why are you applying?"
              required
              as="textarea"
              rows={4}
              placeholder="Tell the mentor why you're a good fit."
              register={register("motivation", {
                required: "Motivation is required",
              })}
              error={errors.motivation}
            />

            {/* Goals */}
            <FormInput
              label="What do you want to achieve?"
              as="textarea"
              rows={3}
              placeholder="Your learning goals, career objectives..."
              register={register("goals")}
              error={errors.goals}
            />
          </div>

          {/* Payment & Confirmation (for all paid Course) */}
          {SelectedCourseData?.fee?.isFree === false && (
            <div className="space-y-4">
              {/* Payment Method & Fee */}
              <div className="flex justify-between items-start">
                {/* Payment Method */}
                <div>
                  <label className="block font-medium mb-1">
                    Payment Method
                  </label>
                  <p className="text-gray-800 font-semibold capitalize">
                    {(() => {
                      switch (SelectedCourseData?.fee?.paymentMethod) {
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

                {/* Fee Details */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-lg">Fee:</h3>
                  {SelectedCourseData?.fee ? (
                    (() => {
                      const { amount, discount, currency, negotiable } =
                        SelectedCourseData.fee;
                      const total = discount
                        ? (amount - discount).toFixed(2)
                        : amount?.toFixed(2) || 0;

                      return (
                        <div className="text-sm space-y-1">
                          <p className="text-gray-800 font-semibold">
                            Amount: {amount?.toFixed(2) || "0"}{" "}
                            {currency || "USD"}
                          </p>
                          {discount && (
                            <p className="text-gray-600 text-sm">
                              Discount: {discount?.toFixed(2)}{" "}
                              {currency || "USD"}
                            </p>
                          )}
                          <p className="text-green-700 font-semibold">
                            Total: {total} {currency || "USD"}
                          </p>
                          {negotiable && (
                            <p className="text-blue-600 text-sm font-medium">
                              Payment is negotiable
                            </p>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-gray-600 italic">Not specified</p>
                  )}
                </div>
              </div>

              {/* Confirmation Input based on confirmationType */}
              {SelectedCourseData?.fee?.confirmationType ? (
                (() => {
                  switch (SelectedCourseData.fee.confirmationType) {
                    case "paymentLink":
                      return (
                        <div>
                          <label className="block font-medium mb-1">
                            Payment Link
                          </label>
                          <input
                            type="url"
                            placeholder="Enter payment link"
                            {...register("paymentLink")}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      );

                    case "receiptLink":
                      return (
                        <div>
                          <label className="block font-medium mb-1">
                            Receipt Link
                          </label>
                          <input
                            type="url"
                            placeholder="Enter receipt link"
                            {...register("receiptLink")}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      );

                    case "transactionId":
                      return (
                        <div>
                          <label className="block font-medium mb-1">
                            Transaction ID
                          </label>
                          <input
                            type="text"
                            placeholder="Enter transaction ID"
                            {...register("transactionId")}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      );

                    case "screenshot":
                      return (
                        <div>
                          <label className="block font-medium mb-1">
                            Upload Screenshot
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            {...register("confirmation")}
                            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer bg-gray-50 border border-gray-300 rounded-lg"
                          />
                        </div>
                      );

                    case "referenceNumber":
                      return (
                        <div>
                          <label className="block font-medium mb-1">
                            Bank Reference Number
                          </label>
                          <input
                            type="text"
                            placeholder="Enter reference number"
                            {...register("referenceNumber")}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      );

                    default:
                      return null;
                  }
                })()
              ) : (
                <p className="text-gray-500 italic">
                  ----- No Confirmation Needed -----
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white min-w-xl space-y-5 rounded-xl shadow-lg max-w-md w-full p-6 relative">
            {/* Title */}
            <h3 className="text-lg font-bold text-black mb-2">
              🔒 Login Required
            </h3>

            {/* Sub Title */}
            <p className="text-black font-semibold mb-4">
              You must be logged in to apply for this Course.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              {/* Login Button */}
              <CommonButton
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
                text="Cancel"
                clickEvent={() => {
                  setShowLoginModal(false);
                  navigate(-1);
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

      {/* Already Applied Modal */}
      {showAlreadyAppliedModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white min-w-xl space-y-5 rounded-xl shadow-lg max-w-md w-full p-6 relative">
            {/* Title */}
            <h3 className="text-lg font-bold text-black mb-2">
              Already Applied
            </h3>

            {/* Sub Title */}
            <p className="text-black font-semibold mb-4">
              You have already applied for this Course.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              {/* View ApplicationS Button */}
              <CommonButton
                text="View Application"
                clickEvent={() => {
                  setShowAlreadyAppliedModal(false);
                  navigate(`/CourseApplications`);
                }}
                bgColor="blue"
                textColor="text-white"
                px="px-6"
                py="py-2"
                borderRadius="rounded"
              />

              {/* Back Button */}
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

      {/* Course Details Modal */}
      <dialog id="Course_Details_Modal" className="modal">
        <CourseDetailsModal
          selectedCourseID={selectedCourseID}
          setSelectedCourseID={setSelectedCourseID}
        />
      </dialog>
    </div>
  );
};

export default CoursesApplyPage;
