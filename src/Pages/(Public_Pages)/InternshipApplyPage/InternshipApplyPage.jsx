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
import InternshipDetailsModal from "../Home/FeaturedInternships/InternshipDetailsModal/InternshipDetailsModal";

const InternshipApplyPage = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();
  const { internshipId } = useParams();
  const navigate = useNavigate();

  // UI & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

  // Fetch selected Internship
  const {
    data: SelectedInternshipData,
    isLoading: SelectedInternshipIsLoading,
    error: SelectedInternshipError,
  } = useQuery({
    queryKey: ["SelectedInternshipData", internshipId],
    queryFn: () =>
      axiosPublic.get(`/Internship?id=${internshipId}`).then((res) => res.data),
    enabled: !!internshipId,
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
    queryKey: ["CheckIfApplied", user?.email, internshipId],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/InternshipApplications/Exists?email=${user?.email}&internshipId=${internshipId}`
      );
      return data.exists;
    },
    enabled: !!user?.email && !!internshipId,
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
        internshipId: internshipId,
        email: UsersData?.email,
        phone: UsersData?.phone,
        resumeUrl: res.data.url,
        appliedAt: new Date().toISOString(),
      };

      // Send application to backend
      await axiosPublic.post("/InternshipApplications", applicationData);
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
    SelectedInternshipIsLoading ||
    CheckIfAppliedIsLoading ||
    UsersIsLoading ||
    loading
  )
    return <Loading />;

  if (UsersError || SelectedInternshipError || CheckIfAppliedError)
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
            document.getElementById("Internship_Details_Modal")?.showModal();
            setSelectedInternshipID(SelectedInternshipData._id);
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
              {SelectedInternshipData?.title}
            </h1>

            <p className="mb-4 ">{SelectedInternshipData?.description}</p>

            <p className="text-sm flex flex-wrap gap-x-4 gap-y-1">
              <span>
                <strong>Client:</strong>{" "}
                {SelectedInternshipData?.postedBy?.name}
              </span>
              <span>
                <strong>Category:</strong> {SelectedInternshipData?.category}{" "}
                &rarr; {SelectedInternshipData?.subCategory}
              </span>
              <span>
                <strong>Mode:</strong>{" "}
                {SelectedInternshipData?.isRemote ? "Remote" : "On-site"}
              </span>
            </p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={UsersData?.name || ""}
                {...register("fullName", { required: "Full name is required" })}
                className="w-full border px-4 py-2 rounded-md"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Location (optional) */}
            <div>
              <label className="block font-semibold mb-1">
                Location (City, Country)
              </label>
              <input
                type="text"
                {...register("location")}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block font-semibold mb-1">
                Preferred Start Date
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full border px-4 py-2 rounded-md"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block font-semibold mb-1">Cover Letter</label>
              <textarea
                rows="5"
                {...register("coverLetter", {
                  required: "Cover letter is required",
                  minLength: {
                    value: 50,
                    message: "Cover letter must be at least 50 characters",
                  },
                })}
                placeholder="Explain why you're a good fit for this internship"
                className="w-full border px-4 py-2 rounded-md"
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm">
                  {errors.coverLetter.message}
                </p>
              )}
            </div>

            {/* Portfolio or GitHub */}
            <div>
              <label className="block font-semibold mb-1">
                Portfolio or GitHub URL
              </label>
              <input
                type="url"
                {...register("portfolio", {
                  required: "Portfolio/GitHub link is required",
                  pattern: {
                    value: /^(https?:\/\/)/i,
                    message: "Enter a valid URL",
                  },
                })}
                placeholder="https://github.com/username"
                className="w-full border px-4 py-2 rounded-md"
              />
              {errors.portfolio && (
                <p className="text-red-500 text-sm">
                  {errors.portfolio.message}
                </p>
              )}
            </div>

            {/* Skills (Tag-like input or CSV) */}
            <div>
              <label className="block font-semibold mb-1">
                Relevant Skills
              </label>
              <input
                type="text"
                {...register("skills", {
                  required: "Mention at least one skill",
                })}
                placeholder="e.g. Python, BeautifulSoup, Web Scraping"
                className="w-full border px-4 py-2 rounded-md"
              />
              {errors.skills && (
                <p className="text-red-500 text-sm">{errors.skills.message}</p>
              )}
            </div>

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

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                {...register("agree", {
                  required: "You must agree before submitting",
                })}
                className="mt-1"
              />
              <label className="text-sm text-gray-700">
                I confirm that the information provided is accurate and I agree
                to the internship terms.
              </label>
            </div>
            {errors.agree && (
              <p className="text-red-500 text-sm">{errors.agree.message}</p>
            )}

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
              You must be logged in to apply for this Internship.
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
              You have already applied for this Internship.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <CommonButton
                text="View Application"
                clickEvent={() => {
                  setShowAlreadyAppliedModal(false);
                  navigate(`/InternshipApplications`);
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

      {/* Internship Modal */}
      <dialog id="Internship_Details_Modal" className="modal">
        <InternshipDetailsModal
          selectedInternshipID={selectedInternshipID}
          setSelectedInternshipID={setSelectedInternshipID}
        />
      </dialog>
    </>
  );
};

export default InternshipApplyPage;
