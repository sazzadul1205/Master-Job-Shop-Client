// Icons
import { ImCross } from "react-icons/im";
import { MdInfoOutline } from "react-icons/md";

const DashboardLayoutPreferencesModal = () => {
  // Close modal
  const handleClose = () => {
    document.getElementById("Dashboard_Layout_Preferences_Modal")?.close();
  };

  return (
    <div
      id="Dashboard_Layout_Preferences_Modal"
      className="modal-box max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]"
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
      <h3 className="font-bold text-xl text-center mb-4">
        Blocked Users Management
      </h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-6" />

      {/* Info / Placeholder Message */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mt-6">
        <MdInfoOutline className="text-6xl text-blue-500" />
        <h4 className="text-lg font-semibold">Feature Unavailable</h4>
        <p className="text-gray-600 max-w-md">
          Customizing your dashboard layout is currently unavailable. In the
          future, you will be able to personalize your dashboard view with
          different layouts, themes, and widget arrangements.
        </p>
      </div>
    </div>
  );
};

export default DashboardLayoutPreferencesModal;
