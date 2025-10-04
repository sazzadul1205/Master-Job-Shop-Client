import { useNavigate } from "react-router-dom";

// Icons
import {
  FaBook,
  FaBug,
  FaComments,
  FaHeadset,
  FaLightbulb,
} from "react-icons/fa";

// Modals
import MentorStartChatModal from "./MentorStartChatModal/MentorStartChatModal";
import MentorCommunityModal from "./MentorCommunityModal/MentorCommunityModal";
import MentorReportIssueModal from "./MentorReportIssueModal/MentorReportIssueModal";
import MentorSubmitTicketModal from "./MentorSubmitTicketModal/MentorSubmitTicketModal";
import MentorSuggestImprovementModal from "./MentorSuggestImprovementModal/MentorSuggestImprovementModal";

const MySupportHelp = () => {
  // Navigation
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate("/Mentor/HelpCenter")}
              className="mt-3 px-4 py-2 text-sm w-[150px] font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer "
            >
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
            {/* Submit Ticket Button */}
            <button
              onClick={() =>
                document
                  .getElementById("Mentor_Submit_Ticket_Modal")
                  .showModal()
              }
              className="px-4 py-2 text-sm w-[150px] font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer "
            >
              Submit Ticket
            </button>

            {/* Start Chat Button */}
            <button
              onClick={() =>
                document.getElementById("Mentor_Start_Chat_Modal").showModal()
              }
              className="px-4 py-2 text-sm w-[150px] font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer "
            >
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
          <p>Join discussions and share knowledge with peers:</p>

          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Mentor & Mentees Forum</li>
            <li>Knowledge Base with shared insights</li>
          </ul>

          <div className="flex justify-end">
            <button
              onClick={() =>
                document.getElementById("Mentor_Community_Dialog").showModal()
              }
              className="mt-3 px-4 py-2 w-[150px] text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
            >
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

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                document.getElementById("Mentor_Report_Issue_Modal").showModal()
              }
              className="mt-3 px-4 py-2 w-[150px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Report Issue
            </button>
          </div>
        </div>
      </div>

      {/* Suggest an Improvement */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-2 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaLightbulb className="text-green-600" /> Suggest an Improvement
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Content */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>Have an idea to make the platform better?</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Feature Suggestions</li>
            <li>UI/UX Enhancements</li>
            <li>Performance or Accessibility Improvements</li>
          </ul>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                document
                  .getElementById("Mentor_Suggest_Improvement_Modal")
                  .showModal()
              }
              className="mt-3 px-4 py-2 w-[180px] text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            >
              Suggest Improvement
            </button>
          </div>
        </div>
      </div>

      {/* ----- Modal ----- */}
      {/* Mentor Submit Ticket Modal */}
      <dialog id="Mentor_Submit_Ticket_Modal" className="modal">
        <MentorSubmitTicketModal />
      </dialog>

      {/* Mentor Start Chat Modal */}
      <dialog id="Mentor_Start_Chat_Modal" className="modal">
        <MentorStartChatModal />
      </dialog>

      {/* Mentor Community Modal */}
      <dialog id="Mentor_Community_Dialog" className="modal">
        <MentorCommunityModal />
      </dialog>

      {/* Mentor Report Issue Modal */}
      <dialog id="Mentor_Report_Issue_Modal" className="modal">
        <MentorReportIssueModal />
      </dialog>

      {/* Mentor Report Issue Modal */}
      <dialog id="Mentor_Suggest_Improvement_Modal" className="modal">
        <MentorSuggestImprovementModal />
      </dialog>
    </>
  );
};

export default MySupportHelp;
