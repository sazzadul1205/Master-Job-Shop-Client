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

const BecomeEmployer = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State for employer type and form visibility
  const [type, setType] = useState("Company");
  const [showCompanyFields, setShowCompanyFields] = useState(true);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  // Fetch Employer Data
  const {
    data: EmployerData,
    isLoading: EmployerIsLoading,
    error: EmployerError,
    refetch: refetchEmployer,
  } = useQuery({
    queryKey: ["EmployerRequestData"],
    queryFn: () =>
      axiosPublic
        .get(`/EmployerRequest?userEmail=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // UI Error / Loading State
  if (loading || EmployerIsLoading || UserIsLoading) return <Loading />;
  if (EmployerError || UserError) return <Error />;

  const onSubmit = async (data) => {
    const confirm = await Swal.fire({
      title: "Submit Employer Application?",
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
        employerType: type,
        requestedAt: new Date(),
        status: "pending",
        userId: UserData?._id,
        userEmail: user?.email,
      };

      // POST request to submit the Payload
      const res = await axiosPublic.post("/EmployerRequest", payload);

      if (res.status === 200) {
        // Show success message
        Swal.fire({
          title: "Submitted",
          text: "Your employer application has been received.",
          icon: "success",
        });

        // Reset state and refetch data
        reset();
        refetchUser();
        refetchEmployer();
        setShowCompanyFields(true);
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
      title: "Cancel Employer Application?",
      text: "Are you sure you want to cancel your employer application? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel it",
      cancelButtonText: "No, Keep it",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosPublic.delete(`/EmployerRequest/${_id}`);

      Swal.fire({
        title: "Cancelled",
        text: "Your employer application has been cancelled.",
        icon: "success",
      });

      // Reset state and refetch data
      refetchUser();
      refetchEmployer();
      setShowCompanyFields(false);

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

  // If there is existing employer data, show the summary box
  if (EmployerData && EmployerData.length > 0) {
    // You can tweak how many requests you want to show or just show the first one
    const existingRequest = EmployerData[0];

    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex justify-center items-center px-4">
        {/* Employer Application Status */}
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl text-black">
          {/* Title */}
          <h2 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">
            Employer Application Status
          </h2>

          {/* Sub Title */}
          <p className="mb-8 text-center text-gray-700 text-lg">
            You already have an employer application submitted. You don&apos;t
            need to apply again.
          </p>

          {/* Request Details */}
          <div className="space-y-5 mb-10">
            {/* Full Name */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Full Name:</span>
              <span>{existingRequest?.contactName}</span>
            </div>

            {/* Email Address */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Email:</span>
              <span>{existingRequest?.contactEmail}</span>
            </div>

            {/* Company Details */}
            {existingRequest?.employerType === "Company" && (
              <>
                {/* Company Name */}
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold">Company Name:</span>
                  <span>{existingRequest?.companyName}</span>
                </div>

                {/* Industry */}
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold">Industry:</span>
                  <span>{existingRequest?.industry}</span>
                </div>

                {/* Company Size */}
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold">Company Size:</span>
                  <span>{existingRequest?.companySize}</span>
                </div>

                {/* Business Reg. Number */}
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-semibold">Business Reg. Number:</span>
                  <span>{existingRequest?.registrationNumber}</span>
                </div>
              </>
            )}

            {/* Description */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Description:</span>
              <span className="max-w-[60%] text-right">
                {existingRequest?.description}
              </span>
            </div>

            {/* Hiring Roles */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Hiring Roles:</span>
              <span className="max-w-[60%] text-right">
                {existingRequest?.hiringRoles}
              </span>
            </div>

            {/* Employer type */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Employer Type:</span>
              <span>{existingRequest?.employerType}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Status:</span>
              <span className="capitalize">{existingRequest?.status}</span>
            </div>

            {/* Requested At */}
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <strong>Requested At:</strong>{" "}
              {new Date(existingRequest?.requestedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          </div>

          {/* Cancel Request Button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleCancelRequest(existingRequest?._id)}
              className="mt-auto bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold rounded-md py-3 px-10 cursor-pointer"
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
        <h2 className="text-3xl font-bold text-blue-800 mb-1">
          Become an Employer
        </h2>

        {/* Sub Title */}
        <p className="text-gray-600 mb-4">
          Choose your type and fill out the application below.
        </p>

        {/* Tabs */}
        <div className="flex mb-8 border-b">
          {["Company", "Individual"].map((option) => (
            <button
              key={option}
              className={`px-6 py-2 font-semibold transition border-b-2 cursor-pointer ${
                type === option
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => {
                setType(option);
                setShowCompanyFields(option === "Company");
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Full Name */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Full Name *</label>
            <input
              type="text"
              {...register("contactName", { required: "Required" })}
              className="w-full border rounded-md p-3"
              placeholder="Your full name"
            />
            {errors.contactName && (
              <p className="text-red-500 text-sm">
                {errors.contactName.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Email Address *</label>
            <input
              type="email"
              {...register("contactEmail", { required: "Required" })}
              className="w-full border rounded-md p-3"
              placeholder="you@example.com"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm">
                {errors.contactEmail.message}
              </p>
            )}
          </div>

          {/* Smooth Transition Company Fields */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2 ${
              showCompanyFields
                ? "opacity-100 max-h-[2000px] visible"
                : "opacity-0 max-h-0 invisible"
            }`}
          >
            {/* Company Name */}
            <div className="col-span-2">
              <label className="block font-medium mb-1">Company Name *</label>
              <input
                type="text"
                {...register("companyName", {
                  required: showCompanyFields && "Required",
                })}
                className="w-full border rounded-md p-3"
                placeholder="e.g. BrightCode Ltd."
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block font-medium mb-1">Industry *</label>
              <input
                type="text"
                {...register("industry", {
                  required: showCompanyFields && "Required",
                })}
                className="w-full border rounded-md p-3"
                placeholder="e.g. IT, Manufacturing"
              />
              {errors.industry && (
                <p className="text-red-500 text-sm">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Company Size */}
            <div>
              <label className="block font-medium mb-1">Company Size *</label>
              <select
                {...register("companySize", {
                  required: showCompanyFields && "Required",
                })}
                className="w-full border rounded-md p-3"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
              {errors.companySize && (
                <p className="text-red-500 text-sm">
                  {errors.companySize.message}
                </p>
              )}
            </div>

            {/* Registration Number */}
            <div className="col-span-2">
              <label className="block font-medium mb-1">
                Business Reg. Number *
              </label>
              <input
                type="text"
                {...register("registrationNumber", {
                  required: showCompanyFields && "Required",
                })}
                className="w-full border rounded-md p-3"
                placeholder="e.g. BRN-2025-1029"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">
              {type === "Company" ? "About Your Company" : "About You"} *
            </label>
            <textarea
              rows={4}
              {...register("description", {
                required: "Required",
                minLength: 10,
              })}
              className="w-full border rounded-md p-3"
              placeholder={
                type === "Company"
                  ? "Describe your company, goals, and what kind of talent you're looking for..."
                  : "Describe your background, goals, and who you're looking to hire..."
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Hiring Roles */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">
              Roles or Services You Want to Hire *
            </label>
            <textarea
              rows={3}
              {...register("hiringRoles", {
                required: "Required",
                minLength: 5,
              })}
              className="w-full border rounded-md p-3"
              placeholder="e.g. Frontend Developer, Content Writer"
            />
            {errors.hiringRoles && (
              <p className="text-red-500 text-sm">
                {errors.hiringRoles.message}
              </p>
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
              {isSubmitting ? "Submitting..." : "Submit Employer Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeEmployer;
