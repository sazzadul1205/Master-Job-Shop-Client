import { useEffect } from "react";

// Packages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";

// Icons
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";

// Input Components
import useAuth from "../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Shared
import FormInput from "../../../../../Shared/FormInput/FormInput";

// Pre-written options moved outside to avoid recreation on each render
const PRE_WRITTEN_OPTIONS = [
  {
    value: "welcome_message",
    name: "Welcome Message",
    label: `Welcome to our mentorship program! We are thrilled to have you on board and look forward to supporting your learning journey.

Please review the following points to get started:

1. Join the orientation session scheduled for [Insert Date & Time].
2. Familiarize yourself with the program resources shared in your portal.
3. Reach out to your assigned mentor for guidance and questions.

We are excited to see your growth and achievements throughout this program.

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "session_reminder",
    name: "Session Reminder",
    label: `This is a friendly reminder about your upcoming mentorship session:

- Date & Time: [Insert Date & Time]
- Mentor: [Mentor Name]
- Topic: [Session Topic]

Please ensure you are prepared and have completed any pre-session activities. Timely attendance will help you get the most out of the session.

Looking forward to your participation!

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "feedback_request",
    name: "Feedback Request",
    label: `We hope you enjoyed your recent mentorship session. Your feedback is important to us and helps improve the program.

Please take a few minutes to complete the feedback form: [Insert Link]

Thank you for your time and valuable insights.

Warm regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "progress_update",
    name: "Progress Update",
    label: `We are pleased to share your progress update in the mentorship program:

- Completed Sessions: [Number]
- Assignments Submitted: [Number]
- Key Achievements: [List Highlights]

Keep up the excellent work! Your dedication is making a positive impact on your learning journey.

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "resource_share",
    name: "Resource Share",
    label: `We would like to share some additional resources to support your growth in the mentorship program:

1. [Resource 1 – Link/Description]
2. [Resource 2 – Link/Description]
3. [Resource 3 – Link/Description]

Feel free to explore these resources and let your mentor know if you have any questions.

Warm regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "congratulations_completion",
    name: "Congratulations Completion",
    label: `Congratulations on successfully completing the mentorship program! Your commitment and effort have been remarkable.

Next Steps:

1. Download your certificate of completion: [Insert Link]
2. Continue engaging with your mentor for further guidance.
3. Share your experience with peers or upcoming participants.

We are proud of your achievements and look forward to seeing your continued growth.

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "motivational_message",
    name: "Motivational Message",
    label: `We wanted to send a quick message to encourage you in your mentorship journey. Remember that growth takes time, and every small step counts toward your success.

Keep up the great work, stay consistent, and don't hesitate to reach out to your mentor for guidance.

You’ve got this!

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "upcoming_event",
    name: "Upcoming Event",
    label: `We are excited to announce an upcoming event in our mentorship program:

- Event: [Event Name]
- Date & Time: [Insert Date & Time]
- Location/Link: [Insert Link or Venue]

This is a wonderful opportunity to connect with peers, mentors, and learn new skills. We encourage your participation.

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "missed_session_followup",
    name: "Missed Session Follow-up",
    label: `We noticed that you missed your recent mentorship session on [Date]. We understand that schedules can be busy, but staying on track is important for your growth.

Please reach out to your mentor to reschedule or catch up on the session materials.

Looking forward to seeing you in the next session!

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "assignment_reminder",
    name: "Assignment Reminder",
    label: `This is a reminder to complete the following assignment/task:

- Assignment: [Assignment Name]
- Due Date: [Insert Date]

Completing this task on time will help you stay on track with the mentorship program and gain the most value from your sessions.

If you have any questions or need support, please contact your mentor.

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
  {
    value: "program_announcement",
    name: "Program Announcement",
    label: `We are excited to share some updates regarding our mentorship program:

- [Update 1]
- [Update 2]
- [Update 3]

These changes aim to enhance your experience and provide better support throughout your journey.

Best regards,
[Your Name]
[Your Position]
[Organization Name]`,
  },
];

const MentorEmailFormView = ({ setView, handleClose, selectedApplicants }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // Pre-written Header
  const PREFIX = "Dear [Participant Name],\n\n";

  // Form Control
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      message: PREFIX,
    },
  });

  // Watch Message
  const watchMessage = watch("message");

  // Ensure PREFIX always exists
  useEffect(() => {
    if (!watchMessage.startsWith(PREFIX)) {
      setValue("message", PREFIX + watchMessage.replace(/^.*?\n\n/, ""));
    }
  }, [watchMessage, setValue]);

  const insertPreWritten = (text) => setValue("message", PREFIX + text);

  // On Submit Handler
  const onSubmit = async (data) => {
    try {
      // Send emails with mail merge
      await Promise.all(
        selectedApplicants.map((app) =>
          emailjs.send(
            "service_rrexxzy",
            "template_zxjvjc9",
            {
              from_name: data.name,
              from_email: data.email,
              subject: data.subject,
              message: data.message.replace("[Participant Name]", app.name),
              to_name: app.name,
              to_email: app.email,
            },
            "2E4m6SmAxA_qFfFN9"
          )
        )
      );

      // Reset form
      reset({ message: PREFIX });

      // Success Pop Up
      Swal.fire({
        icon: "success",
        title: "Emails Sent!",
        text: `Emails successfully sent to ${selectedApplicants.length} participants.`,
        confirmButtonColor: "#3b82f6",
      });

      // Prepare payload for server
      const payload = {
        name: user?.name || data.name,
        email: user?.email || data.email,
        phone: user?.phone || "", // optional if you track phone
        type: "Mentor",
        subject: data.subject,
        message_raw: data.message, // raw draft
        recipients: selectedApplicants.map((app) => ({
          to_name: app.name,
          to_id: app._id,
          to_email: app.email,
        })),
        sentAt: new Date().toISOString(),
      };

      // POST to your backend
      await axiosPublic.post("/MentorEmails", payload);

      // Reset selected applicants
      handleClose();

      // Close modal
      document.getElementById("Mentor_Mentees_Message_Modal")?.close();
    } catch (error) {
      console.error("Email send or logging failed:", error);
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
      {/* Name Input */}
      <FormInput
        label="Your Name"
        required
        placeholder="Your Name"
        register={register("name", { required: "Name is required" })}
        error={errors.name}
      />

      {/* Email Input - read-only */}
      <FormInput
        label="Your Email"
        required
        type="email"
        placeholder="Your Email"
        register={register("email", { required: "Email is required" })}
        error={errors.email}
        readOnly
      />

      {/* Subject Input */}
      <FormInput
        label="Subject"
        required
        placeholder="Subject"
        register={register("subject", { required: "Subject is required" })}
        error={errors.subject}
      />

      {/* Message Textarea */}
      <FormInput
        label="Message"
        required
        placeholder="Write your message..."
        as="textarea"
        rows={15}
        register={register("message", { required: "Message is required" })}
        error={errors.message}
        watch={watch}
        name="message"
        onChange={(e) => {
          const value = e.target.value.startsWith(PREFIX)
            ? e.target.value
            : PREFIX + e.target.value.replace(/^.*?\n\n/, "");
          setValue("message", value);
        }}
      />

      {/* Pre-written options */}
      <div className="flex flex-wrap gap-2 mt-2">
        {PRE_WRITTEN_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => insertPreWritten(opt.label)}
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200 transition cursor-pointer"
          >
            {opt.name}
          </button>
        ))}
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
          <FaPaperPlane /> {isSubmitting ? "Sending..." : "Send Email"}
        </button>
      </div>
    </form>
  );
};

// Prop Validation
MentorEmailFormView.propTypes = {
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

export default MentorEmailFormView;
