import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

// Shared
import Loading from "../../Shared/Loading/Loading";
import Error from "../../Shared/Error/Error";

const BecomeMentor = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Fetch User Data
  const {
    data: UserData,
    isLoading: UserIsLoading,
    error: UserError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["UserData"],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Fetch Mentor Data
  const {
    data: MentorData,
    isLoading: MentorIsLoading,
    error: MentorError,
    refetch: refetchMentor,
  } = useQuery({
    queryKey: ["MentorRequestData"],
    queryFn: () =>
      axiosPublic
        .get(`/MentorRequest?userEmail=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // UI Error / Loading State
  if (loading || MentorIsLoading || UserIsLoading) return <Loading />;
  if (MentorError || UserError) return <Error />;

  // On Submit Handler
  const onSubmit = async (data) => {
    const confirm = await Swal.fire({
      title: "Submit Mentor Application?",
      text: "Make sure all your details are correct.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      // Create payload
      const payload = {
        ...data,
        requestedAt: new Date(),
        status: "pending",
        userId: UserData?._id,
        userEmail: user?.email,
      };

      // POST request to submit the Payload
      const res = await axiosPublic.post("/MentorRequest", payload);

      if (res.status === 200) {
        // Show success message
        Swal.fire({
          title: "Submitted",
          text: "Your Mentor application has been received.",
          icon: "success",
        });

        // Reset state and refetch data
        reset();
        refetchUser();
        refetchMentor();
      }
    } catch (err) {
      console.log("Error submitting application:", err);
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    }
  };

  // Handle Cancel Request
  const handleCancelRequest = async (_id) => {
    const result = await Swal.fire({
      title: "Cancel Mentor Application?",
      text: "Are you sure you want to cancel your Mentor application? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "No, Keep it",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPublic.delete(`/MentorRequest/${_id}`);

      Swal.fire({
        title: "Cancelled",
        text: "Your Mentor application has been cancelled.",
        icon: "success",
      });

      // Reset state and refetch data
      reset();
      refetchUser();
      refetchMentor();

      // TODO: refetch or update UI here after cancellation
    } catch (error) {
      console.error("Error cancelling application:", error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message || "Failed to cancel the application.",
        icon: "error",
      });
    }
  };

  // If there is existing Mentor data, show the summary box
  if (MentorData && MentorData.length > 0) {
    // You can tweak how many requests you want to show or just show the first one
    const existingRequest = MentorData[0];

    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex justify-center items-center px-4">
        {/* Mentor Application Status */}
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl text-black space-y-6">
          {/* Title */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
              Mentor Application Summary
            </h2>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                existingRequest.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : existingRequest.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {existingRequest.status.toUpperCase()}
            </span>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* Full Name */}
            <div>
              <p className="font-semibold text-gray-700">Full Name</p>
              <p>{existingRequest.fullName}</p>
            </div>

            {/* Email */}
            <div>
              <p className="font-semibold text-gray-700">Email</p>
              <p>{existingRequest.email}</p>
            </div>

            {/* Expertise */}
            <div>
              <p className="font-semibold text-gray-700">Expertise</p>
              <p>{existingRequest.expertise}</p>
            </div>

            {/* Year of Experience */}
            <div>
              <p className="font-semibold text-gray-700">Years of Experience</p>
              <p>{existingRequest.experienceYears}</p>
            </div>

            {/* Availability */}
            <div>
              <p className="font-semibold text-gray-700">
                Availability (hrs/week)
              </p>
              <p>{existingRequest.availability}</p>
            </div>

            {/* Request Date */}
            <div>
              <p className="font-semibold text-gray-700">Requested At</p>
              <p>
                {new Date(existingRequest.requestedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            {/* LinkedIn */}
            {existingRequest.linkedin && (
              <div>
                <p className="font-semibold text-gray-700">LinkedIn</p>
                <a
                  href={existingRequest.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}

            {/* Portfolio / Resume */}
            {existingRequest.portfolio && (
              <div>
                <p className="font-semibold text-gray-700">
                  Portfolio / Resume
                </p>
                <a
                  href={existingRequest.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="mt-6">
            <p className="font-semibold text-gray-700 mb-1">Key Skills</p>
            <p className="whitespace-pre-wrap">{existingRequest.skills}</p>
          </div>

          {/* Motivation */}
          <div className="mt-4">
            <p className="font-semibold text-gray-700 mb-1">Motivation</p>
            <p className="whitespace-pre-wrap">{existingRequest.motivation}</p>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => handleCancelRequest(existingRequest?._id)}
              className="bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold rounded-md py-3 px-8 cursor-pointer"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex justify-center items-center py-5 px-4">
      {/* Employer Application Form */}
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl text-black">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
          Mentor Application Form
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("fullName", { required: true })}
              className="w-full border rounded-md p-3"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">Full name is required</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email", { required: true })}
              className="w-full border rounded-md p-3"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          {/* Expertise & Skills */}
          <div>
            <label className="block font-semibold mb-1">
              Your Area(s) of Expertise
            </label>
            <input
              type="text"
              placeholder="e.g., Frontend Development, UI/UX, Project Management"
              {...register("expertise", { required: true })}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block font-semibold mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g., 5"
              {...register("experienceYears", { required: true })}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Key Skills */}
          <div>
            <label className="block font-semibold mb-1">Key Skills</label>
            <textarea
              rows="3"
              placeholder="List skills relevant to mentoring"
              {...register("skills", { required: true })}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block font-semibold mb-1">
              Weekly Availability (in hours)
            </label>
            <input
              type="number"
              min="1"
              {...register("availability", { required: true })}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Socials & Resume */}
          <div>
            <label className="block font-semibold mb-1">
              LinkedIn Profile (optional)
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              {...register("linkedin")}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Portfolio Links */}
          <div>
            <label className="block font-semibold mb-1">
              Portfolio or Resume Link (optional)
            </label>
            <input
              type="url"
              placeholder="https://your-portfolio.com/resume.pdf"
              {...register("portfolio")}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Motivation */}
          <div>
            <label className="block font-semibold mb-1">
              Why do you want to be a mentor?
            </label>
            <textarea
              rows="4"
              placeholder="Share your motivation, goals, and how you can help Mentees."
              {...register("motivation", { required: true })}
              className="w-full border rounded-md p-3"
            />
          </div>

          {/* Agreement */}
          <div className="form-control">
            <label className="label cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register("agreement", { required: true })}
                className="checkbox checkbox-primary mt-1"
              />
              <span className="label-text text-sm text-gray-700">
                I confirm that the information provided is accurate and I agree
                to abide by the platform&apos;s mentor guidelines.
              </span>
            </label>

            {errors.agreement && (
              <label className="label">
                <span className="label-text-alt text-error text-sm">
                  You must agree before submitting
                </span>
              </label>
            )}
          </div>

          {/* Submit */}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md font-semibold transition cursor-pointer ${
                isSubmitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Mentor Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeMentor;
