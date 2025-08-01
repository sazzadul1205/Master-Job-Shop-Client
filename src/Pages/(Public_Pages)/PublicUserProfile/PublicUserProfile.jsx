import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Components
import PublicUserProfileHeader from "./PublicUserProfileHeader/PublicUserProfileHeader";
import PublicUserProfileSkills from "./PublicUserProfileSkills/PublicUserProfileSkills";
import PublicUserProfileDocuments from "./PublicUserProfileDocuments/PublicUserProfileDocuments";
import PublicUserProfilePreferences from "./PublicUserProfilePreferences/PublicUserProfilePreferences";
import PublicUserProfilePersonalInformation from "./PublicUserProfilePersonalInformation/PublicUserProfilePersonalInformation";

const PublicUserProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // Decode the email from base64
  const decodedEmail = atob(email || "");

  // Fetch user by decoded email
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicUser", decodedEmail],
    queryFn: () =>
      axiosPublic.get(`/Users?email=${decodedEmail}`).then((res) => res.data),
    enabled: !!decodedEmail,
  });

  // Modal should only show if profile is not public
  const showModal = user ? !user.isProfilePublic : false;

  // UI Error / Loading State
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="bg-white py-3 min-h-screen">
      <div className="max-w-7xl mx-auto rounded-xl shadow-sm border p-6">
        {/* Public User Header */}
        <PublicUserProfileHeader user={user} />

        <div className="bg-gray-200 py-[1px] my-10" />

        {/* Public User Personal Information */}
        <PublicUserProfilePersonalInformation user={user} />

        <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

        {/* Public User Profile Documents */}
        <PublicUserProfileDocuments user={user} />

        <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

        {/* Public User Skills */}
        <PublicUserProfileSkills user={user} />

        <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

        {/* Public User Preferences */}
        <PublicUserProfilePreferences user={user} />
      </div>

      {/* Conditional Modal */}
      {showModal && (
        <dialog id="User_Profile_Private_Message_Modal" className="modal" open>
          <div className="modal-box bg-white text-black shadow-xl max-w-md w-full p-8 rounded-xl border border-gray-200 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 19c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-xl text-gray-800 mb-2">
              Profile Not Public
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              This user has not made their profile available for public viewing.
              Please check back later or contact the user directly if
              appropriate.
            </p>

            {/* Close Button */}
            <div className="modal-action justify-center">
              <form method="dialog">
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center gap-2 font-semibold text-white py-2 px-10 cursor-pointer transition-colors duration-200 group"
                >
                  <FaArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
                  Go Back
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PublicUserProfile;
