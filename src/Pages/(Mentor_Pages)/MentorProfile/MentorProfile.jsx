// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { MdEdit } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { SlSocialLinkedin } from "react-icons/sl";

// Assets
import DefaultUserLogo from "../../../assets/DefaultUserLogo.jpg";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import CreateMentorProfileModal from "./CreateMentorProfileModal/CreateMentorProfileModal";

const MentorProfile = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Fetch Mentor Data
  const {
    data: MentorData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["MentorData", user?.email],
    queryFn: () =>
      axiosPublic.get(`/Mentors?email=${user?.email}`).then((res) => res.data),
    enabled: !!user?.email,
  });

  // Loading / Error UI
  if (isLoading || loading) return <Loading />;
  if (error) return <Error />;

  // If no mentor profile data exists
  if (!MentorData || Object.keys(MentorData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center`">
        <h2 className="text-2xl text-black font-bold mb-4">No Profile Found</h2>
        <p className="text-gray-600 font-semibold text-xl mb-6 w-1/2 text-center">
          You haven’t created your mentor profile yet. Please set it up to
          showcase your expertise and connect with mentees.
        </p>
        <button
          onClick={() =>
            document.getElementById("Create_Mentor_Profile_Modal").showModal()
          }
          className="border-2 border-blue-500 hover:bg-blue-500 text-blue-700 hover:text-white font-semibold px-10 py-3 rounded-lg cursor-pointer transition-colors duration-500"
        >
          Create Profile
        </button>

        <dialog id="Create_Mentor_Profile_Modal" className="modal">
          <CreateMentorProfileModal refetch={refetch} />
        </dialog>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Basic Information */}
      <div className="bg-white text-black w-full px-6 rounded-xl pb-7 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-between pt-7">
          <h3 className="font-bold text-xl">Mentor Profile</h3>
          <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer">
            <MdEdit /> Edit Profile
          </button>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-6 pt-5">
          {/* Avatar */}
          <img
            src={MentorData.avatar || DefaultUserLogo}
            alt={MentorData.name || "Mentor avatar"}
            className="w-20 h-20 rounded-full"
          />

          {/* Name & Position */}
          <div>
            <h2 className="text-2xl font-semibold">{MentorData.name}</h2>
            <p className="text-gray-500">{MentorData.position}</p>
          </div>
        </div>

        {/* Description */}
        <p className="pt-1">{MentorData.description}</p>
      </div>

      {/* Contact Details Block */}
      <div className="bg-white text-black w-full px-6 rounded-xl pb-7 mt-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ">
        {/* Header */}
        <div className="flex items-center justify-between pt-7 ">
          <h3 className="font-semibold text-xl">Contact Details</h3>
          <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer">
            <MdEdit /> Edit Contact
          </button>
        </div>

        {/* Contact Details */}
        <div className="pt-6 pb-10 space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 text-base">
            <AiOutlineMail className="text-2xl" />
            {MentorData.contact.email}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-base">
            <FiPhone className="text-2xl" />
            {MentorData.contact.phone}
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-3 text-base">
            <SlSocialLinkedin className="text-2xl" />
            {MentorData.contact.linkedin}
          </div>
        </div>
      </div>

      {/* Expertise & Skills */}
      <div className="bg-white text-black w-full px-6 rounded-xl pb-7 mt-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-between pt-7">
          <h3 className="font-bold text-xl">Expertise & Skills</h3>
          <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer">
            <MdEdit /> Edit Expertise
          </button>
        </div>

        {/* Expertise */}
        <div className="pt-6">
          <h2 className="text-gray-500 text-lg font-semibold mb-2">
            Expertise Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {MentorData.expertise.map((area, idx) => (
              <span
                key={idx}
                className="text-gray-800 text-xs font-semibold bg-gray-200 px-3 py-1.5 rounded-2xl hover:bg-gray-300 cursor-default transition-colors"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="pt-6">
          <h2 className="text-gray-500 text-lg font-semibold mb-2">
            Key Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {MentorData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-gray-800 text-xs font-semibold bg-gray-200 px-3 py-1.5 rounded-2xl hover:bg-gray-300 cursor-default transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Biography */}
      <div className="bg-white text-black w-full px-6 rounded-xl pb-7 mt-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-between pt-7">
          <h3 className="font-bold text-xl">Biography</h3>
          <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer">
            <MdEdit /> Edit Biography
          </button>
        </div>

        {/* Biography */}
        <div className="py-6 space-y-6">
          {MentorData.biography.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
