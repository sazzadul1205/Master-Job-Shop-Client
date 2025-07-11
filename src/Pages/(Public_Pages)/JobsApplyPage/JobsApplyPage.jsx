import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import Swal from "sweetalert2";
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import { FaArrowLeft, FaInfo } from "react-icons/fa";
import JobDetailsModal from "../Home/FeaturedJobs/JobDetailsModal/JobDetailsModal";

const JobsApplyPage = () => {
  const axiosPublic = useAxiosPublic();
  const { jobId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch job data
  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["SelectedJobData", jobId],
    queryFn: () => axiosPublic.get(`/Jobs?id=${jobId}`).then((res) => res.data),
    enabled: !!jobId,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [loading, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    console.log("Application submitted:", {
      ...data,
      applicant: user?.email || "Guest",
      appliedAt: new Date().toISOString(),
    });

    Swal.fire({
      icon: "success",
      title: "Application Submitted",
      text: "Your application has been sent successfully!",
    });

    reset();
  };

  if (isLoading || loading) return <Loading />;
  if (error) return <Error />;
  if (!job) return null;

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
  } = job;

  const deadlinePassed = new Date(applicationDeadline) < new Date();

  return (
    <>
      {/* Top bar with Back and Details */}
      <div className="flex items-center justify-between mb-1 px-20 mx-auto">
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
            document.getElementById("Jobs_Details_Modal").showModal();
            setSelectedJobID(job?._id);
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-sm text-gray-600">Company: {company?.name}</p>
          </div>

          {description && (
            <div className="mb-6">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

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
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Resume */}
                {requiresResume && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume (PDF) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      {...register("resume", {
                        required: "Resume is required",
                      })}
                      className="w-full text-sm"
                    />
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
                      className="w-full border border-gray-300 rounded px-3 py-2"
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
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    {errors.coverLetter && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.coverLetter.message}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition duration-200"
                >
                  Submit Application
                </button>
              </form>

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
