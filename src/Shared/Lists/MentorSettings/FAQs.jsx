export const FAQs = [
  {
    question: "How do I create a new mentorship program?",
    answer: (
      <div className="space-y-2">
        <p>
          Go to <strong>My Mentorship &rarr; Create Mentorship</strong> and fill
          in the required details:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>
            <strong>Title:</strong> Give your mentorship program a clear and
            descriptive title.
          </li>
          <li>
            <strong>Description:</strong> Explain the purpose, topics, and
            expected outcomes.
          </li>
          <li>
            <strong>Duration:</strong> Specify how long mentees will work with
            you.
          </li>
          <li>
            <strong>Fees:</strong> Set your pricing or mark it as free if
            applicable.
          </li>
          <li>
            <strong>Availability:</strong> Choose time slots when you can meet
            mentees.
          </li>
        </ul>
        <p>
          Once saved, your mentorship will be listed in{" "}
          <strong>My Mentorship</strong> and visible to potential mentees.
        </p>
      </div>
    ),
  },
  {
    question: "Can I edit or delete an existing mentorship?",
    answer: (
      <div className="space-y-2">
        <p>
          Yes. Navigate to <strong>My Mentorship</strong>, select the
          mentorship, and use the following options:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>
            <strong>Edit:</strong> Update the title, description, duration,
            fees, or availability.
          </li>
          <li>
            <strong>Delete:</strong> Permanently remove the mentorship.{" "}
            <strong>Note:</strong> All existing applications for this mentorship
            will also be deleted.
          </li>
        </ul>
        <p>
          Always double-check before deleting to avoid losing important data.
        </p>
      </div>
    ),
  },
  {
    question: "How do I view mentorship applications?",
    answer: (
      <div className="space-y-2">
        <p>
          Go to{" "}
          <strong>My Mentorship Applications &rarr; View Applicants</strong>.
          Here you can:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>See all mentee applications (pending, approved, rejected).</li>
          <li>
            Review each applicant’s profile, experience, and message history.
          </li>
          <li>
            Approve or reject applications, optionally sending a personalized
            message.
          </li>
        </ul>
        <p>
          Use the filters to sort by application date or status for easier
          management.
        </p>
      </div>
    ),
  },
  {
    question: "How can I manage course applications?",
    answer: (
      <div className="space-y-2">
        <p>
          Navigate to{" "}
          <strong>My Course Applications &rarr; Manage Applicants</strong>. You
          can:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>Approve or reject course applicants individually or in bulk.</li>
          <li>
            Send updates and notifications to students about their application
            status.
          </li>
          <li>
            Track overall enrollment and waiting lists for popular courses.
          </li>
        </ul>
        <p>
          Pro tip: Communicate with rejected applicants courteously—they may be
          interested in future courses.
        </p>
      </div>
    ),
  },
  {
    question: "How do I schedule sessions with mentees or students?",
    answer: (
      <div className="space-y-2">
        <p>
          Go to <strong>Scheduled & Sessions</strong> to manage your mentorship
          and course sessions:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>View your calendar with all upcoming sessions.</li>
          <li>
            Add new sessions by selecting date, time, duration, and
            participants.
          </li>
          <li>
            Enable automatic reminders for mentees via email or in-app
            notifications.
          </li>
        </ul>
        <p>
          Tip: Always keep your availability updated to avoid double bookings
          and missed sessions.
        </p>
      </div>
    ),
  },
  {
    question: "How can I message or email multiple mentees at once?",
    answer: (
      <div className="space-y-2">
        <p>
          Go to <strong>Mentees</strong> → <strong>Bulk Message</strong> or{" "}
          <strong>Bulk Email</strong>. Steps:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>Select recipients (all or filtered by program).</li>
          <li>Compose your message or email with personalization options.</li>
          <li>Send and track delivery or read status if available.</li>
        </ul>
        <p>
          Note: For individual messages, click on a mentees profile and use the
          direct message/email options.
        </p>
      </div>
    ),
  },
  {
    question: "How do I report a problem or provide feedback?",
    answer: (
      <div className="space-y-2">
        <p>
          Visit <strong>Support & Help &rarr; Report a Problem</strong>. You
          can:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>
            Submit bug reports detailing the issue, screenshots, and steps to
            reproduce.
          </li>
          <li>
            Send general feedback or suggestions for platform improvements.
          </li>
        </ul>
        <p>
          Our support team will review your report and respond promptly via
          email or in-app notification.
        </p>
      </div>
    ),
  },
  {
    question: "Can I download my account data or deactivate my account?",
    answer: (
      <div className="space-y-2">
        <p>
          Go to <strong>Settings &rarr; Security & Data</strong>:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>
            Download a complete copy of your data for record-keeping or
            compliance.
          </li>
          <li>
            Deactivate or delete your account permanently. This will remove all
            mentorships, courses, and applications associated with your account.
          </li>
        </ul>
        <p>
          Important: Deletion is irreversible, so ensure you have downloaded any
          necessary data first.
        </p>
      </div>
    ),
  },
  {
    question: "What should I do if I forget my password?",
    answer: (
      <div className="space-y-2">
        <p>
          Click <strong>Forgot Password?</strong> on the login page. Enter your
          registered email address:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>Receive a password reset email with a secure link.</li>
          <li>
            Click the link and create a new password that meets security
            requirements.
          </li>
          <li>
            Log in with the new password and update your saved credentials.
          </li>
        </ul>
        <p>Tip: Use a password manager for better security and convenience.</p>
      </div>
    ),
  },
  {
    question: "How can I update my profile or contact information?",
    answer: (
      <div className="space-y-2">
        <p>
          Navigate to <strong>Profile &rarr; Mentor Profile</strong>:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>Edit your name, bio, profile picture, and social links.</li>
          <li>
            Update email and phone number to receive notifications and messages.
          </li>
          <li>Changes are saved immediately and visible to mentees.</li>
        </ul>
        <p>
          Tip: Keep your profile professional and up-to-date to attract more
          mentees.
        </p>
      </div>
    ),
  },
  {
    question: "How do I customize my dashboard or platform appearance?",
    answer: (
      <div className="space-y-2">
        <p>
          Go to <strong>Settings &rarr; Platform Customization</strong>:
        </p>
        <ul className="list-disc list-inside ml-5 space-y-1">
          <li>Choose between Light or Dark mode for better visibility.</li>
          <li>
            Rearrange dashboard widgets to prioritize the information you need
            most.
          </li>
          <li>Select your preferred language for a localized experience.</li>
        </ul>
      </div>
    ),
  },
];
