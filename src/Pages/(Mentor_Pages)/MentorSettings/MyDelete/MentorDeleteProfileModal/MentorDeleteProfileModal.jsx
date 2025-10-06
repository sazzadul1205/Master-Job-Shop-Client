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

const MentorDeleteProfileModal = () => {
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
      axiosPublic.get(`/Mentors?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Check Mentorship Data API ----------
  const {
    data: CheckMentorshipData,
    isLoading: CheckMentorshipIsLoading,
    error: CheckMentorshipError,
  } = useQuery({
    queryKey: ["CheckMentorshipData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Mentorship/CheckMentor?mentorEmail=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Check Courses Data API ----------
  const {
    data: CheckCoursesData,
    isLoading: CheckCoursesIsLoading,
    error: CheckCoursesError,
  } = useQuery({
    queryKey: ["CheckCoursesData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Courses/CheckMentor?mentorEmail=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Check Mentor Emails Data API ----------
  const {
    data: CheckMentorEmailsData,
    isLoading: CheckMentorEmailsIsLoading,
    error: CheckMentorEmailsError,
  } = useQuery({
    queryKey: ["CheckMentorEmailsData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/MentorEmails/CheckMentor?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Check Mentor Messages Data API ----------
  const {
    data: CheckMentorMessagesData,
    isLoading: CheckMentorMessagesIsLoading,
    error: CheckMentorMessagesError,
  } = useQuery({
    queryKey: ["CheckMentorMessagesData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/MentorMessages/CheckMentor?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email,
  });

  // ---------- Fetch Check Mentor Notifications Data API ----------
  const {
    data: CheckMentorNotificationsData,
    isLoading: CheckMentorNotificationsIsLoading,
    error: CheckMentorNotificationsError,
  } = useQuery({
    queryKey: ["CheckMentorNotificationsData", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/Notifications/CheckMentor?mentorId=${user?.email}`)
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
    CheckCoursesIsLoading ||
    CheckMentorshipIsLoading ||
    CheckMentorEmailsIsLoading ||
    CheckMentorMessagesIsLoading ||
    CheckMentorNotificationsIsLoading
  )
    return <Loading />;

  // Error states
  if (
    MentorError ||
    CheckCoursesError ||
    CheckMentorshipError ||
    CheckMentorEmailsError ||
    CheckMentorMessagesError ||
    CheckMentorNotificationsError
  )
    return <Error />;

  console.log("Check Courses Data :", CheckCoursesData);
  console.log("Check Mentorship Data :", CheckMentorshipData);
  console.log("Check Mentor Emails Data:", CheckMentorEmailsData);
  console.log("Check Mentor Messages Data:", CheckMentorMessagesData);
  console.log("Check Mentor Notifications Data:", CheckMentorNotificationsData);

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
      <h3 className="font-bold text-xl text-center mb-4">Delete Profile</h3>

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
        </div>

        {/* Right: Mentor Info */}
        <div className="flex flex-col items-center justify-start border-l pl-6 text-center">
          <img
            src={
              MentorData?.avatar ||
              user?.photoURL ||
              "https://via.placeholder.com/120"
            }
            alt="Mentor Avatar"
            className="w-28 h-28 rounded-full shadow-md mb-4 object-cover"
          />
          <h4 className="text-lg font-semibold">
            {MentorData?.name || user?.displayName || "No Name"}
          </h4>
          <p className="text-sm text-gray-500 mb-1">
            {MentorData?.position || "Mentor"}
          </p>
          <p className="text-gray-600 text-sm">
            {MentorData?.email || user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorDeleteProfileModal;
