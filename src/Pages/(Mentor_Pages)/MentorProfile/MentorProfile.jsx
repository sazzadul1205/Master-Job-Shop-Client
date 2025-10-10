// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { MdEdit } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { AiOutlineMail } from "react-icons/ai";
import { SlSocialLinkedin } from "react-icons/sl";

// Assets
import DefaultUserLogo from "../../../assets/DefaultUserLogo.jpg";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Functions
import { formatBDPhoneNumber } from "../../../Functions/formatPhoneNumber";

// Modals
import CreateMentorProfileModal from "./CreateMentorProfileModal/CreateMentorProfileModal";
import EditProfileExpertiseModal from "./EditProfileExpertiseModal/EditProfileExpertiseModal";
import EditProfileBiographyModal from "./EditProfileBiographyModal/EditProfileBiographyModal";
import EditProfileContactDetailsModal from "./EditProfileContactDetailsModal/EditProfileContactDetailsModal";
import EditProfileBasicInformationModal from "./EditProfileBasicInformationModal/EditProfileBasicInformationModal";

const MentorProfile = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // ---------- Fetch Mentor Profile Data ----------
  const {
    data: MentorData,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors/${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Loading UI
  if (isLoading || loading) return <Loading />;

  // Error UI
  if (error) return <Error />;

  // If no mentor profile data exists
  if (!MentorData || Object.keys(MentorData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl text-black font-bold mb-3 sm:mb-4">
          No Profile Found
        </h2>

        {/* Message */}
        <p className="text-gray-600 font-medium sm:font-semibold text-base sm:text-lg md:text-xl mb-6 max-w-md sm:max-w-lg md:max-w-2xl">
          You haven’t created your mentor profile yet. Please set it up to
          showcase your expertise and connect with mentees.
        </p>

        {/* Create Button */}
        <button
          onClick={() =>
            document.getElementById("Create_Mentor_Profile_Modal").showModal()
          }
          className="border-2 border-blue-500 hover:bg-blue-500 text-blue-700 hover:text-white font-semibold px-6 sm:px-10 py-2 sm:py-3 rounded-lg cursor-pointer transition-colors duration-300"
        >
          Create Profile
        </button>

        {/* Create Mentor Profile Modal */}
        <dialog id="Create_Mentor_Profile_Modal" className="modal">
          <CreateMentorProfileModal refetch={refetch} />
        </dialog>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-5 pb-20 md:pb-5">
      {/* Basic Information */}
      <div className="bg-white text-black w-full px-4 sm:px-6 rounded-xl pb-7 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-default">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-7 gap-3 sm:gap-0">
          {/* Title */}
          <h3 className="font-bold text-lg sm:text-xl">Mentor Profile</h3>

          {/* Edit Button */}
          <button
            onClick={() =>
              document
                .getElementById("Edit_Profile_Basic_Information")
                .showModal()
            }
            className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer text-sm sm:px-4 sm:py-1.5"
          >
            <MdEdit className="text-base sm:text-lg" /> Edit Profile
          </button>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pt-5 text-center sm:text-left">
          {/* Avatar */}
          {isLoading || isFetching ? (
            <div className="skeleton h-20 w-20 sm:h-24 sm:w-24 rounded-full shrink-0"></div>
          ) : (
            <img
              src={MentorData?.avatar || DefaultUserLogo}
              alt={MentorData?.name || "Mentor avatar"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
            />
          )}

          {/* Name & Position */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">
              {MentorData?.name}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              {MentorData?.position}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="pt-5 text-sm sm:text-base leading-relaxed text-gray-700">
          {MentorData?.description}
        </p>
      </div>

      {/* Contact Details Block */}
      <div className="bg-white text-black w-full px-4 sm:px-6 rounded-xl pb-7 mt-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-default">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-7 gap-3 sm:gap-0">
          {/* Title */}
          <h3 className="font-semibold text-lg sm:text-xl">Contact Details</h3>

          {/* Edit Button */}
          <button
            onClick={() =>
              document
                .getElementById("Edit_Profile_Contact_Details")
                .showModal()
            }
            className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer text-sm sm:px-4 sm:py-1.5"
          >
            <MdEdit className="text-base sm:text-lg" /> Edit Contact
          </button>
        </div>

        {/* Contact Details */}
        <div className="pt-6 pb-10 space-y-4">
          {/* Email */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 text-sm sm:text-base break-all">
            <AiOutlineMail className="text-xl sm:text-2xl text-gray-700 flex-shrink-0" />
            <span className="text-gray-800">
              {MentorData?.contact?.email || "N/A"}
            </span>
          </div>

          {/* Phone */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 text-sm sm:text-base">
            <FiPhone className="text-xl sm:text-2xl text-gray-700 flex-shrink-0" />
            <span className="text-gray-800">
              {MentorData?.contact?.phone
                ? formatBDPhoneNumber(MentorData.contact.phone)
                : "N/A"}
            </span>
          </div>

          {/* LinkedIn */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 text-sm sm:text-base break-all">
            <SlSocialLinkedin className="text-xl sm:text-2xl text-gray-700 flex-shrink-0" />
            <span className="text-gray-800">
              {MentorData?.contact?.linkedin || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Expertise & Skills */}
      <div className="bg-white text-black w-full px-6 sm:px-4 rounded-xl pb-7 mt-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-default">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-7">
          {/* Title */}
          <h3 className="font-bold text-xl sm:text-lg">Expertise & Skills</h3>

          {/* Edit Button */}
          <button
            onClick={() =>
              document.getElementById("Edit_Profile_Expertise").showModal()
            }
            className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer text-sm sm:px-4 sm:py-1.5"
          >
            <MdEdit className="text-lg" /> Edit Expertise
          </button>
        </div>

        {/* Expertise */}
        <div className="pt-6">
          <h2 className="flex items-center gap-2 text-lg sm:text-base font-semibold mb-4">
            <GoDotFill /> Expertise Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {MentorData?.expertise?.length ? (
              MentorData.expertise.map((area, idx) => (
                <span
                  key={idx}
                  className="text-gray-800 text-sm font-semibold bg-gray-200 px-4 py-1.5 rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  {area}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                No expertise areas added.
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="pt-6">
          <h2 className="flex items-center gap-2 text-lg sm:text-base font-semibold mb-4">
            <GoDotFill /> Key Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {MentorData?.skills?.length ? (
              MentorData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-gray-800 text-sm font-semibold bg-gray-200 px-4 py-1.5 rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No skills added.</p>
            )}
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-white text-black w-full px-6 sm:px-4 rounded-xl pb-7 mt-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-default">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-7">
          {/* Title */}
          <h3 className="font-bold text-xl sm:text-lg text-center sm:text-left w-full sm:w-auto">
            Biography
          </h3>

          {/* Edit Button */}
          <button
            onClick={() =>
              document.getElementById("Edit_Profile_Biography").showModal()
            }
            className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer text-sm sm:px-4 sm:py-1.5"
          >
            <MdEdit className="text-lg" /> Edit Biography
          </button>
        </div>

        {/* Biography */}
        <div className="py-6 space-y-6 text-base sm:text-sm leading-relaxed">
          {(MentorData?.biography || "")
            .split("\n")
            .filter((para) => para.trim() !== "")
            .map((para, idx) => (
              <p key={idx} className="text-gray-700">
                {para}
              </p>
            ))}
        </div>
      </div>

      {/* ---------- Modals ---------- */}
      {/* Edit Profile Basic Information Modal */}
      <dialog id="Edit_Profile_Basic_Information" className="modal">
        <EditProfileBasicInformationModal
          MentorData={MentorData}
          refetch={refetch}
        />
      </dialog>

      {/* Edit Profile Contact Details Modal */}
      <dialog id="Edit_Profile_Contact_Details" className="modal">
        <EditProfileContactDetailsModal
          MentorData={MentorData}
          refetch={refetch}
        />
      </dialog>

      {/* Edit Profile Expertise Modal */}
      <dialog id="Edit_Profile_Expertise" className="modal">
        <EditProfileExpertiseModal MentorData={MentorData} refetch={refetch} />
      </dialog>

      {/* Edit Profile Biography Modal */}
      <dialog id="Edit_Profile_Biography" className="modal">
        <EditProfileBiographyModal MentorData={MentorData} refetch={refetch} />
      </dialog>
    </div>
  );
};

export default MentorProfile;
