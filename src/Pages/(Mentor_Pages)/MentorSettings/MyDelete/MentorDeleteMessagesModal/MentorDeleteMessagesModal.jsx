import { useState } from "react";

// Icons
import { ImCross } from "react-icons/im";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Packages
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../../../Shared/Error/Error";
import Loading from "../../../../../Shared/Loading/Loading";

const MentorDeleteMessagesModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // React Hook Form
  const { register: registerVerify, handleSubmit: handleSubmitVerify } =
    useForm();

  // ---------- Fetch Mentor Profile Data API ----------
  const {
    data: MentorData,
    isLoading: MentorIsLoading,
    error: MentorError,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Mentor Messages Data API ----------
  const {
    data: MentorMessagesData,
    isLoading: MentorMessagesIsLoading,
    error: MentorMessagesError,
  } = useQuery({
    queryKey: ["MentorMessagesData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/MentorMessages?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Mentor Email Data API ----------
  const {
    data: MentorEmailsData,
    isLoading: MentorEmailsIsLoading,
    error: MentorEmailsError,
  } = useQuery({
    queryKey: ["MentorEmailsData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/MentorEmails?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Mentor Notifications Data API ----------
  const {
    data: MentorNotificationsData,
    isLoading: MentorNotificationsIsLoading,
    error: MentorNotificationsError,
  } = useQuery({
    queryKey: ["MentorNotificationsData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Notifications?mentorId=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // Step 1: Verify password
  const onVerifyPassword = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
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
      setSuccessMessage("Password verified! You can now download your data.");
    } catch (error) {
      console.error("Reauth error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorMessage("The current password you entered is incorrect.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage(
          "Too many failed attempts. Please try again later or reset your password."
        );
      } else {
        setErrorMessage(error.message || "Failed to verify password.");
      }
    }

    setLoading(false);
  };

  // Close modal
  const handleClose = () => {
    setServerError("");
    document.getElementById("Mentor_Delete_Messages_Modal")?.close();
  };

  // Loading states
  if (
    MentorIsLoading ||
    MentorEmailsIsLoading ||
    MentorMessagesIsLoading ||
    MentorNotificationsIsLoading
  )
    return (
      <div
        id="Settings_Change_Password_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (
    MentorError ||
    MentorEmailsError ||
    MentorMessagesError ||
    MentorNotificationsError
  )
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

  // Step 2: Delete mentor data
  const DeleteMentorDataHandler = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Collect all IDs from fetched data
      const MentorMessageIds = MentorMessagesData?.map((msg) => msg?._id) || [];
      const MentorEmailIds = MentorEmailsData?.map((email) => email?._id) || [];
      const MentorNotificationIds =
        MentorNotificationsData?.map((notification) => notification?._id) || [];

      if (
        MentorMessageIds.length === 0 &&
        MentorEmailIds.length === 0 &&
        MentorNotificationIds.length === 0
      ) {
        setErrorMessage("No messages, emails, or notifications to delete.");
        Swal.fire({
          icon: "info",
          title: "Nothing to Delete",
          text: "No messages, emails, or notifications found.",
        });
        return;
      }

      // Initialize result messages
      let messagesMsg = "No mentor messages deleted.";
      let emailsMsg = "No mentor emails deleted.";
      let notificationsMsg = "No mentor notifications deleted.";

      // ---------- Delete Mentor Messages ----------
      if (MentorMessageIds.length > 0) {
        try {
          const { data } = await axiosPublic.delete(
            "/MentorMessages/BulkDelete",
            {
              data: { ids: MentorMessageIds },
            }
          );
          messagesMsg = `Deleted ${data.deletedCount} message(s).`;
        } catch (err) {
          console.error("Mentor messages delete error:", err);
          messagesMsg = "Failed to delete mentor messages.";
        }
      }

      // ---------- Delete Mentor Emails ----------
      if (MentorEmailIds.length > 0) {
        try {
          const { data } = await axiosPublic.delete(
            "/MentorEmails/BulkDelete",
            {
              data: { ids: MentorEmailIds },
            }
          );
          emailsMsg = `Deleted ${data.deletedCount} email(s).`;
        } catch (err) {
          console.error("Mentor emails delete error:", err);
          emailsMsg = "Failed to delete mentor emails.";
        }
      }

      // ---------- Delete Mentor Notifications ----------
      if (MentorNotificationIds.length > 0) {
        try {
          const { data } = await axiosPublic.delete(
            "/Notifications/BulkDelete",
            { data: { ids: MentorNotificationIds } }
          );
          notificationsMsg = `Deleted ${data.deletedCount} notification(s).`;
        } catch (err) {
          console.error("Mentor notifications delete error:", err);
          notificationsMsg = "Failed to delete mentor notifications.";
        }
      }

      // ---------- Show Summary ----------
      Swal.fire({
        icon: "success",
        title: "Deletion Complete",
        html: `
        <p><strong>Messages:</strong> ${messagesMsg}</p>
        <p><strong>Emails:</strong> ${emailsMsg}</p>
        <p><strong>Notifications:</strong> ${notificationsMsg}</p>
      `,
        confirmButtonText: "OK",
      });

      handleClose();
    } catch (error) {
      console.error("Bulk delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: error.message || "An error occurred while deleting data.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="Mentor_Delete_Messages_Modal"
      className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">Delete Messages</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Server Error */}
      {serverError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {serverError}
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Error */}
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

          {/* Step 1: Verify Password */}
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
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter Current Password"
                    {...registerVerify("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 pr-10"
                  />
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

          {/* Step 2: Delete Courses */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-xl shadow-md space-y-4">
                <h4 className="text-lg font-bold mb-2">Mentor Summary</h4>

                <div className="flex flex-col sm:flex-row sm:gap-10 gap-4">
                  {/* Messages Count */}
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-md">
                      💬
                    </span>
                    <p>
                      <span className="font-semibold">
                        {MentorMessagesData?.length || 0}
                      </span>{" "}
                      Message{MentorMessagesData?.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Emails Count */}
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-md">
                      📧
                    </span>
                    <p>
                      <span className="font-semibold">
                        {MentorEmailsData?.length || 0}
                      </span>{" "}
                      Email{MentorEmailsData?.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Notifications Count */}
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-600 rounded-full p-3 shadow-md">
                      🔔
                    </span>
                    <p>
                      <span className="font-semibold">
                        {MentorNotificationsData?.length || 0}
                      </span>{" "}
                      Notification
                      {MentorNotificationsData?.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={DeleteMentorDataHandler}
                disabled={loading}
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Deleting..." : "Delete Courses & Applications"}
              </button>

              {/* Warning */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg text-red-700 text-sm shadow-sm">
                ⚠️ <span className="font-semibold">Warning:</span> This action
                will permanently remove all courses, applications, and related
                data. This cannot be undone.
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

export default MentorDeleteMessagesModal;
