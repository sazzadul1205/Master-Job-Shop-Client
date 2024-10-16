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
        {/* Gig Title */}
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

        {/* Client Name */}
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

        {/* Client Type */}
        <div className="mb-4">
          <label className="block text-black font-bold">Client Type:</label>
          <input
            type="text"
            {...register("clientType")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>

        {/* Gig Type */}
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

        {/* Location */}
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

        {/* Payment Rate */}
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

        {/* Duration */}
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

        {/* Responsibilities */}
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

        {/* Required Skills */}
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

        {/* Working Hours */}
        <div className="mb-4">
          <label className="block text-black font-bold">Working Hours:</label>
          <input
            type="text"
            {...register("workingHours")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>

        {/* Project Expectations */}
        <div className="mb-4">
          <label className="block text-black font-bold">
            Project Expectations:
          </label>
          <textarea
            {...register("projectExpectations")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>

        {/* Communication */}
        <div className="mb-4">
          <label className="block text-black font-bold">Communication:</label>
          <textarea
            {...register("communication")}
            className="border p-2 w-full mt-2 bg-white"
          />
        </div>

        {/* Additional Benefits */}
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Gig
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
