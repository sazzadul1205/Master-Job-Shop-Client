import { ImCross } from "react-icons/im";

const EditJobModal = ({ selectedJobData }) => {
  console.log(selectedJobData);

  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() => document.getElementById("Edit_Job_Modal").close()}
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">Add New Job</h3>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mb-4" />
    </div>
  );
};

export default EditJobModal;
