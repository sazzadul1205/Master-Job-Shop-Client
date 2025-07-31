import { useState, useEffect } from "react";

// Packages
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Icons
import {
  FaBell,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebookF,
  FaMoon,
} from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const ProfileSettings = ({ user = {}, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const [settings, setSettings] = useState({
    emailUpdates: false,
    twoFactorAuth: false,
    isProfilePublic: false,
    googleConnected: false,
    facebookConnected: false,
    notificationsEnabled: false,
  });

  useEffect(() => {
    setSettings({
      emailUpdates: !!user.emailUpdates,
      twoFactorAuth: !!user.twoFactorAuth,
      isProfilePublic: !!user.isProfilePublic,
      googleConnected: !!user.googleConnected,
      facebookConnected: !!user.facebookConnected,
      notificationsEnabled: !!user.notificationsEnabled,
    });
  }, [user]);

  const handleToggle = async (field) => {
    // Block googleConnected, facebookConnected, and twoFactorAuth toggles with alert only
    if (
      field === "googleConnected" ||
      field === "facebookConnected" ||
      field === "twoFactorAuth"
    ) {
      await Swal.fire({
        icon: "info",
        title: "Feature Unavailable",
        text: "This function is currently not available. We apologize for the inconvenience.",
        confirmButtonColor: "#2563eb",
      });
      return; // stop here, do not toggle or update
    }

    const newValue = !settings[field];

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to turn ${newValue ? "on" : "off"} "${field.replace(
        /([A-Z])/g,
        " $1"
      )}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    });

    if (result.isConfirmed) {
      setSettings((prev) => ({ ...prev, [field]: newValue }));

      try {
        await axiosPublic.put(`/users/ToggleSetting/${user._id}`, {
          field,
          value: newValue,
        });

        // No success alert on successful update

        if (refetch) refetch();
      } catch (err) {
        console.log(err);

        // Revert toggle if error
        setSettings((prev) => ({ ...prev, [field]: !newValue }));

        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: "Failed to update setting. Please try again.",
        });
      }
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Settings</h2>

      <ToggleSetting
        icon={<FaBell className="text-blue-600 text-xl" />}
        title="Notifications"
        subtitle="Receive updates, messages, and alerts."
        enabled={settings.notificationsEnabled}
        onToggle={() => handleToggle("notificationsEnabled")}
      />

      <ToggleSetting
        icon={<FaUserShield className="text-blue-600 text-xl" />}
        title="Profile Visibility"
        subtitle={
          settings.isProfilePublic
            ? "Your profile is publicly visible to employers."
            : "Your profile is hidden from public view."
        }
        enabled={settings.isProfilePublic}
        onToggle={() => handleToggle("isProfilePublic")}
      />

      {/* Static Dark Mode Block */}
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-4">
          <FaMoon className="text-blue-600 text-xl" />
          <div>
            <p className="text-lg font-medium text-gray-800">Dark Mode</p>
            <p className="text-sm text-gray-500">Working on it (Coming Soon)</p>
          </div>
        </div>
        <div className="text-sm text-gray-400 font-medium">Coming Soon</div>
      </div>

      <ToggleSetting
        icon={<FaEnvelope className="text-blue-600 text-xl" />}
        title="Email Updates"
        subtitle="Get occasional emails about product updates and offers."
        enabled={settings.emailUpdates}
        onToggle={() => handleToggle("emailUpdates")}
      />

      <ToggleSetting
        icon={<FaLock className="text-blue-600 text-xl" />}
        title="Two-Factor Authentication"
        subtitle="Add an extra layer of security to your account."
        enabled={settings.twoFactorAuth}
        onToggle={() => handleToggle("twoFactorAuth")}
      />

      <ToggleSetting
        icon={<FaGoogle className="text-red-500 text-xl" />}
        title="Google Account"
        subtitle={
          settings.googleConnected
            ? "Your account is connected with Google."
            : "Connect your Google account for quick sign-in."
        }
        enabled={settings.googleConnected}
        onToggle={() => handleToggle("googleConnected")}
      />

      <ToggleSetting
        icon={<FaFacebookF className="text-blue-600 text-xl" />}
        title="Facebook Account"
        subtitle={
          settings.facebookConnected
            ? "Your account is connected with Facebook."
            : "Connect your Facebook account for quick sign-in."
        }
        enabled={settings.facebookConnected}
        onToggle={() => handleToggle("facebookConnected")}
      />
    </div>
  );
};

// Prop Validation
ProfileSettings.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    emailUpdates: PropTypes.bool,
    twoFactorAuth: PropTypes.bool,
    isProfilePublic: PropTypes.bool,
    googleConnected: PropTypes.bool,
    facebookConnected: PropTypes.bool,
    notificationsEnabled: PropTypes.bool,
  }),
  refetch: PropTypes.func,
};

const ToggleSetting = ({ icon, title, subtitle, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-4 border-b">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <p className="text-lg font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 cursor-pointer ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

// Prop Validation
ToggleSetting.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
export default ProfileSettings;
