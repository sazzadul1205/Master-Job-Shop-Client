import { useState } from "react";

// Icon
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

const MentorDeleteMentorshipModal = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // States Variables
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Additional loading states
  const [loading, setLoading] = useState(false);

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

  // ---------- Fetch My Mentorship Data API ----------
  const {
    data: MyMentorshipData,
    isLoading: MyMentorshipIsLoading,
    error: MyMentorshipError,
  } = useQuery({
    queryKey: ["MyMentorshipData"],
    queryFn: () =>
      axiosPublic.get(`/Mentorship?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        // Ensure the result is always an array
        return Array.isArray(data) ? data : [data];
      }),
  });

  // Map Through Ids of Mentorship
  const allMentorshipIds = MyMentorshipData?.map((item) => item._id);

  // ---------- Fetch My Mentorship Applications Data API ----------
  const {
    data: MyMentorshipApplicationsData,
    isLoading: MyMentorshipApplicationsIsLoading,
    error: MyMentorshipApplicationsError,
  } = useQuery({
    queryKey: ["MyMentorshipApplications", allMentorshipIds],
    queryFn: () =>
      axiosPublic
        .get(
          `/MentorshipApplications/ByMentorship?mentorshipId=${allMentorshipIds}`
        )
        .then((res) => {
          const data = res.data;
          return data;
        }),
    enabled: !!allMentorshipIds,
  });

  // Assuming My Mentorship Applications Data contains the API response
  const allApplicantIds = MyMentorshipApplicationsData
    ? Object.values(MyMentorshipApplicationsData)
        .flat()
        .map((applicant) => applicant._id)
    : [];

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
    document.getElementById("Mentor_Delete_Mentorship_Modal")?.close();
  };

  // Loading states
  if (
    MentorIsLoading ||
    MyMentorshipIsLoading ||
    MyMentorshipApplicationsIsLoading
  )
    return (
      <div
        id="Mentor_Delete_Mentorship_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (MentorError || MyMentorshipError || MyMentorshipApplicationsError)
    return (
      <div
        id="Mentor_Delete_Mentorship_Modal"
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

  // Delete Mentorship And Applications Handler
  const DeleteMentorshipHandler = async () => {
    // Reset states
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Check if there are any Mentorship
      if (!allMentorshipIds || allMentorshipIds.length === 0) {
        setErrorMessage("No Mentorship available to delete.");
        return;
      }

      // Initialize messages
      let applicationsMessage = "No Mentorship Applications to delete.";
      let mentorshipMessage = "No Mentorship's to delete.";

      // Delete Mentorship Applications first
      if (allApplicantIds?.length > 0) {
        try {
          const { data } = await axiosPublic.delete(
            "/MentorshipApplications/BulkDelete",
            { data: { ids: allApplicantIds } }
          );
          applicationsMessage = `Deleted ${data.deletedCount} application(s).`;
        } catch (err) {
          console.error("Applications delete error:", err);
          setErrorMessage("Failed to delete applications.");
          applicationsMessage = "Failed to delete applications.";
        }
      }

      // Delete Mentorship
      if (allMentorshipIds?.length > 0) {
        try {
          const { data } = await axiosPublic.delete("/Mentorship/BulkDelete", {
            data: { ids: allMentorshipIds },
          });
          mentorshipMessage = `Deleted ${data.deletedCount} Mentorship(s).`;
        } catch (err) {
          console.error("Mentorship's delete error:", err);
          setErrorMessage("Failed to delete mentorship's.");
          mentorshipMessage = "Failed to delete Mentorship.";
        }
      }

      // Show success modal
      Swal.fire({
        icon: "success",
        title: "Deleted Successfully!",
        html: `
        <p><strong>Mentorship's:</strong> ${mentorshipMessage}</p>
        <p><strong>Applications:</strong> ${applicationsMessage}</p>
      `,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });

      // Close modal
      handleClose();
    } catch (error) {
      // Show error
      console.error("Delete error:", error);
      setErrorMessage("Failed to delete. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to delete. ${error.message}`,
      });
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  return (
    <div
      id="Mentor_Delete_Mentorship_Modal"
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
      <h3 className="font-bold text-xl text-center mb-4">Delete Mentorship</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Server Error Message */}
      {serverError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-red-500 font-semibold mb-3 text-center">
            {serverError}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Alerts */}

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

          {/* Step 2: Delete JSON */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md">
                {/* Title */}
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  Deletion Summary
                </h4>

                {/* Counts */}
                <div className="flex flex-col sm:flex-row sm:gap-10 gap-4">
                  {/* Mentorship Counts */}
                  <div className="flex items-center gap-3">
                    {/* Icons */}
                    <span className="bg-red-100 text-red-600 rounded-full p-3 shadow-md">
                      📝
                    </span>

                    {/* Count */}
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        {allMentorshipIds?.length || 0}
                      </span>{" "}
                      Mentorship{allMentorshipIds?.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Application Counts */}
                  <div className="flex items-center gap-3">
                    {/* Icons */}
                    <span className="bg-red-100 text-red-600 rounded-full p-3 shadow-md">
                      👥
                    </span>

                    {/* Count */}
                    <p className="text-gray-700">
                      <span className="font-semibold">
                        {allApplicantIds?.length || 0}
                      </span>{" "}
                      Application{allApplicantIds?.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={DeleteMentorshipHandler}
                disabled={loading}
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Deleting..." : "Delete Mentorship & Applications"}
              </button>

              {/* Warning */}
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg text-red-700 text-sm shadow-sm">
                ⚠️ <span className="font-semibold">Warning:</span> This action
                will permanently remove all mentorship sessions, mentor &
                mentees history, attached files, notes, analytics, and feedback.
                This cannot be undone.
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

export default MentorDeleteMentorshipModal;
