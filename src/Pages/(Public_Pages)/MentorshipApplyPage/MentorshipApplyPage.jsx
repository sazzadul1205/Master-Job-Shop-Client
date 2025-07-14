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
  const { user, loading } = useAuth();
  const { mentorshipId } = useParams();
  const navigate = useNavigate();

  // UI & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

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

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsSubmitting(true); // Start loading

      const formData = new FormData();
      formData.append("file", data.resume[0]);

      const res = await axiosPublic.post("/PDFUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.data?.url) throw new Error("Failed to upload PDF");

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
      //   console.log(applicationData);

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
      });

      reset();
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
      navigate(-1);
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

  return (
    <>
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

      {/* Form  */}
      <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8 text-black">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {SelectedMentorshipData?.title}
            </h1>
            <p className="mb-4">{SelectedMentorshipData?.description}</p>
            <p className="text-sm gap-3 text-gray-600">
              <strong>Mentor:</strong> {SelectedMentorshipData?.mentor?.name} |{" "}
              <strong>Duration:</strong> {SelectedMentorshipData?.durationWeeks}{" "}
              weeks | <strong>Fee:</strong>{" "}
              {SelectedMentorshipData?.fee?.type === "free"
                ? "Free"
                : `$${SelectedMentorshipData?.fee?.amount} ${SelectedMentorshipData?.fee?.currency}`}
            </p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={UsersData?.name || user?.displayName}
                {...register("name", { required: "Name is required" })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Portfolio / LinkedIn / GitHub */}
            <div>
              <label className="block font-medium mb-1">
                Portfolio / LinkedIn / GitHub (optional)
              </label>
              <input
                type="url"
                {...register("portfolio")}
                placeholder="https://your-portfolio.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Motivation */}
            <div>
              <label className="block font-medium mb-1">
                Why are you applying? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register("motivation", {
                  required: "Motivation is required",
                })}
                className="w-full border border-gray-300 rounded px-3 py-2"
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
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Skills Covered - Self Check */}
            {SelectedMentorshipData?.skillsCovered?.length > 0 && (
              <div>
                <label className="block font-medium mb-1">
                  Relevant Skills
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SelectedMentorshipData.skillsCovered.map((skill) => (
                    <label
                      key={skill}
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        {...register("skills")}
                        value={skill}
                        className="checkbox checkbox-lg checkbox-success"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites Acknowledgment */}
            {SelectedMentorshipData?.prerequisites?.length > 0 && (
              <div>
                <label className="block font-medium mb-1">Prerequisites</label>
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
                    className="checkbox checkbox-lg checkbox-success"
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

            {/* Resume Upload (Optional) */}
            <div className="mb-4">
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resume (PDF) <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <input
                  type="file"
                  accept=".pdf"
                  id="resume"
                  {...register("resume", {
                    required: "Resume is required",
                  })}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700
                   cursor-pointer bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>

              {errors.resume && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.resume.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
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
          </form>
        </div>
      </div>

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

      {/* Mentorship Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </>
  );
};

export default MentorshipApplyPage;
