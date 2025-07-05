import { ImCross } from "react-icons/im";

const JobDetailsModal = ({ selectedJobID, setSelectedJobID }) => {
  console.log(selectedJobID);

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Add New Note</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setSelectedJobID("");
            document.getElementById("Jobs_Details_Modal")?.close();
          }}
        />
      </div>
    </div>
  );
};

export default JobDetailsModal;
