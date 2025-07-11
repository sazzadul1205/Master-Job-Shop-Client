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
import JobDetailsModal from "../Home/FeaturedJobs/JobDetailsModal/JobDetailsModal";

const JobsApplyPage = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();
  const { jobId } = useParams();

  // Navigation
  const navigate = useNavigate();

  // State Management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch job data
  const {
    data: SelectedJobData,
    isLoading: SelectedJobIsLoading,
    error: SelectedJobError,
  } = useQuery({
    queryKey: ["SelectedJobData", jobId],
    queryFn: () => axiosPublic.get(`/Jobs?id=${jobId}`).then((res) => res.data),
    enabled: !!jobId,
  });

  // Fetch job data
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

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show login modal if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [loading, user]);

  // Form Handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // On Submit
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
        jobId: jobId,
        name: data.name,
        dob: UsersData?.dob,
        email: UsersData?.email,
        phone: UsersData?.phone,
        resumeUrl: res.data.url,
        portfolio: data.portfolio || "",
        coverLetter: data.coverLetter || "",
        appliedAt: new Date().toISOString(),
        profileImage: UsersData?.profileImage,
        applicant: UsersData?.email || "Guest",
      };

      // Send application to backend
      await axiosPublic.post("/JobApplications", applicationData);

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

  // Loading
  if (SelectedJobIsLoading || UsersIsLoading || loading) return <Loading />;

  // Error
  if (SelectedJobError || UsersError) return <Error />;

  // show nothing if nothing is loaded
  if (!SelectedJobData || !UsersData) return null;

  // Job Details
  const {
    title,
    company,
    description,
    application: {
      requiresResume,
      requiresPortfolio,
      requiresCoverLetter,
      applicationDeadline,
      applyUrl,
    } = {},
  } = SelectedJobData;

  // Check if application deadline has passed
  const deadlinePassed = new Date(applicationDeadline) < new Date();

  return (
    <>
      {/* Top bar with Back and Details */}
      <div className="flex items-center justify-between mb-1 px-20 mx-auto">
        {/* Back Button */}
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

        {/* Details Button */}
        <CommonButton
          type="button"
          text="Details"
          clickEvent={() => {
            document.getElementById("Jobs_Details_Modal").showModal();
            setSelectedJobID(SelectedJobData?._id);
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

      {/* Form  */}
      <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-sm text-gray-600">Company: {company?.name}</p>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-6">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          {/* Form / Fall-Back */}
          {deadlinePassed ? (
            <div className="text-red-600 font-semibold text-lg bg-red-100 p-4 rounded">
              The application deadline has passed.
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full border border-gray-300 text-black rounded px-3 py-2 "
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Resume */}
                {requiresResume && (
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
                )}

                {/* Portfolio */}
                {requiresPortfolio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      {...register("portfolio", {
                        required: "Portfolio URL is required",
                      })}
                      placeholder="https://yourportfolio.com"
                      className="w-full border border-gray-300 text-black rounded px-3 py-2"
                    />
                    {errors.portfolio && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.portfolio.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Cover Letter */}
                {requiresCoverLetter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      {...register("coverLetter", {
                        required: "Cover letter is required",
                      })}
                      className="w-full border border-gray-300 text-black rounded px-3 py-2"
                    />
                    {errors.coverLetter && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.coverLetter.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Apply Button */}
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

              {/* Direct Apply Link */}
              {applyUrl && (
                <div className="mt-6 text-sm text-gray-600">
                  Prefer to apply directly?{" "}
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Apply here
                  </a>
                </div>
              )}
            </>
          )}
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
              You must be logged in to apply for this job.
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

      {/* Jobs Modal */}
      <dialog id="Jobs_Details_Modal" className="modal">
        <JobDetailsModal
          selectedJobID={selectedJobID}
          setSelectedJobID={setSelectedJobID}
        />
      </dialog>
    </>
  );
};

export default JobsApplyPage;
