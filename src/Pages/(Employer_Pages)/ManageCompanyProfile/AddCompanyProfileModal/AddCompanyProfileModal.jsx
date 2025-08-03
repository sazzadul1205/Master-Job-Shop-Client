import { ImCross } from "react-icons/im";

const AddCompanyProfileModal = () => {
  return (
    <div className="modal-box min-w-3xl relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] p-6 text-black overflow-y-auto">
      {/* Close Button */}
      <button
        type="button"
        onClick={() =>
          document.getElementById("Add_Company_Profile_Modal").close()
        }
        className="absolute top-2 right-3 z-50 p-2 rounded-full hover:text-red-500 cursor-pointer transition-colors duration-300"
      >
        <ImCross className="text-xl" />
      </button>

      {/* Modal Title */}
      <h3 className="font-bold text-xl text-center mb-4">
        Create Company Profile{" "}
      </h3>
    </div>
  );
};

export default AddCompanyProfileModal;
