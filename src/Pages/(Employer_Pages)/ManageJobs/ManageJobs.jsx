// Icons
import { FaPlus } from "react-icons/fa";

// Modal
import AddNewJobModal from "./AddNewJobModal/AddNewJobModal";

const ManageJobs = () => {
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl ">Manage My Jobs</h3>

        {/* Add New Job Button */}
        <button
          onClick={() =>
            document.getElementById("Add_New_Job_Modal").showModal()
          }
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Job
        </button>
      </div>

      {/* Divider */}
      <div className="p-[1px] bg-blue-500 mx-5" />

      <dialog id="Add_New_Job_Modal" className="modal">
        <AddNewJobModal />
      </dialog>
    </>
  );
};

export default ManageJobs;
