// Icons
import {
  FaBookOpen,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaSkullCrossbones,
  FaUserSlash,
} from "react-icons/fa";

// Modals
import MentorDeleteCourseModal from "./MentorDeleteCourseModal/MentorDeleteCourseModal";
import MentorDeleteMessagesModal from "./MentorDeleteMessagesModal/MentorDeleteMessagesModal";
import MentorDeleteMentorshipModal from "./MentorDeleteMentorshipModal/MentorDeleteMentorshipModal";
import MentorDeleteProfileModal from "./MentorDeleteProfileModal/MentorDeleteProfileModal";

const MyDelete = () => {
  return (
    <>
      {/* Header - Delete Data & Account */}
      <div className="flex items-center justify-between py-7 px-9">
        <h3 className="text-black text-3xl font-bold">Delete Data & Account</h3>
      </div>

      {/* Delete All Mentorship's */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4 mx-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-500" />
          Delete All Mentorship&apos;s
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Description */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>This action will permanently remove:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All mentorship session records</li>
            <li>Mentor and mentees history</li>
            <li>Any attached files or notes</li>
            <li>Associated analytics or feedback</li>
            <li>Mentorship Applications and responses history</li>
          </ul>

          {/* Warning */}
          <p className="text-red-600 font-semibold">
            ⚠️ This cannot be undone. Proceed with caution!
          </p>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                document
                  .getElementById("Mentor_Delete_Mentorship_Modal")
                  .showModal()
              }
              className="mt-3 px-5 py-2 w-[200px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Delete All Mentorship&apos;s
            </button>
          </div>
        </div>
      </div>

      {/* Delete All Courses */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaBookOpen className="text-blue-600" />
          Delete All Courses
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Description */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>This action will permanently remove:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All created and enrolled courses</li>
            <li>Courses Applications and responses history</li>
            <li>All uploaded course materials (videos, PDFs, etc.)</li>
            <li>Student progress and submissions</li>
            <li>Certificates and completion records</li>
          </ul>

          {/* Warning */}
          <p className="text-red-600 font-semibold">
            ⚠️ This cannot be undone. Proceed with caution!
          </p>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                document
                  .getElementById("Mentor_Delete_Course_Modal")
                  .showModal()
              }
              className="mt-3 px-5 py-2 w-[200px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Delete All Courses
            </button>
          </div>
        </div>
      </div>

      {/* Delete All Emails & Messages */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4 mx-5 mt-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaEnvelopeOpenText className="text-purple-600" />
          Delete All Emails & Message History
        </h3>

        {/* Divider */}
        <p className="bg-gray-600 h-0.5 w-full" />

        {/* Description */}
        <div className="space-y-3 text-gray-600 font-semibold">
          {/* Text */}
          <p>This action will permanently remove:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All sent and received emails</li>
            <li>All private and group chat history</li>
            <li>Archived or deleted message logs</li>
            <li>Any media attachments shared in messages</li>
          </ul>

          {/* Warning */}
          <p className="text-red-600 font-semibold">
            ⚠️ This action is irreversible. Proceed only if you’re absolutely
            sure!
          </p>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                document
                  .getElementById("Mentor_Delete_Messages_Modal")
                  .showModal()
              }
              className="mt-3 px-5 py-2 w-[250px] text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Delete All Emails & Messages
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 mx-5 mt-6 border-2 border-red-500">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <FaUserSlash className="text-red-700" />
          Permanently Delete Your Account
        </h3>

        {/* Divider */}
        <p className="bg-red-600 h-0.5 w-full" />

        {/* Description */}
        <div className="space-y-3 text-gray-700 font-semibold">
          {/* Text */}
          <p className="flex items-center gap-2 text-red-700 font-bold text-base">
            <FaExclamationTriangle className="text-red-600" />
            This is the final action — once you proceed, your account will be
            permanently erased.
          </p>

          {/* List */}
          <p>This will permanently remove and erase:</p>

          {/* List */}
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All personal information and credentials</li>
            <li>All mentorship, courses, and learning progress</li>
            <li>All messages, notifications, and email history</li>
            <li>All linked payment data and transaction history</li>
            <li>Access to any associated services or subscriptions</li>
          </ul>

          {/* Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
            <p className="text-red-700 font-semibold">
              ⚠️ Once your account is deleted,{" "}
              <u>there is no way to recover it</u>. Please download or back up
              any important data before continuing.
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                document
                  .getElementById("Mentor_Delete_Profile_Modal")
                  .showModal()
              }
              className="mt-3 px-6 py-3 w-[320px] text-sm font-bold rounded-lg bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-800 hover:to-red-700 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer "
            >
              <FaSkullCrossbones className="text-white" />
              Permanently Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* ----- Modal ----- */}
      {/* Mentor Delete Mentorship's Modal */}
      <dialog id="Mentor_Delete_Mentorship_Modal" className="modal">
        <MentorDeleteMentorshipModal />
      </dialog>

      {/* Mentor Delete Course's Modal */}
      <dialog id="Mentor_Delete_Course_Modal" className="modal">
        <MentorDeleteCourseModal />
      </dialog>

      {/* Mentor Delete Message's Modal */}
      <dialog id="Mentor_Delete_Messages_Modal" className="modal">
        <MentorDeleteMessagesModal />
      </dialog>

      {/* Mentor Delete Profile Modal */}
      <dialog id="Mentor_Delete_Profile_Modal" className="modal">
        <MentorDeleteProfileModal />
      </dialog>
    </>
  );
};

export default MyDelete;
