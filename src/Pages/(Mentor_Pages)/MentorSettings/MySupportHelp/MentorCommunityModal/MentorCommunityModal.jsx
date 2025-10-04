// Icons
import { ImCross } from "react-icons/im";
import { MdInfoOutline } from "react-icons/md";

const MentorCommunityModal = () => {
  const handleClose = () => {
    document.getElementById("Mentor_Community_Dialog")?.close();
  };

  return (
    <div className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative">
      {/* Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">Mentor Community</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Info Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mt-6">
        <MdInfoOutline className="text-6xl text-blue-500" />
        <h4 className="text-lg font-semibold">Feature Unavailable</h4>
        <p className="text-gray-600 max-w-md">
          The Mentor Community feature is currently under development. Soon,
          mentors will be able to connect, collaborate, and share insights with
          one another through a dedicated community space. Please check back
          later for updates as we roll out this exciting feature!
        </p>
      </div>
    </div>
  );
};

export default MentorCommunityModal;
