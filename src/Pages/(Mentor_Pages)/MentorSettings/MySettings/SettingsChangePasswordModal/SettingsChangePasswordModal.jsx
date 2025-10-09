import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Firebase
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../../../Shared/Loading/Loading";
import Error from "../../../../../Shared/Error/Error";

const SettingsChangePasswordModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // ---------- Fetch Mentor Profile Data API ----------
  const {
    data: MentorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Form 1: Verify current password
  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    reset: resetVerify,
  } = useForm();

  // Form 2: New password
  const {
    register: registerNew,
    handleSubmit: handleSubmitNew,
    reset: resetNew,
    watch,
  } = useForm();

  // Watch new password for confirm password validation
  const newPassword = watch("newPassword");

  // Close modal and reset states
  const handleClose = () => {
    document.getElementById("Settings_Change_Password_Modal")?.close();
    setStep(1);
    setErrorMessage("");
    setSuccessMessage("");
    resetVerify();
    resetNew();
  };

  // Step 1: Verify password
  const onVerifyPassword = async (data) => {
    setErrorMessage("");
    setLoading(true);

    // Reauthenticate with current password
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
      setOldPassword(data.currentPassword);
      setStep(2);

      // Clear current password field
    } catch (error) {
      console.error("Reauth error:", error);

      // Handle specific Firebase auth errors
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        // Incorrect password
        setErrorMessage("The current password you entered is incorrect.");
      } else if (error.code === "auth/too-many-requests") {
        // Too many failed attempts
        setErrorMessage(
          "Too many failed attempts. Please try again later or reset your password."
        );
      } else if (error.code === "auth/user-mismatch") {
        // Optionally, you could trigger a password reset email here
        setErrorMessage("This credential does not match the current user.");
      } else if (error.code === "auth/user-not-found") {
        // Optionally, you could trigger a password reset email here
        setErrorMessage("No user found with this email. Please re-login.");
      } else {
        // Generic error message
        setErrorMessage(error.message || "Failed to verify password.");
      }
    }

    // End loading state
    setLoading(false);
  };

  // Step 2: Change password
  const onChangePassword = async (data) => {
    // Clear error and success messages
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validate new password and confirm password match
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    // Prevent reusing the old password
    if (data.newPassword === oldPassword) {
      setErrorMessage("New password cannot be the same as the old password.");
      setLoading(false);
      return;
    }

    // Update password in Firebase
    try {
      if (!user) throw new Error("User not authenticated.");
      await updatePassword(user, data.newPassword);
      setSuccessMessage("Password updated successfully!");
      setStep(1);
      resetNew();
      resetVerify();

      // Show temporary success Swal message
      Swal.fire({
        icon: "success",
        title: "Password Updated!",
        text: "Your password has been updated successfully.",
        timer: 2000, // auto close after 2 seconds
        showConfirmButton: false,
      });

      // Close modal after a short delay to show success message
      handleClose();
    } catch (error) {
      setErrorMessage(error.message || "Failed to update password.");
    }

    // End loading state
    setLoading(false);
  };

  // Loading states
  if (isLoading)
    return (
      <div
        id="Settings_Change_Password_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (error)
    return (
      <div
        id="Settings_Change_Password_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => handleClose()}
          className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
        >
          <ImCross className="text-xl" />
        </button>

        {/* Error Component inside modal */}

        <Error height="min-h-[60vh]" />
      </div>
    );

  // If No MentorData Data
  if (
    !isLoading &&
    (!MentorData || (Array.isArray(MentorData) && MentorData.length === 0))
  ) {
    return (
      <div
        id="Settings_Change_Password_Modal"
        className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        >
          <ImCross className="text-xl text-black hover:text-red-500" />
        </button>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center text-center py-16">
          {/* Icon */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6 shadow-sm">
            <ImCross className="text-4xl text-gray-400" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Data Found
          </h3>

          {/* Subtitle */}
          <p className="text-gray-500 max-w-sm">
            We couldn’t find any User Change Password to display right now.
            Please check back later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="Settings_Change_Password_Modal"
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
      <h3 className="font-bold text-xl text-center mb-4">
        {step === 1 ? "Verify Current Password" : "Set New Password"}
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Alerts */}
          {errorMessage && (
            <div className="bg-red-100 text-red-800 border border-red-400 px-4 py-2 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded mb-4 text-center">
              {successMessage}
            </div>
          )}

          {/* Step 1: Verify */}
          {step === 1 && (
            <form
              onSubmit={handleSubmitVerify(onVerifyPassword)}
              className="space-y-4 items-center relative"
            >
              {/* Current Password */}
              <div>
                {/* Label */}
                <label className="text-gray-600 font-semibold">
                  Current Password
                </label>

                {/* Input */}
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

                  {/* Toggle visibility */}
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

              {/* Verify Button */}
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

          {/* Step 2: New Password */}
          {step === 2 && (
            <form
              onSubmit={handleSubmitNew(onChangePassword)}
              className="space-y-4 items-center relative"
            >
              {/* New Password */}
              <div>
                {/* Label */}
                <label className="text-gray-600 font-semibold">
                  New Password
                </label>

                {/* Input */}
                <div className="relative items-center mt-2">
                  {/* Input */}
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    {...registerNew("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                  />

                  {/* Toggle visibility */}
                  <span
                    className="absolute top-[10px] right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                {/* Label */}
                <label className="text-gray-600 font-semibold">
                  Confirm New Password
                </label>

                {/* Input */}
                <div className="relative items-center mt-2">
                  {/* Input */}
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    {...registerNew("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 pr-10 ${
                      watch("confirmPassword") &&
                      watch("confirmPassword") !== newPassword
                        ? "border-red-500"
                        : ""
                    }`}
                  />

                  {/* Toggle visibility */}
                  <span
                    className="absolute top-[10px] right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="text-xl" />
                    ) : (
                      <AiOutlineEye className="text-xl" />
                    )}
                  </span>
                </div>
              </div>

              {/* Live error message */}
              {watch("confirmPassword") &&
                watch("confirmPassword") !== newPassword && (
                  <p className="text-red-600 text-sm">Passwords do not match</p>
                )}

              {/* Update Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[200px] bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
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

export default SettingsChangePasswordModal;
