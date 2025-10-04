// Icons
import { ImCross } from "react-icons/im";
import { MdInfoOutline } from "react-icons/md";

const MentorStartChatModal = () => {
  // Close modal
  const handleClose = () => {
    document.getElementById("Mentor_Start_Chat_Modal")?.close();
  };

  return (
    <div
      id="Mentor_Start_Chat_Modal"
      className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
    >
      {/* Close */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Header */}
      <h3 className="font-bold text-xl text-center mb-4">Live Chat Support</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Info Message */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mt-6">
        <MdInfoOutline className="text-6xl text-blue-500" />
        <h4 className="text-lg font-semibold">Feature Unavailable</h4>
        <p className="text-gray-600 max-w-md">
          The live chat support feature is currently unavailable. Our team is
          working on implementing a real-time support system to better assist
          you. Please use the support ticket option in the meantime.
        </p>
      </div>
    </div>
  );
};

export default MentorStartChatModal;
