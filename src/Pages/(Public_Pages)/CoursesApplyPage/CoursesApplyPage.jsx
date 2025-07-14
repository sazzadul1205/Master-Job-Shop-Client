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
import CourseDetailsModal from "../Home/FeaturedCourses/CourseDetailsModal/CourseDetailsModal";

// Modals

const CoursesApplyPage = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  // UI & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

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
      setIsSubmitting(true);

      const applicationData = {
        courseId: courseId,
        applicantName: data.name,
        email: UsersData.email,
        motivation: data.motivation || "",
        appliedAt: new Date().toISOString(),
        status: "pending",
      };

      await axiosPublic.post("/CourseApplications", applicationData);

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: "Your application has been sent successfully!",
      });

      reset();
      navigate(-1);
    } catch (err) {
      console.error(
        "Application Submit Error:",
        err?.response?.data || err.message
      );

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const { title, description, category, level, language } = SelectedCourseData;

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
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="mb-4">{description}</p>
            <p>
              <strong>Category:</strong> {category} | <strong>Level:</strong>{" "}
              {level} | <strong>Language:</strong> {language}
            </p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
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

            {/* Motivation */}
            <div>
              <label className="block font-medium mb-1">
                Motivation (optional)
              </label>
              <textarea
                rows={4}
                placeholder="Why do you want to join this course?"
                {...register("motivation")}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

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
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg text-black space-y-5">
            <h3 className="text-lg font-bold">🔒 Login Required</h3>
            <p>You must be logged in to apply for this course.</p>
            <div className="flex justify-end gap-3">
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
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg text-black space-y-5">
            <h3 className="text-lg font-bold">Already Applied</h3>
            <p>You have already applied for this course.</p>
            <div className="flex justify-end gap-3">
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
    </>
  );
};

export default CoursesApplyPage;
