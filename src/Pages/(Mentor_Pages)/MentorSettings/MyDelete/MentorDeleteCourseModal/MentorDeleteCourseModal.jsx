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

const MentorDeleteCourseModal = () => {
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

  // ---------- Fetch My Courses Data API ----------
  const {
    data: MyCoursesData,
    isLoading: MyCoursesIsLoading,
    error: MyCoursesError,
  } = useQuery({
    queryKey: ["MyCoursesData"],
    queryFn: () =>
      axiosPublic.get(`/Courses?mentorEmail=${user?.email}`).then((res) => {
        const data = res.data;
        return Array.isArray(data) ? data : [data];
      }),
  });

  // Map Through Ids of My Courses Data
  const allCourseIds = MyCoursesData?.map((course) => course._id);

  // ---------- Fetch Course Applications Data API ----------
  const {
    data: CourseApplicationsData,
    isLoading: CourseApplicationsIsLoading,
    error: CourseApplicationsError,
  } = useQuery({
    queryKey: ["CourseApplications", allCourseIds],
    queryFn: () =>
      axiosPublic
        .get(`/CourseApplications/ByCourse?courseId=${allCourseIds}`)
        .then((res) => res.data),
    enabled: !!allCourseIds,
  });

  // Assuming My Course Applications Data contains the API response
  const allApplicantIds = CourseApplicationsData
    ? Object.values(CourseApplicationsData)
        .flat()
        .map((applicant) => applicant._id)
    : [];

  // Step 1: Verify password
  const onVerifyPassword = async (data) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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
    document.getElementById("Mentor_Delete_Course_Modal")?.close();
  };

  // Loading states
  if (MentorIsLoading || MyCoursesIsLoading || CourseApplicationsIsLoading)
    return (
      <div
        id="Settings_Change_Password_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (MentorError || MyCoursesError || CourseApplicationsError)
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

  // Delete Courses & Applications Handler
  const DeleteCoursesHandler = async () => {
    // Reset states
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Check if there are any Mentorship
      if (!allCourseIds || allCourseIds.length === 0) {
        setErrorMessage("No courses available to delete.");
        return;
      }

      // Initialize messages
      let applicationsMessage = "No course applications to delete.";
      let coursesMessage = "No courses to delete.";

      // Delete Course Applications
      if (allApplicantIds?.length > 0) {
        try {
          const { data } = await axiosPublic.delete(
            "/CourseApplications/BulkDelete",
            { data: { ids: allApplicantIds } }
          );
          applicationsMessage = `Deleted ${data.deletedCount} application(s).`;
        } catch (err) {
          console.error("Applications delete error:", err);
          applicationsMessage = "Failed to delete applications.";
        }
      }

      // Delete Courses
      if (allCourseIds?.length > 0) {
        try {
          const { data } = await axiosPublic.delete("/Courses/BulkDelete", {
            data: { ids: allCourseIds },
          });
          coursesMessage = `Deleted ${data.deletedCount} course(s).`;
        } catch (err) {
          console.error("Courses delete error:", err);
          coursesMessage = "Failed to delete courses.";
        }
      }

      // Show success modal
      Swal.fire({
        icon: "success",
        title: "Deleted Successfully!",
        html: `
          <p><strong>Courses:</strong> ${coursesMessage}</p>
          <p><strong>Applications:</strong> ${applicationsMessage}</p>
        `,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });

      // Close Modal
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
      id="Mentor_Delete_Course_Modal"
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
      <h3 className="font-bold text-xl text-center mb-4">Delete Courses</h3>

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
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md">
                {/* Title */}
                <h4 className="text-lg font-bold mb-2">Deletion Summary</h4>

                {/* Count */}
                <div className="flex flex-col sm:flex-row sm:gap-10 gap-4">
                  {/* Course Counts */}
                  <div className="flex items-center gap-3">
                    {/* Icons */}
                    <span className="bg-red-100 text-red-600 rounded-full p-3 shadow-md">
                      📚
                    </span>

                    {/* Counts */}
                    <p>
                      <span className="font-semibold">
                        {allCourseIds?.length || 0}
                      </span>{" "}
                      Course{allCourseIds?.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Applicant Counts */}
                  <div className="flex items-center gap-3">
                    {/* ICons */}
                    <span className="bg-red-100 text-red-600 rounded-full p-3 shadow-md">
                      👥
                    </span>

                    {/* Counts */}
                    <p>
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
                onClick={DeleteCoursesHandler}
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

export default MentorDeleteCourseModal;
