import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalAddGig = ({ refetch }) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Date and Time
  const formattedDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const onSubmit = async (data) => {
    const formattedData = {
      gigTitle: data.gigTitle,
      clientName: data.clientName,
      clientType: data.clientType,
      gigType: data.gigType,
      location: data.location,
      paymentRate: data.paymentRate,
      duration: data.duration,
      rating: "0",
      responsibilities: data.responsibilities,
      requiredSkills: data.requiredSkills,
      workingHours: data.workingHours,
      projectExpectations: data.projectExpectations,
      communication: data.communication,
      additionalBenefits: data.additionalBenefits,
      postedDate: formattedDateTime,
      expirationDate: data.expirationDate,
      PostedBy: user.email,
      peopleBided: [],
      state: "In-Progress",
    };

    try {
      await axiosPublic.post("/Posted-Gig", formattedData);
      Swal.fire("Success!", "Gig posted successfully!", "success");
      document.getElementById("Create_New_Gig").close();
      reset();
      refetch();
    } catch (error) {
      console.log(error);

      Swal.fire("Error!", "Error posting gig. Try again.", "error");
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Add New Gig</p>
        <button
          onClick={() => document.getElementById("Create_New_Gig").close()}
        >
          <ImCross className="hover:text-black font-bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        {[
          {
            label: "Gig Title",
            name: "gigTitle",
            type: "text",
            required: true,
            placeholder: "Enter the gig title (e.g., Web Developer)",
          },
          {
            label: "Client Name",
            name: "clientName",
            type: "text",
            required: true,
            placeholder: "Enter client's name (e.g., John Doe)",
          },
          {
            label: "Client Type",
            name: "clientType",
            type: "text",
            placeholder: "Enter the type of client (e.g., Individual, Company)",
          },
          {
            label: "Gig Type",
            name: "gigType",
            type: "text",
            required: true,
            placeholder: "Enter the gig type (e.g., Full-time, Freelance)",
          },
          {
            label: "Location",
            name: "location",
            type: "text",
            required: true,
            placeholder: "Enter location (e.g., Remote, New York)",
          },
          {
            label: "Payment Rate",
            name: "paymentRate",
            type: "text",
            required: true,
            placeholder: "Enter payment rate (e.g., $50/hr)",
          },
          {
            label: "Duration",
            name: "duration",
            type: "text",
            required: true,
            placeholder: "Enter the duration (e.g., 3 months)",
          },
          {
            label: "Responsibilities",
            name: "responsibilities",
            type: "textarea",
            required: true,
            placeholder:
              "List the responsibilities (e.g., Develop web apps, ...) ",
          },
          {
            label: "Required Skills",
            name: "requiredSkills",
            type: "textarea",
            required: true,
            placeholder:
              "List required skills (e.g., JavaScript, React, Node.js)",
          },
          {
            label: "Working Hours",
            name: "workingHours",
            type: "text",
            placeholder: "Enter working hours (e.g., 9 AM - 5 PM)",
          },
          {
            label: "Project Expectations",
            name: "projectExpectations",
            type: "textarea",
            placeholder: "Enter any project expectations or deliverables",
          },
          {
            label: "Communication",
            name: "communication",
            type: "textarea",
            placeholder: "Preferred communication (e.g., Slack, Email)",
          },
          {
            label: "Additional Benefits",
            name: "additionalBenefits",
            type: "textarea",
            placeholder:
              "List any additional benefits (e.g., Health Insurance)",
          },
          {
            label: "Expiration Date",
            name: "expirationDate",
            type: "date",
          },
        ].map(({ label, name, type, required, placeholder }) => (
          <div
            key={name}
            className="flex flex-col md:flex-row md:items-center gap-1 mt-3"
          >
            <label className="font-bold w-56 text-xl">{label}:</label>
            {type === "textarea" ? (
              <textarea
                {...register(
                  name,
                  required ? { required: `${label} is required` } : {}
                )}
                placeholder={placeholder}
                className={`border p-5 w-full bg-white  ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
            ) : (
              <input
                type={type}
                {...register(
                  name,
                  required ? { required: `${label} is required` } : {}
                )}
                placeholder={placeholder}
                className={`border p-5 w-full bg-white  ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
            {errors[name] && (
              <span className="text-red-500">{errors[name]?.message}</span>
            )}
          </div>
        ))}

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-14"
          >
            Post Gig
          </button>
        </div>
      </form>
    </div>
  );
};

ModalAddGig.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default ModalAddGig;
