import { useState } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Icons
import { FaExclamationTriangle } from "react-icons/fa";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";

// Hooks
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const PRE_WRITTEN_MESSAGES = [
  {
    ref: "Greeting & Update",
    text: "Hello [Participant Name], I hope this message finds you well. We wanted to provide you with an update regarding your enrollment and next steps.",
  },
  {
    ref: "Reminder",
    text: "Dear [Participant Name], this is a friendly reminder to complete your pending tasks. Please let us know if you require any assistance.",
  },
  {
    ref: "Acceptance / Confirmation",
    text: "Congratulations [Participant Name]! You have been successfully enrolled. Further instructions will follow shortly.",
  },
  {
    ref: "Follow-Up",
    text: "Hi [Participant Name], we wanted to follow up regarding your recent enrollment. Kindly confirm receipt of this message and feel free to ask any questions.",
  },
  {
    ref: "Thank You",
    text: "Thank you [Participant Name] for your interest in our program. We appreciate your time and effort, and will update you as soon as possible.",
  },
  {
    ref: "Payment Reminder",
    text: "Dear [Participant Name], this is a reminder that your payment for the course/mentorship is due. Please complete it at your earliest convenience.",
  },
  {
    ref: "Event Invitation",
    text: "Hello [Participant Name], we are excited to invite you to our upcoming webinar/event related to your course or mentorship program. We hope to see you there!",
  },
  {
    ref: "Feedback Request",
    text: "Hi [Participant Name], we would love your feedback on your recent course or mentorship experience. Your input helps us improve.",
  },
  {
    ref: "Motivational Note",
    text: "Hello [Participant Name], keep up the great work in your course/mentorship! Remember, progress comes one step at a time.",
  },
];

const MentorPhoneFormView = ({ setView, handleClose, selectedApplicants }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Form Handler
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({});

  // Insert Pre Written
  const insertPreWritten = (text) => setMessage(text);

  // On Submit Handler
  const onSubmit = async () => {
    // Validation Checks
    if (selectedApplicants.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Participants Selected",
        text: "Please select at least one participant to send the message.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Title",
        text: "Please enter a title for your message.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      // Prepare payload
      const payload = {
        name: user?.name || "Mentor",
        email: user?.email || "",
        type: "Mentor",
        title, 
        message_raw: message,
        recipients: selectedApplicants.map((p) => ({
          to_id: p._id,
          to_name: p.name,
          to_phone: p.phone || "",
        })),
        sentAt: new Date().toISOString(),
      };

      // Send message
      await axiosPublic.post("/MentorMessages", payload);

      // Log message
      Swal.fire({
        icon: "success",
        title: "Messages Prepared",
        html: `
          Messages successfully prepared for <b>${selectedApplicants.length}</b> participants.<br/><br/>
          <b style="color:red;">No SMS API is connected, so messages were not actually sent.</b>
        `,
        confirmButtonColor: "#3b82f6",
      });

      // Reset
      handleClose();
      setTitle("");
      setMessage("");

      // Close modal
      document.getElementById("Mentor_Mentees_Message_Modal")?.close();
    } catch (error) {
      console.error("Sending or logging failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-6 flex flex-col gap-4 text-black overflow-y-auto max-h-[calc(100vh-150px)]"
    >
      {/* Warning */}
      <div className="flex items-center gap-2 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 rounded mb-4">
        <FaExclamationTriangle />
        <span>
          No SMS API is connected. Messages will not actually be sent.
        </span>
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
      />

      {/* Message Textarea */}
      <textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 w-full border rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none shadow-sm"
        rows={7}
      />

      {/* Pre-written Templates */}
      <div>
        <h4 className="text-gray-700 font-semibold mb-2">
          Quick Message Templates:
        </h4>
        <div className="flex flex-wrap gap-2">
          {PRE_WRITTEN_MESSAGES.map((msg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertPreWritten(msg.text)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 transition cursor-pointer text-sm"
            >
              {msg.ref}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4 sticky bottom-0 bg-white py-3">
        <button
          type="button"
          onClick={() => setView("options")}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition cursor-pointer"
        >
          <FaArrowLeft /> Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FaPaperPlane /> {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
};

// Prop Validation
MentorPhoneFormView.propTypes = {
  setView: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedApplicants: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
    })
  ),
};

export default MentorPhoneFormView;
