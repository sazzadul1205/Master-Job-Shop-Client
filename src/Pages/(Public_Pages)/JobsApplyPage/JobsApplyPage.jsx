import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

const JobsApplyPage = () => {
  const axiosPublic = useAxiosPublic();
  const { jobId } = useParams();
  const { user } = useAuth();
  const loginModalRef = useRef(null);
  const navigate = useNavigate();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!user && loginModalRef.current) {
      loginModalRef.current.showModal();
    }
  }, [user]);

  const onSubmit = (data) => {
    if (!user) {
      loginModalRef.current?.showModal();
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

  if (isLoading) return <Loading />;
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
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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

      {/* Login Modal using native <dialog> */}
      <dialog id="login_modal" className="modal" ref={loginModalRef}>
        <div className="modal-box min-w-xl relative bg-linear-to-bl from-white to-gray-200 rounded-xl shadow-lg w-full mx-auto overflow-y-auto max-h-[90vh] p-5">
          <h3 className="font-bold text-lg text-black">🔒 Login Required</h3>
          <p className="py-4 text-black font-semibold">
            You must be logged in to apply for this job.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2 justify-end">
              <CommonButton
                type="button"
                text="Login"
                clickEvent={() => {
                  loginModalRef.current.close();
                  window.location.href = "/Login";
                }}
                bgColor="blue"
                textColor="text-white"
                px="px-10"
                py="py-2"
                borderRadius="rounded"
                width="auto"
                className="btn-primary"
              />

              <CommonButton
                type="button"
                text="Cancel"
                clickEvent={() => {
                  loginModalRef.current.close();
                  navigate(-1); // Go back one page in history
                }}
                bgColor="gray"
                textColor="text-white"
                px="px-10"
                py="py-2"
                borderRadius="rounded"
                width="auto"
              />
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default JobsApplyPage;
