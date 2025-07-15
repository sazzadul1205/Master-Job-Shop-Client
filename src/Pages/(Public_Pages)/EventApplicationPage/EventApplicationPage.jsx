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
import EventDetailsModal from "../Home/FeaturedEvents/EventDetailsModal/EventDetailsModal";

const EventApplicationPage = () => {
  const axiosPublic = useAxiosPublic();
  const { user, loading } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();

  // UI & State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [showAlreadyAppliedModal, setShowAlreadyAppliedModal] = useState(false);

  // Fetch selected Event
  const {
    data: SelectedEventData,
    isLoading: SelectedEventIsLoading,
    error: SelectedEventError,
  } = useQuery({
    queryKey: ["SelectedEventData", eventId],
    queryFn: () =>
      axiosPublic.get(`/Events?id=${eventId}`).then((res) => res.data),
    enabled: !!eventId,
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
    queryKey: ["CheckIfApplied", user?.email, eventId],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        `/EventApplications/Exists?email=${user?.email}&eventId=${eventId}`
      );
      return data.exists;
    },
    enabled: !!user?.email && !!eventId,
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

      const applicationData = {
        ...data,
        eventId: eventId,
        email: UsersData?.email,
        phone: UsersData?.phone,
        appliedAt: new Date().toISOString(),
      };

      // Send application to backend
      await axiosPublic.post("/EventApplications", applicationData);
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
    SelectedEventIsLoading ||
    CheckIfAppliedIsLoading ||
    UsersIsLoading ||
    loading
  )
    return <Loading />;

  if (UsersError || SelectedEventError || CheckIfAppliedError) return <Error />;

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
            document.getElementById("Event_Details_Modal")?.showModal();
            setSelectedEventID(SelectedEventData._id);
          }}
          icon={<FaInfo />}
          bgColor="white"
          textColor="text-black"
          px="px-10"
          py="py-2"
          borderRadius="rounded-md"
        />
      </div>

      {/* Form */}
      <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8 text-black">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="mb-6">
            {/* Title */}
            <h2 className="text-3xl font-bold mb-2">
              {SelectedEventData.title}
            </h2>

            <div className="flex gap-2">
              {/* Event Duration */}
              <p className="text-gray-700 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(SelectedEventData.startDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}{" "}
                -{" "}
                {new Date(SelectedEventData.endDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>
              |{/* Location */}
              <p className="text-gray-700 mb-1">
                <strong>Location:</strong> {SelectedEventData.location?.venue},{" "}
                {SelectedEventData.location?.city}
              </p>
            </div>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block font-semibold mb-1" htmlFor="name">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Full Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                defaultValue={UsersData?.name || ""}
                className="w-full border px-4 py-2 rounded-md"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Number of Attendees & Attendance Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1" htmlFor="attendees">
                  Number of Attendees
                </label>
                <input
                  id="attendees"
                  type="number"
                  min="1"
                  max="10"
                  {...register("attendees", {
                    min: { value: 1, message: "Minimum 1 attendee required" },
                    max: { value: 10, message: "Maximum 10 attendees allowed" },
                  })}
                  defaultValue={1}
                  className="w-full border px-4 py-2 rounded-md"
                />
                {errors.attendees && (
                  <p className="text-red-500 text-sm">
                    {errors.attendees.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block font-semibold mb-1"
                  htmlFor="attendanceType"
                >
                  Attendance Type <span className="text-red-600">*</span>
                </label>
                <select
                  id="attendanceType"
                  {...register("attendanceType", {
                    required: "Please select attendance type",
                  })}
                  defaultValue=""
                  className="w-full border px-4 py-2 rounded-md"
                >
                  <option value="" disabled>
                    Select attendance type
                  </option>
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual</option>
                </select>
                {errors.attendanceType && (
                  <p className="text-red-500 text-sm">
                    {errors.attendanceType.message}
                  </p>
                )}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label
                className="block font-semibold mb-1"
                htmlFor="specialRequirements"
              >
                Special Requirements
              </label>
              <textarea
                id="specialRequirements"
                rows="4"
                {...register("specialRequirements")}
                placeholder="Dietary restrictions, accessibility needs, etc."
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            {/* Agreement */}
            <div className="flex items-center gap-3">
              <input
                id="agreeTerms"
                type="checkbox"
                {...register("agreeTerms", {
                  required: "You must agree before submitting",
                })}
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
              <label
                htmlFor="agreeTerms"
                className="select-none cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  terms & conditions
                </a>
                .
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm">
                {errors.agreeTerms.message}
              </p>
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
              You must be logged in to apply for this Event.
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
              You have already applied for this Event.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <CommonButton
                text="View Application"
                clickEvent={() => {
                  setShowAlreadyAppliedModal(false);
                  navigate(`/EventApplications`);
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

      {/* Event Modal */}
      <dialog id="Event_Details_Modal" className="modal">
        <EventDetailsModal
          selectedEventID={selectedEventID}
          setSelectedEventID={setSelectedEventID}
        />
      </dialog>
    </>
  );
};

export default EventApplicationPage;
