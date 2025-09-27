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

  // Fetch selected course
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

  // Loading/Error UI
  if (
    CheckIfAppliedIsLoading ||
    SelectedCourseIsLoading ||
    UsersIsLoading ||
    loading
  )
    return <Loading />;

  if (SelectedCourseError || UsersError || CheckIfAppliedError)
    return <Error />;

  // Submit handler
  const onSubmit = async (data) => {
    let confirmationValue = data.confirmation;

    // Only handle file upload if confirmationType === "screenshot"
    if (SelectedCourseData?.fee?.confirmationType === "screenshot") {
      if (data.confirmation && data.confirmation[0]) {
        const formData = new FormData();
        formData.append("image", data.confirmation[0]);

        const res = await axiosPublic.post(Image_Hosting_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        confirmationValue = res.data.data.display_url; // store uploaded screenshot URL
      }
    }

    // Validate that user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Handle form submission
    try {
      setIsSubmitting(true);

      // Create application data
      const applicationData = {
        ...data,
        status: "pending",
        courseId: courseId,
        userId: UsersData?._id,
        email: UsersData?.email,
        phone: UsersData?.phone,
        confirmation: confirmationValue,
        appliedAt: new Date().toISOString(),
        profileImage: UsersData?.profileImage,
      };

      // Send application to backend
      await axiosPublic.post("/CourseApplications", applicationData);

      // --- Notification Payload ---
      const notificationPayload = {
        title: "New Course Application",
        message: `${UsersData?.name || "A user"} has applied for the Course "${
          SelectedCourseData?.title
        }"`,
        userId: SelectedCourseData?.Mentor?.email, // Mentor ID is required
        type: "course_application",
        referenceId: courseId,
        createdAt: new Date().toISOString(),
        read: false,
      };

      // Send notification
      await axiosPublic.post("/Notifications", notificationPayload);

      // Success Message
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      navigate(-1);
      reset();
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error:", err);
      console.log("Error:", err);
      setErrorMessage("Failed to create mentorship. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.message || "Something went wrong.",
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

          {/* Payment Section (only if paid mentorship) */}
          {SelectedCourseData?.fee?.isFree === false && (
            <div className="space-y-4">
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Payment Information
              </h2>

              {/* Payment Information */}
              <div className="flex justify-between">
                {/* Payment Method */}
                <div>
                  {/* Payment Method Label */}
                  <label className="block font-medium mb-1">
                    Payment Method
                  </label>

                  {/* Payment Method */}
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
                        default:
                          return "Not specified";
                      }
                    })()}
                  </p>
                </div>

                {/* Fee */}
                <div className="flex flex-col gap-1 text-right">
                  {/* Fee Label */}
                  <h3 className="font-semibold text-lg">Fee :</h3>

                  {/* Amount */}
                  <p className="font-semibold text-green-700">
                    {SelectedCourseData?.fee?.amount}{" "}
                    {SelectedCourseData?.fee?.currency || "USD"}
                  </p>

                  {/* Discount */}
                  {SelectedCourseData?.fee?.discount > 0 && (
                    <p className="text-sm text-gray-600">
                      Discount: {SelectedCourseData.fee.discount}%
                    </p>
                  )}

                  {/* Negotiable */}
                  {SelectedCourseData?.fee?.negotiable && (
                    <p className="text-xs text-yellow-600 italic">
                      * Negotiable
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Link (if available) */}
              {SelectedCourseData?.fee?.paymentLink && (
                <div>
                  <label className="block font-medium mb-1">Payment Link</label>
                  <a
                    href={SelectedCourseData.fee.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-words"
                  >
                    {SelectedCourseData.fee.paymentLink}
                  </a>
                </div>
              )}

              {/* Proof of Payment */}
              <div>
                <label className="block font-medium mb-1">
                  Upload Proof of Payment
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("paymentProof", {
                    required: "Payment proof is required",
                  })}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4  file:rounded-full file:border-0 file:text-sm file:font-semibold  file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer  bg-gray-50 border border-gray-300 rounded-lg"
                />
                {errors.paymentProof && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentProof.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Free Mentorship Message */}
          {SelectedCourseData?.fee?.isFree === true && (
            <div className="text-green-600 font-semibold text-lg">
              This mentorship is Free
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
