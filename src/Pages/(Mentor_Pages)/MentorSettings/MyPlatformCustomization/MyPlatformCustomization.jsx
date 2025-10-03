
import { FaMoon, FaSun } from "react-icons/fa";

const MyPlatformCustomization = () => {
  return (
    <>
      {/* Header - Platform Customization */}
      <div className="flex items-center justify-between py-5 px-9">
        <h3 className="text-black text-3xl font-bold">
          Platform Customization
        </h3>
      </div>

      {/* Theme & Appearance */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700">
          Theme & Appearance
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Light / Dark Mode Toggle */}
        <div className="flex items-center justify-between border-b pb-3">
          {/* Text */}
          <p className="text-gray-600 font-semibold">Light / Dark Mode</p>

          {/* Toggle */}
          <div className="flex items-center gap-3">
            {/* Sun Icon */}
            <FaSun className="w-6 h-6 text-yellow-500" />

            {/* Toggle */}
            <input
              type="checkbox"
              defaultChecked
              className="toggle toggle-xl bg-gray-300 checked:bg-blue-600 border-0"
            />

            {/* Moon Icon */}
            <FaMoon className="w-6 h-6 text-gray-800" />
          </div>
        </div>

        {/* Dashboard Layout Preferences */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 font-semibold">
            Dashboard Layout Preferences
          </p>
          <button className="px-4 py-2 w-[120px] text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            Customize
          </button>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700">
          Language Preferences
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Select Preferred Language */}
        <div className="flex items-center justify-between">
          {/* Text */}
          <p className="text-gray-600 font-semibold">
            Select Preferred Language
          </p>

          {/* Dropdown */}
          <select className="px-3 py-2 w-[150px] border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Bangla</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default MyPlatformCustomization;
