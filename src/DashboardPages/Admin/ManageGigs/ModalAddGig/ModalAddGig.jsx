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

  const onSubmit = async (data) => {
    const formattedData = {
      gigTitle: data.gigTitle,
      clientName: data.clientName,
      clientType: data.clientType || "N/A",
      gigType: data.gigType,
      location: data.location,
      paymentRate: data.paymentRate,
      duration: data.duration,
      rating: "0",
      responsibilities: data.responsibilities,
      requiredSkills: data.requiredSkills,
      workingHours: data.workingHours || "N/A",
      projectExpectations: data.projectExpectations || "N/A",
      communication: data.communication || "N/A",
      additionalBenefits: data.additionalBenefits || "N/A",
      postedDate: new Date().toISOString(),
      PostedBy: user.email,
      peopleBided: [],
      ApproveState: "InProgress",
    };

    try {
      const response = await axiosPublic.post("/Posted-Gig", formattedData);

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Gig posted successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

      // Optionally close the modal here if needed
      document.getElementById("Create_New_Gig").close();
      reset();
      refetch();

      console.log("Job posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting gig:", error);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "There was an error posting the gig. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
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
        <div className="mb-4">
          <label className="block text-black font-bold">Gig Title:</label>
          <input
            type="text"
            {...register("gigTitle", { required: "Gig Title is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.gigTitle ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.gigTitle && (
            <span className="text-red-500">{errors.gigTitle.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Client Name:</label>
          <input
            type="text"
            {...register("clientName", { required: "Client Name is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.clientName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.clientName && (
            <span className="text-red-500">{errors.clientName.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Client Type:</label>
          <input
            type="text"
            {...register("clientType")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Gig Type:</label>
          <input
            type="text"
            {...register("gigType", { required: "Gig Type is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.gigType ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.gigType && (
            <span className="text-red-500">{errors.gigType.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Location:</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.location && (
            <span className="text-red-500">{errors.location.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Payment Rate:</label>
          <input
            type="text"
            {...register("paymentRate", {
              required: "Payment Rate is required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.paymentRate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.paymentRate && (
            <span className="text-red-500">{errors.paymentRate.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Duration:</label>
          <input
            type="text"
            {...register("duration", { required: "Duration is required" })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.duration && (
            <span className="text-red-500">{errors.duration.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">
            Responsibilities:
          </label>
          <textarea
            {...register("responsibilities", {
              required: "Responsibilities are required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.responsibilities ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.responsibilities && (
            <span className="text-red-500">
              {errors.responsibilities.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Required Skills:</label>
          <textarea
            {...register("requiredSkills", {
              required: "Required Skills are required",
            })}
            className={`border p-2 w-full mt-2 bg-white ${
              errors.requiredSkills ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.requiredSkills && (
            <span className="text-red-500">
              {errors.requiredSkills.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Working Hours:</label>
          <input
            type="text"
            {...register("workingHours")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">
            Project Expectations:
          </label>
          <textarea
            {...register("projectExpectations")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">Communication:</label>
          <textarea
            {...register("communication")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-black font-bold">
            Additional Benefits:
          </label>
          <textarea
            {...register("additionalBenefits")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalAddGig;

// PropTypes validation
ModalAddGig.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  refetch: PropTypes.func.isRequired, // Add refetch to prop types
};
