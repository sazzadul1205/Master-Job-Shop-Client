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

  // UI Error / Loading State
  if (loading || UserIsLoading) return <Loading />;
  if (UserError) return <Error />;

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
