import SettingsChangePasswordModal from "./SettingsChangePasswordModal/SettingsChangePasswordModal";

const MySettings = () => {
  return (
    <>
      {/* Header - My Settings */}
      <div className="flex items-center justify-between py-7 px-9">
        <h3 className="text-black text-3xl font-bold">My Settings</h3>
      </div>

      {/* Password & Security */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700">
          Password & Security
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Change Password */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="text-gray-600 font-semibold">Change Password</p>
          <button
            onClick={() =>
              document.getElementById(
                "Settings_Change_Password_Modal"
              ).showModal()
            }
            className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            Update
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="text-gray-600 font-semibold">
            Two-Factor Authentication (2FA)
          </p>
          <button className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            Manage
          </button>
        </div>

        {/* Active Sessions */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-semibold">
            Manage Active Sessions / Login History
          </p>
          <button className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            View
          </button>
        </div>
      </div>

      {/* Data Control */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700">Data Control</h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Download Data */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="text-gray-600 font-semibold">Download Account Data</p>
          <button className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer">
            Download
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="text-gray-600 font-semibold">Deactivate Account</p>
          <button className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer">
            Deactivate
          </button>
        </div>

        {/* Blocked Users */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-semibold">Manage Blocked Users</p>
          <button className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            View
          </button>
        </div>
      </div>

      {/* ----- Modal ----- */}
      {/* Change Password Modal */}
      <dialog id="Settings_Change_Password_Modal" className="modal">
        <SettingsChangePasswordModal />
      </dialog>
    </>
  );
};

export default MySettings;
