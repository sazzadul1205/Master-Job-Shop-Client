// Hooks
import useAuth from "../../../../Hooks/useAuth";

// Modals
import MentorLoginHistoryModal from "./MentorLoginHistoryModal/MentorLoginHistoryModal";
import TwoFAAuthenticationModal from "./TwoFAAuthenticationModal/TwoFAAuthenticationModal";
import SettingsChangePasswordModal from "./SettingsChangePasswordModal/SettingsChangePasswordModal";
import MentorDownloadAccountDataModal from "./MentorDownloadAccountDataModal/MentorDownloadAccountDataModal.JSX";
import MentorDisableAccountModal from "./MentorDisableAccountModal/MentorDisableAccountModal";

const MySettings = () => {
  const { user } = useAuth();

  // Check if user can change password
  const canChangePassword =
    user &&
    user.providerData.some((provider) => provider.providerId === "password");

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
          {/* Text */}
          <p className="text-gray-600 font-semibold">Change Password</p>

          {/* Button */}
          <button
            onClick={() =>
              document
                .getElementById("Settings_Change_Password_Modal")
                .showModal()
            }
            disabled={!canChangePassword}
            className={`px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Update
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="text-gray-600 font-semibold">
            Two-Factor Authentication (2FA)
          </p>
          <button
            onClick={() =>
              document.getElementById("Two_FA_Authentication_Modal").showModal()
            }
            className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            Manage
          </button>
        </div>

        {/* Active Sessions */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-semibold">
            Manage Active Sessions / Login History
          </p>
          <button
            onClick={() =>
              document.getElementById("Mentor_Login_History_Modal").showModal()
            }
            className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
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

          {/* Button */}
          <button
            onClick={() =>
              document
                .getElementById("Mentor_Download_Account_Data_Modal")
                .showModal()
            }
            className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          >
            Download
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between border-b pb-3">
          <p className="text-gray-600 font-semibold">Deactivate Account</p>

          {/* Button */}
          <button
            onClick={() =>
              document
                .getElementById("Mentor_Disable_Account_Modal")
                .showModal()
            }
            className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            Deactivate
          </button>
        </div>

        {/* Blocked Users */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-semibold">Manage Blocked Users</p>

          {/* Button */}
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

      {/* 2FA Authentication Modal */}
      <dialog id="Two_FA_Authentication_Modal" className="modal">
        <TwoFAAuthenticationModal />
      </dialog>

      {/* Mentor Login History Modal */}
      <dialog id="Mentor_Login_History_Modal" className="modal">
        <MentorLoginHistoryModal />
      </dialog>

      {/* Mentor Download Account Data Modal */}
      <dialog id="Mentor_Download_Account_Data_Modal" className="modal">
        <MentorDownloadAccountDataModal />
      </dialog>

      {/* Mentor Disable Account Modal */}
      <dialog id="Mentor_Disable_Account_Modal" className="modal">
        <MentorDisableAccountModal />
      </dialog>
    </>
  );
};

export default MySettings;
