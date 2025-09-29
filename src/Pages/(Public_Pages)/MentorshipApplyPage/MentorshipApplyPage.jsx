import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Icons
import { FaArrowLeft, FaInfo } from "react-icons/fa";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import FormInput from "../../../Shared/FormInput/FormInput";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

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
      if (SelectedMentorshipData?.fee?.confirmationType === "screenshot") {
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

          confirmationValue = screenshotRes.data.data.display_url; // Only the URL
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

      // --- Upload PDF Resume ---
      if (!data.resume || !data.resume[0]) {
        throw new Error("Please select a resume PDF to upload.");
      }

      const resumeForm = new FormData();
      resumeForm.append("file", data.resume[0]);

      const resumeRes = await axiosPublic.post("/PDFUpload", resumeForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!resumeRes.data?.url) throw new Error("Failed to upload PDF.");

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

      const applicationPayload = {
        ...rest,
        status: "pending",
        userId: UsersData?._id,
        email: UsersData?.email,
        phone: UsersData?.phone,
        resumeUrl: resumeRes.data.url,
        mentorshipId: mentorshipId,
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
        "/MentorshipApplications",
        applicationPayload
      );

      // --- Build Notification Payload ---
      const notificationPayload = {
        title: "New Mentorship Application",
        message: `${
          UsersData?.name || "A user"
        } has applied for the mentorship "${SelectedMentorshipData?.title}"`,
        userEmail: UsersData?.email,
        mentorId: SelectedMentorshipData?.Mentor?.email,
        type: "mentorship_application",
        AppliedToId: mentorshipId,
        applicationId: applicationRes.data.insertedId || null,
        createdAt: new Date().toISOString(),
        read: false,
      };

      // --- Send Notification ---
      await axiosPublic.post("/Notifications", notificationPayload);

      // --- Success Feedback ---
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
            {/* Payment Method */}
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
                  navigate(`/MyMentorshipApplication`);
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
