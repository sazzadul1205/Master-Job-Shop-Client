import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import FormInput from "../../../../../Shared/FormInput/FormInput";

const EmailFormView = ({ setView, selectedApplicants }) => {
  const PREFIX = "Dear [Applicant Name],\n\n";

  const [preWrittenOptions] = useState([
    {
      value: "followup_details",
      name: "Followup Details",
      label: `I hope this message finds you well.

Following your recent application, we would like to provide you with additional details regarding the next steps in our selection process. Kindly review the information carefully to ensure a smooth and timely progression:

1. Ensure that all the documents you submitted are complete and accurate.
2. Our team may request additional clarifications or information during the evaluation phase.
3. We will contact you regarding scheduled interviews, assessments, or other relevant activities.
4. Timely responses to any correspondence will help maintain your active status in the application process.

We greatly appreciate your interest in joining our organization and your continued engagement throughout this process. Should you have any questions, please do not hesitate to reach out.

Best regards,
[Your Name]
[Your Position]
[Your Organization]`,
    },
    {
      value: "thank_you",
      name: "Thank You",
      label: `Thank you for taking the time to submit your application to [Organization Name]. We genuinely appreciate your interest, effort, and dedication in applying for the position.

Our team is carefully reviewing all applications to ensure a thorough evaluation of each candidate. You can expect to receive feedback or next steps within [X] business days. 

In the meantime, if you have any questions or need further information, please feel free to reach out. We are here to support you throughout this process.

Warm regards,
[Your Name]
[Your Position]
[Your Organization]`,
    },
    {
      value: "next_steps",
      name: "Next Steps",
      label: `We are pleased to inform you that you have been shortlisted for the next stage of the application process at [Organization Name].

Please review the following important points to ensure you are prepared:

1. Complete any outstanding documentation or requirements at your earliest convenience.
2. Stay attentive to communications from our team, which may include interview schedules, assessments, or additional requests.
3. Respond promptly to any emails to maintain your position in the selection process.
4. Prepare any materials or information requested for upcoming stages.

Your application demonstrates promise, and we are excited to continue engaging with you throughout this process. Should you require any clarification, please do not hesitate to contact us.

Kind regards,
[Your Name]
[Your Position]
[Your Organization]`,
    },
    {
      value: "interview_invite",
      name: "Interview Invite",
      label: `We are pleased to invite you to an interview for the position you applied for at [Organization Name]. 

Please review the following details carefully:

1. Interview Date & Time: [Insert Date & Time]
2. Mode: [In-person / Online – include link if online]
3. Required Documents: Please bring or prepare [list documents or materials].
4. Contact: For any questions, reach out to [Contact Name/Email].

We look forward to speaking with you and learning more about your experience and skills.

Best regards,
[Your Name]
[Your Position]
[Your Organization]`,
    },
    {
      value: "document_request",
      name: "Document Request",
      label: `We noticed that some documents or information are missing from your application at [Organization Name]. 

To ensure your application is fully considered, please provide the following by [Deadline]:

1. [Document / Information 1]
2. [Document / Information 2]
3. Any other relevant details as requested.

Timely submission will help us proceed with the review process without delays. If you have any questions, please do not hesitate to contact us.

Kind regards,
[Your Name]
[Your Position]
[Your Organization]`,
    },
    {
      value: "congratulations_shortlist",
      name: "Congratulations Shortlist",
      label: `Congratulations! 

We are excited to inform you that you have been shortlisted for the next stage of the recruitment process at [Organization Name]. 

Next Steps:

1. Prepare for the upcoming interview/assessment scheduled on [Insert Date].
2. Review any materials or instructions shared by our team.
3. Ensure all your contact details are up-to-date.

We appreciate your continued interest in joining [Organization Name] and look forward to engaging with you further.

Warm regards,
[Your Name]
[Your Position]
[Your Organization]`,
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: PREFIX,
    },
  });

  const watchMessage = watch("message");

  // Ensure PREFIX always exists
  useEffect(() => {
    if (!watchMessage.startsWith(PREFIX)) {
      setValue("message", PREFIX + watchMessage.replace(/^.*?\n\n/, ""));
    }
  }, [watchMessage, setValue]);

  const onSubmit = async (data) => {
    try {
      await Promise.all(
        selectedApplicants.map((app) =>
          emailjs.send(
            "service_rrexxzy",
            "template_zxjvjc9",
            {
              from_name: data.name,
              from_email: data.email,
              subject: data.subject,
              message: data.message,
              to_name: app.name,
              to_email: app.email,
            },
            "2E4m6SmAxA_qFfFN9"
          )
        )
      );

      reset({ message: PREFIX });

      Swal.fire({
        icon: "success",
        title: "Emails Sent!",
        text: "Professional emails have been sent successfully to all selected applicants.",
        confirmButtonColor: "#3b82f6",
      });

      document.getElementById("Mentor_Mentees_Message_Modal")?.close();
    } catch (error) {
      console.error("Email send failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const insertPreWritten = (text) => {
    setValue("message", PREFIX + text);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-6 flex flex-col gap-4 text-black"
    >
      {/* Name Input */}
      <FormInput
        label="Your Name"
        required
        placeholder="Your Name"
        register={register("name", { required: "Name is required" })}
        error={errors.name}
      />

      {/* Email Input */}
      <FormInput
        label="Your Email"
        required
        type="email"
        placeholder="Your Email"
        register={register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
        })}
        error={errors.email}
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
          let value = e.target.value;
          if (!value.startsWith(PREFIX))
            value = PREFIX + value.replace(/^.*?\n\n/, "");
          setValue("message", value);
        }}
      />

      {/* Pre-written options */}
      <div className="flex flex-wrap gap-2 mt-2">
        {preWrittenOptions.map((opt) => (
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
      <div className="flex justify-between mt-4">
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
          className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPaperPlane /> {isSubmitting ? "Sending..." : "Send Email"}
        </button>
      </div>
    </form>
  );
};

export default EmailFormView;
