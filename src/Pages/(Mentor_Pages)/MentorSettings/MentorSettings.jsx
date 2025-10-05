// Components
import MyDelete from "./MyDelete/MyDelete";
import MySettings from "./MySettings/MySettings";
import MySupportHelp from "./MySupportHelp/MySupportHelp";
import MyPlatformCustomization from "./MyPlatformCustomization/MyPlatformCustomization";

const MentorSettings = () => {
  return (
    <div className="min-h-screen text-gray-900 pb-5">
      {/* My Settings */}
      <MySettings />

      {/* My Platform Customization */}
      <MyPlatformCustomization />

      {/* My Support & Help */}
      <MySupportHelp />

      {/* Delete */}
      <MyDelete />
    </div>
  );
};

export default MentorSettings;
