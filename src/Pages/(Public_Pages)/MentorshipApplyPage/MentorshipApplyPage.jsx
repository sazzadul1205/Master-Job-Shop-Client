import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Icons
import { FaArrowLeft, FaInfo } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import { FiAlertCircle, FiLock } from "react-icons/fi";
import { IoArrowBack, IoLogInOutline } from "react-icons/io5";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import FormInput from "../../../Shared/FormInput/FormInput";
// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Modal
import MentorshipDetailsModal from "../Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";

// Constants for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const MentorshipApplyPage = () => {
  const axiosPublic = useAxiosPublic();

  // Auth Hook
  const { user, loading } = useAuth();

  // Params from URL
  const { mentorshipId } = useParams();

  // Navigation
  const navigate = useNavigate();

  // UI & State Variables
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

  // --- React State & Handlers ---
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsAllSelected, setSkillsAllSelected] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  // --------- Selected Mentorship API ---------
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

  // --------- Check If User Applied APIs ---------
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

  // Handle select all skills
  const handleSelectAllSkills = (checked) => {
    setSkillsAllSelected(checked);
    setSelectedSkills(checked ? [...SelectedMentorshipData.skillsCovered] : []);
  };

  // Handle individual skill
  const handleIndividualSkill = (skill, checked) => {
    const updatedSkills = checked
      ? [...selectedSkills, skill]
      : selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updatedSkills);
    setSkillsAllSelected(
      updatedSkills.length === SelectedMentorshipData.skillsCovered.length
    );
  };

  // Loading UI
  if (
    SelectedMentorshipIsLoading ||
    CheckIfAppliedIsLoading ||
    UsersIsLoading ||
    loading
  )
    return <Loading />;

  // Error UI
  if (UsersError || SelectedMentorshipError || CheckIfAppliedError)
    return <Error />;

  // --- Helper: Upload Screenshot ---
  const uploadScreenshot = async (file) => {
    // Return empty string if no file provided
    if (!file) return "";

    const formData = new FormData();
    formData.append("image", file);

    try {
      const screenshotRes = await axiosPublic.post(
        Image_Hosting_API,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return screenshotRes.data?.data?.display_url || "";
    } catch (err) {
      console.error("Screenshot upload failed:", err);
      return "";
    }
  };

  // --- Helper: Upload Resume PDF ---
  const uploadResume = async (file) => {
    // Return empty string if no file provided
    if (!file) return "";

    const resumeForm = new FormData();
    resumeForm.append("file", file);

    try {
      const resumeRes = await axiosPublic.post("/PDFUpload", resumeForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return resumeRes.data?.url || "";
    } catch (err) {
      console.error("Resume upload failed:", err);
      return "";
    }
  };

  // --- Submit handler ---
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (!user) {
        setShowLoginModal(true);
        return;
      }

      // --- Upload Resume PDF ---
      const resumeUrl = await uploadResume(data.resume[0] ?? null);

      // --- Upload Confirmation Screenshot ---
      const confirmationScreenshot = await uploadScreenshot(
        data.confirmation[0] ?? null
      );

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
        resumeUrl,
        mentorshipId: mentorshipId,
        confirmationScreenshot: confirmationScreenshot || null,
        paymentLink: paymentLink || null,
        transactionId: transactionId || null,
        receiptLink: receiptLink || null,
        referenceNumber: referenceNumber || null,
        appliedAt: new Date().toISOString(),
        profileImage: UsersData?.profileImage,
      };

      // --- Submit Application ---
      const applicationRes = await axiosPublic.post(
        "/MentorshipApplications",
        applicationPayload
      );

      // --- Build Notification ---
      const notificationPayload = {
        title: "New Mentorship Application",
        message: `${
          UsersData?.name || "A user"
        } has applied for the mentorship "${SelectedMentorshipData?.title}"`,
        userEmail: UsersData?.email,
        mentorEmail: SelectedMentorshipData?.Mentor?.email,
        type: "mentorship_application",
        AppliedToId: mentorshipId,
        applicationId: applicationRes?.data?.insertedId || null,
        createdAt: new Date().toISOString(),
        read: false,
      };

      // --- Send Notification ---
      await axiosPublic.post("/Notifications", notificationPayload);

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Reset form and go back
      reset();
      navigate(-1);
    } catch (err) {
      // Error Alert
      console.error("Error submitting application:", err);
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
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white font-semibold text-black px-10 py-2 rounded-md border border-gray-300 hover:bg-gray-200 cursor-pointer shadow-lg hover:shadow-2xl  "
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Details Button */}
        <button
          type="button"
          onClick={() => {
            document.getElementById("Mentorship_Details_Modal")?.showModal();
            setSelectedMentorshipID(SelectedMentorshipData._id);
          }}
          className="flex items-center gap-2 bg-white font-semibold text-black px-10 py-2 rounded-md border border-gray-300 hover:bg-gray-200 cursor-pointer shadow-lg hover:shadow-2xl  "
        >
          <FaInfo />
          Details
        </button>
      </div>

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
              required: "portfolio is required",
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

        {/* Skills Check */}
        {SelectedMentorshipData?.skillsCovered?.length > 0 && (
          <div className="space-y-3">
            {/* Title with Select All */}
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Relevant Skills
              </h2>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-success"
                  checked={skillsAllSelected}
                  onChange={(e) => handleSelectAllSkills(e.target.checked)}
                />
                Select All
              </label>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SelectedMentorshipData.skillsCovered.map((skill) => (
                <label key={skill} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("skills")}
                    value={skill}
                    checked={selectedSkills.includes(skill)}
                    onChange={(e) =>
                      handleIndividualSkill(skill, e.target.checked)
                    }
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
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Prerequisites
            </h2>

            {/* Prerequisites */}
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
              {SelectedMentorshipData.prerequisites.map((pre, i) => (
                <li key={i}>{pre}</li>
              ))}
            </ul>

            {/* Acknowledge */}
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
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Resume
          </h2>

          {/* Resume Upload  */}
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Resume (PDF) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setValue("resume", e.target.files)}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-gray-50 border border-gray-300 rounded-lg"
            />
            {errors.resume && (
              <p className="text-sm text-red-500 mt-1">
                {errors.resume.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment & Confirmation (for all paid Mentorship) */}
        {SelectedMentorshipData?.fee?.isFree === false && (
          <div className="space-y-4">
            {/* Payment Method & Fee */}
            <div className="flex justify-between items-start">
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

              {/* Fee Details */}
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-lg">Fee:</h3>
                {SelectedMentorshipData?.fee ? (
                  (() => {
                    const { amount, discount, currency, negotiable } =
                      SelectedMentorshipData.fee;
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
                            Discount: {discount?.toFixed(2)} {currency || "USD"}
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
            {SelectedMentorshipData?.fee?.confirmationType ? (
              (() => {
                switch (SelectedMentorshipData.fee.confirmationType) {
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
              isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>

      {/* Login Modal via State */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10 animate-fadeIn">
            {/* Header with Icon */}
            <div className="flex items-center justify-center mb-4">
              <FiLock className="w-12 h-12 text-blue-600" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Login Required
            </h3>

            {/* Sub Title */}
            <p className="text-gray-600 text-center mb-6">
              You must be logged in to apply for this Mentorship. Please login
              to continue.
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              {/* Login Button */}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  window.location.href = "/Login";
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition"
              >
                <IoLogInOutline className="w-5 h-5" />
                Login
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate(-1);
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 shadow-md transition"
              >
                <IoArrowBack className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal via State */}
      {showAlreadyAppliedModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10 animate-fadeIn">
            {/* Header with Icon */}
            <div className="flex items-center justify-center mb-4">
              <FiAlertCircle className="w-12 h-12 text-yellow-500" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Already Applied
            </h3>

            {/* Sub Title */}
            <p className="text-gray-600 text-center mb-6">
              You’ve already submitted an application for this mentorship.
              Choose what you’d like to do next:
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              {/* View Application */}
              <button
                onClick={() => {
                  setShowAlreadyAppliedModal(false);
                  navigate(`/MyMentorshipApplication`);
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition cursor-pointer "
              >
                <MdOutlineAssignment className="w-5 h-5" />
                View Application
              </button>

              {/* Back */}
              <button
                onClick={() => {
                  setShowAlreadyAppliedModal(false);
                  navigate(-1);
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 shadow-md transition cursor-pointer "
              >
                <IoArrowBack className="w-5 h-5" />
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentorship Details Modal */}
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
