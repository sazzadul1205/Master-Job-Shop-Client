
// Packages
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

// Icons
import { ImCross } from 'react-icons/im';

// Hooks
import useAxiosPublic from '../../../../../Hooks/useAxiosPublic';

// Shared
import Error from '../../../../../Shared/Error/Error';
import Loading from '../../../../../Shared/Loading/Loading';

// Components
import PublicUserProfileHeader from '../../../../(Public_Pages)/PublicUserProfile/PublicUserProfileHeader/PublicUserProfileHeader';
import PublicUserProfileSkills from '../../../../(Public_Pages)/PublicUserProfile/PublicUserProfileSkills/PublicUserProfileSkills';
import PublicUserProfileDocuments from '../../../../(Public_Pages)/PublicUserProfile/PublicUserProfileDocuments/PublicUserProfileDocuments';
import PublicUserProfilePreferences from '../../../../(Public_Pages)/PublicUserProfile/PublicUserProfilePreferences/PublicUserProfilePreferences';
import PublicUserProfilePersonalInformation from '../../../../(Public_Pages)/PublicUserProfile/PublicUserProfilePersonalInformation/PublicUserProfilePersonalInformation';

const ViewMemberProfileModal = ({
  userEmail,
  setUserEmail,
}) => {
  const axiosPublic = useAxiosPublic();

  // Fetch user by decoded email
  const {
    data: UserData = [],   // Default value = empty array
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicUser", userEmail],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/Users?email=${userEmail}`);
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return []; // return empty array if not found
        }
        throw err; // rethrow other errors
      }
    },
    enabled: !!userEmail,
  });

  // Modal should only show if profile is not public
  const showPrivateNotice = UserData ? !UserData.isProfilePublic : false;

  // UI Error / Loading State
  if (isLoading) return (
    <div
      id="View_Profile_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("View_Profile_Modal").close();
          setUserEmail(null)
        }
        }
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>
      <Loading />
    </div>
  );

  if (error) return (
    <div
      id="View_Profile_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("View_Profile_Modal").close();
          setUserEmail(null)
        }
        }
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>s
      <Error />
    </div>
  );

  return (
    <div
      id="View_Profile_Modal"
      className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto"
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => {
          document.getElementById("View_Profile_Modal").close();
          setUserEmail(null)
        }
        }
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>


      {showPrivateNotice ? (
        // Render Private Profile Notice
        <div className="text-center py-10">
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

        </div>
      ) : (
        // Render Normal Profile View
        <>
          {/* Public User Header */}
          <PublicUserProfileHeader user={UserData} />

          <div className="bg-gray-200 py-[1px] my-10" />

          {/* Public User Personal Information */}
          <PublicUserProfilePersonalInformation user={UserData} />

          <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

          {/* Public User Profile Documents */}
          <PublicUserProfileDocuments user={UserData} />

          <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

          {/* Public User Skills */}
          <PublicUserProfileSkills user={UserData} />

          <div className="bg-gray-200 py-[1px] mt-10 mb-5" />

          {/* Public User Preferences */}
          <PublicUserProfilePreferences user={UserData} />
        </>
      )}
    </div >
  );
};

// Prop Validation
ViewMemberProfileModal.propTypes = {
  userEmail: PropTypes.string,
  setUserEmail: PropTypes.func.isRequired,
};

export default ViewMemberProfileModal;