// Components
import MySettings from "./MySettings/MySettings";
import MySupportHelp from "./MySupportHelp/MySupportHelp";
import MyPlatformCustomization from "./MyPlatformCustomization/MyPlatformCustomization";

const MentorSettings = () => {
  return (
    <div className="min-h-screen text-gray-900 pb-5">
      <MySettings />

      <MyPlatformCustomization />

      <MySupportHelp />
    </div>
  );
};

export default MentorSettings;
