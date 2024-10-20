import { useForm } from "react-hook-form";
import { ImCross } from "react-icons/im";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../../../Provider/AuthProvider";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const ModalEditGig = ({ editGigData, refetch }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  // Prepopulate form with existing gig data for editing
  useEffect(() => {
    if (editGigData) {
      setValue("gigTitle", editGigData.gigTitle);
      setValue("clientName", editGigData.clientName);
      setValue("clientType", editGigData.clientType || "N/A");
      setValue("gigType", editGigData.gigType);
      setValue("location", editGigData.location);
      setValue("paymentRate", editGigData.paymentRate);
      setValue("duration", editGigData.duration);
      setValue("responsibilities", editGigData.responsibilities);
      setValue("requiredSkills", editGigData.requiredSkills);
      setValue("workingHours", editGigData.workingHours || "N/A");
      setValue("projectExpectations", editGigData.projectExpectations || "N/A");
      setValue("communication", editGigData.communication || "N/A");
      setValue("additionalBenefits", editGigData.additionalBenefits || "N/A");
      setValue("expirationDate", editGigData.expirationDate || "N/A");
    }
  }, [editGigData, setValue]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      postedDate: new Date().toISOString(),
      PostedBy: user.email,
    };

    try {
      const response = await axiosPublic.put(
        `/Posted-Gig/${editGigData._id}`,
        formattedData
      );
      console.log(response);

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Gig updated successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

      // Close the modal and refetch data
      document.getElementById("Edit_Gig").close();
      reset();
      refetch();
    } catch (error) {
      console.error("Error updating gig:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the gig. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="modal-box bg-white max-w-[800px] p-0">
      <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
        <p>Edit Gig</p>
        <button onClick={() => document.getElementById("Edit_Gig").close()}>
          <ImCross className="hover:text-gray-700" />
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
          <div key={name} className="flex items-center gap-2">
            <label className="font-bold w-56 text-xl">{label}:</label>
            {type === "textarea" ? (
              <textarea
                {...register(
                  name,
                  required ? { required: `${label} is required` } : {}
                )}
                placeholder={placeholder}
                className={`border p-2 w-full mt-2 bg-white ${
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
                className={`border p-2 w-full mt-2 bg-white ${
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

ModalEditGig.propTypes = {
  editGigData: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ModalEditGig;
