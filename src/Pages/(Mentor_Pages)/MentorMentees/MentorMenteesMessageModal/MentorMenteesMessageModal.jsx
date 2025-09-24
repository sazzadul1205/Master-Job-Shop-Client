import { useState } from "react";
import { ImCross } from "react-icons/im";
import {
  FaRegEnvelope,
  FaRegCommentDots,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa6";
import EmailFormView from "./EmailFormView/EmailFormView";

const MentorMenteesMessageModal = () => {
  const [view, setView] = useState("options"); // "options" | "message" | "email"
  const [message, setMessage] = useState("");

  // Close Modal
  const handleClose = () => {
    document.getElementById("Mentor_Mentees_Message_Modal")?.close();
    setView("options"); // reset when closing
  };

  return (
    <div
      id="Mentor_Mentees_Message_Modal"
      className="modal-box bg-white rounded-xl shadow-lg p-0 max-w-3xl w-full h-[75vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b px-6 py-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-700">
          {view === "options"
            ? "Choose Communication Method"
            : view === "message"
            ? "Send Message"
            : "Send Email"}
        </h2>
        <button
          className="ml-auto text-gray-500 hover:text-red-500 p-2 rounded-full cursor-pointer"
          onClick={handleClose}
        >
          <ImCross className="text-lg" />
        </button>
      </div>

      {/* Options View */}
      {view === "options" && (
        <div className="flex-1 flex items-center justify-center gap-10 p-8">
          {/* Message Card */}
          <div
            onClick={() => setView("message")}
            className="w-64 h-52 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition transform cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <FaRegCommentDots className="text-5xl text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Message</h3>
            <p className="text-base text-gray-500 text-center">
              Send quick in-app messages to applicants
            </p>
          </div>

          {/* Email Card */}
          <div
            onClick={() => setView("email")}
            className="w-64 h-52 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition transform cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <FaRegEnvelope className="text-5xl text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <p className="text-base text-gray-500 text-center">
              Send professional email directly to applicants
            </p>
          </div>
        </div>
      )}

      {/* Message Form View */}
      {/* Pre-written Professional Messages */}
      {view === "message" && (
        <div className="flex-1 p-6 flex flex-col">
          {/* Message Textarea */}
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          />

          {/* Pre-written Messages */}
          <div className="mb-4">
            <h4 className="text-gray-700 font-semibold mb-2">
              Quick Message Templates:
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                {
                  ref: "Greeting & Update",
                  text: "Hello [Applicant Name], I hope this message finds you well. We wanted to provide you with an update regarding your application and next steps.",
                },
                {
                  ref: "Reminder",
                  text: "Dear [Applicant Name], this is a friendly reminder to complete your pending tasks on your application. Please let us know if you require any assistance.",
                },
                {
                  ref: "Acceptance",
                  text: "Congratulations [Applicant Name]! We are pleased to inform you that you have been accepted into the program. Further instructions will follow shortly.",
                },
                {
                  ref: "Follow-Up",
                  text: "Hi [Applicant Name], we wanted to follow up regarding your recent application. Kindly confirm receipt of this message and feel free to ask any questions.",
                },
                {
                  ref: "Thank You",
                  text: "Thank you [Applicant Name] for your interest in our program. We appreciate your time and effort, and will update you as soon as possible.",
                },
              ].map((msg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(msg.text)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-200 transition cursor-pointer"
                >
                  {msg.ref}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setView("options")}
              className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="button"
              onClick={() => {
                alert("Message sent: " + message);
                setMessage("");
              }}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      )}

      {/* Email Form View */}
      {view === "email" && <EmailFormView setView={setView} />}
    </div>
  );
};

export default MentorMenteesMessageModal;
