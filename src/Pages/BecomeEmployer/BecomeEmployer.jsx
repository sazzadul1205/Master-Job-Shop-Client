import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
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
      const payload = {
        ...data,
        employerType: type,
        requestedAt: new Date(),
        status: "pending",
        userId: UserData?._id,
        userEmail: user?.email,
      };

      const res = await axiosPublic.post("/EmployerRequest", payload);
      //   console.log(payload);

      if (res.status === 200) {
        Swal.fire({
          title: "Submitted",
          text: "Your employer application has been received.",
          icon: "success",
        });
        reset();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex justify-center items-center py-5 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-4xl text-black">
        <h2 className="text-3xl font-bold text-blue-800 mb-1">
          Become an Employer
        </h2>
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
          {/* Shared Fields */}
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
