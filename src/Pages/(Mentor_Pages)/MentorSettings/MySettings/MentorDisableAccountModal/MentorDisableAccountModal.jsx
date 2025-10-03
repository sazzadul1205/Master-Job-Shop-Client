import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { ImCross } from "react-icons/im";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Packages
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

const MentorDisableAccountModal = () => {
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Hooks
  const navigate = useNavigate();

  // States
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Additional loading states
  const [loading, setLoading] = useState(false);
  const [loadingDeactivate, setLoadingDeactivate] = useState(false);

  // Custom deactivate until
  const [customDate, setCustomDate] = useState("");
  const [deactivateDuration, setDeactivateDuration] = useState("forever");

  // React Hook Form
  const { register: registerVerify, handleSubmit: handleSubmitVerify } =
    useForm();

  // ---------- Fetch Mentor Profile Data API ----------
  const {
    data: MentorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Step 1: Verify Password ----------
  const onVerifyPassword = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Ensure user and email exist
      if (!user?.email) throw new Error("User not found. Please re-login.");

      // Create credential
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );

      // Reauthenticate
      await reauthenticateWithCredential(user, credential);

      // If successful, proceed to step 2
      setStep(2);
      setSuccessMessage("Password verified! You can now manage your account.");
    } catch (error) {
      // Handle specific Firebase auth errors
      console.error("Reauth error:", error);

      // Display user-friendly messages
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        // Set error message
        setErrorMessage("The current password you entered is incorrect.");
      } else if (error.code === "auth/too-many-requests") {
        // Set error message
        setErrorMessage(
          "Too many failed attempts. Please try again later or reset your password."
        );
      } else {
        // Generic error message
        setErrorMessage(error.message || "Failed to verify password.");
      }
    }

    // Reset loading state
    setLoading(false);
  };

  // ---------- Step 2: Calculate deactivateUntil ----------
  const calculateDeactivateUntil = () => {
    // Forever
    if (deactivateDuration === "forever") {
      return new Date("9999-12-31").toISOString();
    }

    // Custom date
    if (deactivateDuration === "custom" && !customDate) {
      setErrorMessage("Please select a valid date.");
      setLoadingDeactivate(false);
      return;
    }

    // Predefined durations
    const now = new Date();
    switch (deactivateDuration) {
      case "1d":
        now.setDate(now.getDate() + 1);
        break;
      case "1w":
        now.setDate(now.getDate() + 7);
        break;
      case "1m":
        now.setMonth(now.getMonth() + 1);
        break;
      case "1y":
        now.setFullYear(now.getFullYear() + 1);
        break;
      default:
        break;
    }
    return now.toISOString();
  };

  // ---------- Step 2: Deactivate Account ----------
  const handleDeactivateAccount = async () => {
    try {
      setLoadingDeactivate(true);

      // Validate custom date
      const deactivateUntilISO = calculateDeactivateUntil();

      // Ensure custom date is in the future
      await axiosPublic.patch("/Mentors/deactivate", {
        email: user?.email,
        deactivate: true,
        deactivateUntil: deactivateUntilISO,
      });

      // Success
      setSuccessMessage("Account deactivated successfully!");
      navigate("/");
      logOut();
    } catch (error) {
      // Error
      console.error("Failed to deactivate account:", error);
      setErrorMessage("Failed to deactivate account. Please try again.");
    } finally {
      // Reset loading state
      setLoadingDeactivate(false);
    }
  };

  // ---------- Close Modal ----------
  const handleClose = () => {
    setStep(1);
    setCustomDate("");
    setErrorMessage("");
    setSuccessMessage("");
    setDeactivateDuration("forever");
    document.getElementById("Mentor_Disable_Account_Modal")?.close();
  };

  // Loading and error states
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  if (!user) return null;

  return (
    <div
      id="Mentor_Disable_Account_Modal"
      className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
    >
      {/* Close */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">Disable Account</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-2" />

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 text-red-800 border border-red-400 px-4 py-2 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded mb-4 text-center">
              {successMessage}
            </div>
          )}

          {/* Step 1: Verify Password */}
          {step === 1 && (
            <form
              onSubmit={handleSubmitVerify(onVerifyPassword)}
              className="space-y-4 items-center relative"
            >
              {/* Current Password */}
              <div>
                <label className="text-gray-600 font-semibold">
                  Current Password
                </label>

                {/* Current Password Input */}
                <div className="relative items-center mt-2">
                  {/* Input */}
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter Current Password"
                    {...registerVerify("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                  />

                  {/* Toggle Password */}
                  <span
                    className="absolute top-[10px] right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </span>
                </div>
              </div>

              {/* Verify Password Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-[200px] cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify Password"}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Manage Account */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between gap-3">
                <div className="flex gap-2 items-center justify-between w-full">
                  {/* Deactivate Duration */}
                  <select
                    value={deactivateDuration}
                    onChange={(e) => setDeactivateDuration(e.target.value)}
                    className="border rounded px-2 py-1 focus:ring focus:ring-blue-300 cursor-pointer w-full"
                  >
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                    <option value="1m">1 Month</option>
                    <option value="1y">1 Year</option>
                    <option value="custom">Custom</option>
                    <option value="forever">Forever</option>
                  </select>

                  {/* Custom Date */}
                  {deactivateDuration === "custom" && (
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  )}

                  {/* Deactivate Button */}
                  <button
                    onClick={handleDeactivateAccount}
                    disabled={loadingDeactivate}
                    className={`bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition cursor-pointer ${
                      loadingDeactivate ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {loadingDeactivate ? "Deactivating..." : "Deactivate"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Mentor Info */}
        <div className="flex flex-col items-center justify-start border-l pl-6 text-center">
          {/* Avatar */}
          <img
            src={
              MentorData?.avatar ||
              user?.photoURL ||
              "https://via.placeholder.com/120"
            }
            alt="Mentor Avatar"
            className="w-28 h-28 rounded-full shadow-md mb-4 object-cover"
          />

          {/* Name */}
          <h4 className="text-lg font-semibold">
            {MentorData?.name || user?.displayName || "No Name"}
          </h4>

          {/* Position */}
          <p className="text-sm text-gray-500 mb-1">
            {MentorData?.position || "Mentor"}
          </p>

          {/* Email */}
          <p className="text-gray-600 text-sm">
            {MentorData?.email || user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorDisableAccountModal;
