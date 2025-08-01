import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// Icons
import { FaArrowLeft } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

// Shared
import Loading from "../../Shared/Loading/Loading";
import Error from "../../Shared/Error/Error";

const BecomeEmployer = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Navigation Hook
  const navigate = useNavigate();

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

  // On Submit Handler
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
    const existingRequest = EmployerData[0];

    return (
      <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex justify-center items-center py-5 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute rounded left-4 top-4 px-8 py-2 font-semibold flex items-center bg-white hover:bg-blue-50 gap-2 text-black transition cursor-pointer "
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Employer Application Summary */}
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl text-black space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
              Employer Application Summary
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

          {/* Grid Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* Contact Now */}
            <div>
              <p className="font-semibold text-gray-700">Contact Name</p>
              <p>{existingRequest?.contactName}</p>
            </div>

            {/* Email */}
            <div>
              <p className="font-semibold text-gray-700">Contact Email</p>
              <p>{existingRequest?.contactEmail}</p>
            </div>

            {/* Employer Type */}
            <div>
              <p className="font-semibold text-gray-700">Employer Type</p>
              <p>{existingRequest?.employerType}</p>
            </div>

            {/* Company Details */}
            {existingRequest?.employerType === "Company" && (
              <>
                {/* Company Name */}
                <div>
                  <p className="font-semibold text-gray-700">Company Name</p>
                  <p>{existingRequest?.companyName}</p>
                </div>

                {/* Company Industry */}
                <div>
                  <p className="font-semibold text-gray-700">Industry</p>
                  <p>{existingRequest?.industry}</p>
                </div>

                {/* Company Size */}
                <div>
                  <p className="font-semibold text-gray-700">Company Size</p>
                  <p>{existingRequest?.companySize}</p>
                </div>

                {/* Business Reg. Numbers */}
                <div>
                  <p className="font-semibold text-gray-700">
                    Business Reg. Number
                  </p>
                  <p>{existingRequest?.registrationNumber}</p>
                </div>
              </>
            )}

            {/* Description */}
            <div className="md:col-span-2">
              <p className="font-semibold text-gray-700">Description</p>
              <p className="whitespace-pre-wrap">
                {existingRequest?.description}
              </p>
            </div>

            {/* Roles */}
            <div className="md:col-span-2">
              <p className="font-semibold text-gray-700">Hiring Roles</p>
              <p className="whitespace-pre-wrap">
                {existingRequest?.hiringRoles}
              </p>
            </div>

            {/* Request Date */}
            <div>
              <p className="font-semibold text-gray-700">Requested At</p>
              <p>
                {new Date(existingRequest?.requestedAt).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }
                )}
              </p>
            </div>
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
    <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex justify-center items-center py-5 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute rounded left-4 top-4 px-8 py-2 font-semibold flex items-center bg-white hover:bg-blue-50 gap-2 text-black transition cursor-pointer "
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

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
