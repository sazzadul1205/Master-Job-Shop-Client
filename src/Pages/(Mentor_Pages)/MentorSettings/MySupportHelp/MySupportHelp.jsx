import { FaBook, FaBug, FaComments, FaHeadset } from "react-icons/fa";

const MySupportHelp = () => {
  return (
    <>
      {/* Header - Support & Help */}
      <div className="flex items-center justify-between py-7 px-9">
        <h3 className="text-black text-3xl font-bold">Support & Help</h3>
      </div>

      {/* Help Center */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaBook className="text-blue-600" /> Help Center
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Helpful Resources */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>Access helpful resources including:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>FAQs (Frequently Asked Questions)</li>
            <li>Step-by-step Tutorials</li>
            <li>Detailed User Guides</li>
          </ul>

          {/* Go to Help Center */}
          <div className="flex justify-end">
            <button className="mt-3 px-4 py-2 text-sm w-[150px] font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer ">
              Go to Help Center
            </button>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaHeadset className="text-green-600" /> Contact Support
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Content */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>Need personal assistance? Reach out to our support team:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Submit a support ticket</li>
            <li>Start a live chat with an agent</li>
          </ul>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 text-sm w-[150px] font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer ">
              Submit Ticket
            </button>
            <button className="px-4 py-2 text-sm w-[150px] font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer ">
              Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaComments className="text-purple-600" /> Community
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Content */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>Join discussions and share knowledge with peers:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Mentor & Mentees Forum</li>
            <li>Knowledge Base with shared insights</li>
          </ul>

          {/* Button */}
          <div className="flex justify-end">
            <button className="mt-3 px-4 py-2 w-[150px] text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">
              Visit Community
            </button>
          </div>
        </div>
      </div>

      {/* Report a Problem */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaBug className="text-red-600" /> Report a Problem
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Content */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>Found an issue or want to give feedback?</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Bug Reporting Form</li>
            <li>General Feedback</li>
          </ul>

          <div className="flex justify-end">
            <button className="mt-3 px-4 py-2 w-[150px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer">
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MySupportHelp;
