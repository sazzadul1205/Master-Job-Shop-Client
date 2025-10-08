// Packages
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ImCross } from "react-icons/im";
import { FaArrowLeft } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Shared
import Error from "../Error/Error";
import Loading from "../Loading/Loading";

// Components
import PublicUserProfileHeader from "../../Pages/(Public_Pages)/PublicUserProfile/PublicUserProfileHeader/PublicUserProfileHeader";
import PublicUserProfileSkills from "../../Pages/(Public_Pages)/PublicUserProfile/PublicUserProfileSkills/PublicUserProfileSkills";
import PublicUserProfileDocuments from "../../Pages/(Public_Pages)/PublicUserProfile/PublicUserProfileDocuments/PublicUserProfileDocuments";
import PublicUserProfilePreferences from "../../Pages/(Public_Pages)/PublicUserProfile/PublicUserProfilePreferences/PublicUserProfilePreferences";
import PublicUserProfilePersonalInformation from "../../Pages/(Public_Pages)/PublicUserProfile/PublicUserProfilePersonalInformation/PublicUserProfilePersonalInformation";

const ApplicantInformationModal = ({
  selectedApplicantName,
  setSelectedApplicantName,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch selected Application Data
  const {
    data: ApplicantInformation = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ApplicantInformation", selectedApplicantName],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Users?id=${selectedApplicantName}`);
        // If response is empty or array is empty, return null
        return Array.isArray(res.data) ? res.data[0] || null : res.data || null;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Handle 404 by returning null
          return null;
        }
        throw err; // throw other errors so React Query can catch them
      }
    },
    enabled: !!selectedApplicantName,
  });

  // Close Modal
  const handleClose = () => {
    setSelectedApplicantName("");
    document.getElementById("View_Applicant_Profile_Modal")?.close();
  };

  // Loading states
  if (isLoading)
    return (
      <div
        id="Edit_Mentorship_Modal"
        className="modal-box p-0 relative bg-white rounded-lg shadow-xl hover:shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] text-black overflow-y-auto"
      >
        <Loading height="min-h-[60vh]" />
      </div>
    );

  // Error states
  if (error)
    return (
      <div
        id="Edit_Mentorship_Modal"
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

  // If No Application Data
  if (
    !isLoading &&
    (!ApplicantInformation ||
      (Array.isArray(ApplicantInformation) &&
        ApplicantInformation.length === 0))
  ) {
    return (
      <div
        id="View_Applicant_Profile_Modal"
        className="modal-box max-w-4xl mx-auto p-6 space-y-6 bg-white text-black rounded-xl shadow-lg overflow-y-auto"
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
            We couldn’t find any User details to display right now. Please check
            back later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  // If profile is not public or missing
  if (!ApplicantInformation?.isProfilePublic) {
    return (
      <div
        id="View_Applicant_Profile_Modal"
        className="modal-box bg-white text-black shadow-xl max-w-md w-full p-8 rounded-xl border border-gray-200 text-center"
      >
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
          Please check back later or contact the user directly if appropriate.
        </p>

        {/* Close Button */}
        <div className="modal-action justify-center">
          <form method="dialog">
            <button
              onClick={() => handleClose()}
              className="bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center gap-2 font-semibold text-white py-2 px-10 cursor-pointer transition-colors duration-200 group"
            >
              <FaArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
              Go Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      id="View_Applicant_Profile_Modal"
      className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full h-[75vh]"
    >
      {/* Close Button */}
      <button
        onClick={() => handleClose()}
        className="absolute top-3 right-3 z-50 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer"
      >
        <ImCross className="text-xl text-black hover:text-red-500" />
      </button>

      {/* Modal Content */}
      <div className="max-w-7xl mx-auto rounded-xl shadow-sm border p-6">
        {/* Public User Header */}
        <PublicUserProfileHeader user={ApplicantInformation} />

        <div className="bg-gray-200 py-[1px] my-10" />

        {/* Public User Personal Information */}
        <PublicUserProfilePersonalInformation user={ApplicantInformation} />

        <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

        {/* Public User Profile Documents */}
        <PublicUserProfileDocuments user={ApplicantInformation} />

        <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

        {/* Public User Skills */}
        <PublicUserProfileSkills user={ApplicantInformation} />

        <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

        {/* Public User Preferences */}
        <PublicUserProfilePreferences user={ApplicantInformation} />
      </div>
    </div>
  );
};

// Prop validation
ApplicantInformationModal.propTypes = {
  selectedApplicantName: PropTypes.string.isRequired,
  setSelectedApplicantName: PropTypes.func.isRequired,
};

export default ApplicantInformationModal;
