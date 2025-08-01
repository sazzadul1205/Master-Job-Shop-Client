import { useEffect, useState } from "react";

// Packages
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Components
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileSkills from "./ProfileSkills/ProfileSkills";
import ProfileDanger from "./ProfileDanger/ProfileDanger";
import ProfileSettings from "./ProfileSettings/ProfileSettings";
import ProfileDocuments from "./ProfileDocuments/ProfileDocuments";
import ProfileJobPreference from "./ProfileJobPreference/ProfileJobPreference";
import ProfilePersonalInformation from "./ProfilePersonalInformation/ProfilePersonalInformation";
import ProfileBecomeMentor from "./ProfileBecomeMentor/ProfileBecomeMentor";
import ProfileBecomeEmployer from "./ProfileBecomeEmployer/ProfileBecomeEmployer";

const UserProfile = () => {
  const { user, loading } = useAuth();

  // Axios instance for public requests
  const axiosPublic = useAxiosPublic();

  // State for reactivation reason and terms acceptance
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

  // Show modal if user is deleted
  useEffect(() => {
    if (UserData?.deleteStatus === true) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [UserData]);

  // Check if the form is valid
  const isFormValid =
    reason.trim().length > 0 && termsAccepted && !isSubmitting;

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      // Call the API to reactivate the user account
      const response = await axiosPublic.put(
        `/Users/ReActivate/${UserData?._id}`,
        {
          reinstatedReason: reason,
        }
      );

      // Show success message
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Account Reactivated",
          text:
            response.data.message ||
            "Your account has been successfully reactivated.",
          timer: 3000,
          showConfirmButton: false,
        });

        setTermsAccepted(false);
        setShowModal(false);
        setReason("");
        refetchUser();
      }
    } catch (error) {
      // Handle error
      console.error("Reactivation error:", error);
      Swal.fire({
        icon: "error",
        title: "Reactivation Failed",
        text:
          error.response?.data?.message ||
          "There was a problem reactivating your account. Please try again later.",
      });
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  // UI Error / Loading State
  if (loading || UserIsLoading) return <Loading />;
  if (UserError) return <Error />;

  return (
    <div className="bg-white py-3">
      {/* Profile Header */}
      <ProfileHeader user={UserData} refetch={refetchUser} />

      {/* Profile Personal Information */}
      <ProfilePersonalInformation user={UserData} refetch={refetchUser} />

      {/* Profile Documents */}
      <ProfileDocuments user={UserData} refetch={refetchUser} />

      {/* Profile Skills */}
      <ProfileSkills user={UserData} />

      {/* Profile Job Preference */}
      <ProfileJobPreference user={UserData} refetch={refetchUser} />

      {/* Profile Settings */}
      <ProfileSettings user={UserData} refetch={refetchUser} />

      {/* Profile Become Employer */}
      <ProfileBecomeEmployer user={UserData} refetch={refetchUser} />

      {/* Profile Become Mentor */}
      <ProfileBecomeMentor user={UserData} refetch={refetchUser} />

      {/* Profile Danger Zone */}
      <ProfileDanger user={UserData} refetch={refetchUser} />

      {/* Re-Activation Modal */}
      {showModal && (
        <dialog id="User_Profile_Reactivation_Modal" className="modal" open>
          <div className="modal-box bg-white text-black shadow-lg max-w-3xl w-full p-8 rounded-xl">
            {/* Modal Header */}
            <h3 className="font-bold text-2xl mb-4 text-center">
              Reactivate Your Account
            </h3>

            {/* Modal Content */}
            <p className="text-sm text-gray-600 mb-4">
              To proceed with account reactivation, please share a brief reason
              for your request and agree to our terms of service.
            </p>

            {/* Reactivation Reason */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="reason"
              >
                Reason for Reactivation
              </label>
              <textarea
                id="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly explain why you'd like to reactivate your account..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-2 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
                disabled={isSubmitting}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I have read and agree to the{" "}
                <a
                  href="/terms-of-service"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                disabled={!isFormValid}
                onClick={handleSubmit}
                className={`px-6 py-3 font-semibold rounded-md transition cursor-pointer ${
                  isFormValid
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Reactivate Account"}
              </button>
            </div>

            {/* Modal Footer */}
            <p className="text-xs text-gray-400 mt-6 text-center">
              Press ESC key or click outside the box to close
            </p>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default UserProfile;
