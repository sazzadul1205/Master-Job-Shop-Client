import PropTypes from "prop-types";
import { FaFileExport, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";

const ProfileDanger = ({ user, refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Delete Account Handler
  const confirmDelete = async () => {
    await Swal.fire({
      title: "Delete Account?",
      html: `
       <div class="text-left">
         <p class="text-sm text-gray-600 mb-1">
           This action is <span class="font-semibold text-red-600">irreversible</span>. To confirm, please type the phrase exactly as shown:
         </p>
         <p class="text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded px-3 py-2 mb-3">
           Delete My Account
         </p>
         <input
           id="delete-input"
           class="swal2-input w-full text-sm placeholder-gray-400 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded"
           placeholder="Delete My Account"
         />
         <div class="flex items-start gap-2 mt-3">
           <input type="checkbox" id="confirm-check" class="mt-1 accent-blue-600" />
           <label for="confirm-check" class="text-sm text-gray-700 leading-snug">
             I confirm that I want to permanently delete my account and understand this action cannot be undone.
           </label>
         </div>
       </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Account",

      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const input = document.getElementById("delete-input");
        const checkbox = document.getElementById("confirm-check");

        confirmBtn.disabled = true;

        const checkValidity = () => {
          confirmBtn.disabled = !(
            input.value.trim() === "Delete My Account" && checkbox.checked
          );
        };

        input.addEventListener("input", checkValidity);
        checkbox.addEventListener("change", checkValidity);
      },
      preConfirm: () => {
        const input = document.getElementById("delete-input").value.trim();
        const checkbox = document.getElementById("confirm-check").checked;

        if (input !== "Delete My Account" || !checkbox) {
          Swal.showValidationMessage(
            "You must type 'Delete My Account' and check the confirmation box."
          );
          return false;
        }
        return true;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call your DELETE Soft Delete API endpoint
          await axiosPublic.delete(`/Users/SoftDelete/${user._id}`);

          // Show success message
          await Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Your account has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          });

          refetch();
        } catch (error) {
          console.error(error);
          await Swal.fire({
            icon: "error",
            title: "Failed to Delete",
            text: "There was an error deleting your account. Please try again later.",
          });
        }
      }
    });
  };

  const confirmExport = async () => {
    const result = await Swal.fire({
      title: "Export Your Data?",
      text: "We'll prepare a downloadable package of your account information.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Export Now",
    });

    if (result.isConfirmed) {
      const json = JSON.stringify(user, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${user?.fullName || "my-profile"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mt-6">
      {/* Danger Zone Header */}
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Danger Zone</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Delete Account Button */}
        <button
          onClick={confirmDelete}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          <FaTrashAlt />
          Delete Account
        </button>

        {/* Export Button */}
        <button
          onClick={confirmExport}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
        >
          <FaFileExport />
          Export My Data
        </button>
      </div>
    </div>
  );
};

// Prop Validation
ProfileDanger.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
  }).isRequired,
  refetch: PropTypes.func,
};

export default ProfileDanger;
