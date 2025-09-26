import { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";

const MentorMessages = () => {
  const [activeTab, setActiveTab] = useState("emails");
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pt-7 pb-3 px-9">
        {/* Page Title */}
        <h3 className="text-black text-3xl font-bold">Messages & Emails</h3>

        {/* Refresh Button */}
        <button
          //   onClick={RefetchAll}
          className={`flex items-center gap-2 bg-white border border-gray-300 
                            hover:bg-blue-50 hover:border-blue-300 text-gray-800 font-medium 
                            px-4 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer`}
        >
          <FiRefreshCcw className="w-5 h-5" />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex px-8 gap-1 text-black">
        {/* Left Sidebar */}
        <div className="w-1/4 space-y-2 bg-white py-3 px-3 h-screen overflow-y-auto">
          {/* Add Message Button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all duration-200">
            <IoMdAdd className="w-5 h-5" />
            Add Message
          </button>

          {/* Tab Container */}
          <div className="flex bg-gray-200 rounded-lg p-1 shadow-inner">
            {/* Emails Tab */}
            <button
              onClick={() => setActiveTab("emails")}
              className={`flex-1 text-center py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer ${
                activeTab === "emails"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Emails
            </button>

            {/* Phone Messages Tab */}
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 text-center py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer ${
                activeTab === "phone"
                  ? "bg-white shadow text-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Phone Messages
            </button>
          </div>

          <p className="p-[1px] w-full bg-gray-300 my-2" />
        </div>

        {/* Right Content */}
        <div className="bg-blue-800 w-3/4 p-5"></div>
      </div>
    </div>
  );
};

export default MentorMessages;
