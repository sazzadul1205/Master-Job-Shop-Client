import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useForm } from "react-hook-form";
import PageData from "./PageData/PageData";
import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import ModalEditCompanyProfile from "./ModalEditCompanyProfile/ModalEditCompanyProfile";
import ModalNewCompanyProfile from "./ModalNewCompanyProfile/ModalNewCompanyProfile";

const MangeCompanyInfo = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [editCompanyProfileData, setEditCompanyProfileData] = useState(null);
  const [selectedCompanyProfile, setSelectedCompanyProfile] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Fetch CompanyProfiles data
  const {
    data: ManageCompanyProfiles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ManageCompanyProfiles"],
    queryFn: () =>
      axiosPublic
        .get(`/Company-Profiles?postedBy=${user.email}`)
        .then((res) => res.data),
  });

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-300 to-white">
        <p className="text-center text-red-500 font-bold text-3xl mb-8">
          Something went wrong. Please reload the page.
        </p>
        <button
          className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  // Handle Edit Company Profiles
  const handleEditCompanyProfiles = (company) => {
    setEditCompanyProfileData(company[0]); // Set the company profile data for editing
    document.getElementById("Edit_Company_Profiles_Modal").showModal();
  };

  // Handle Single Delete
  const handleSingleDelete = (profileId) => {
    setSelectedCompanyProfile([profileId]);
    setShowDeleteModal(true);
  };

  // Format date for delete log
  const formattedDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Submit delete form
  const onSubmit = async (data) => {
    const deleteProfileLogData = selectedCompanyProfile.map((profileId) => {
      const profile = ManageCompanyProfiles.find(
        (profile) => profile._id === profileId
      );
      return {
        DeletedBy: user.email,
        PostedBy: profile.postedBy,
        DeletedDate: formattedDateTime,
        Type: "Company Profiles",
        deletedContent: profile.companyName,
        reason: data.deleteReason,
      };
    });

    try {
      // Log the deletion
      await axiosPublic.post(`/Delete-Log`, deleteProfileLogData);

      // Delete the selected company profiles
      await axiosPublic.delete(`/Company-Profiles/delete`, {
        data: { profilesToDelete: selectedCompanyProfile },
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Company profiles successfully deleted.",
        confirmButtonText: "Okay",
      });
      reset();
      setShowDeleteModal(false);
      setSelectedCompanyProfile([]);
      refetch(); // Refetch the updated data
    } catch (error) {
      console.error("Error deleting company profiles:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete company profiles. Please try again.",
        confirmButtonText: "Okay",
      });
    }
  };

  // Check if there are no company profiles available
  if (ManageCompanyProfiles.length === 0) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <div className="bg-white p-8 shadow-lg rounded-lg">
            <p className="text-center text-gray-800 font-bold text-2xl mb-4">
              No Company Profile Found
            </p>
            <p className="text-center text-gray-600 mb-4">
              Please create a company profile to manage your company
              information.
            </p>
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition duration-300"
              onClick={() =>
                document
                  .getElementById("Create_New_Company_Profile")
                  .showModal()
              }
            >
              Create Company Profile
            </button>
          </div>
        </div>

        {/* Modal Create a new Company Profile */}
        <dialog id="Create_New_Company_Profile" className="modal rounded-none">
          <ModalNewCompanyProfile refetch={refetch} />
        </dialog>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Top Section */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Company Info
      </p>

      {/* Edit and Delete Button */}
      <div className="flex justify-between items-center px-5 pt-2">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleEditCompanyProfiles(ManageCompanyProfiles)}
        >
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 text-white text-xl font-bold flex items-center justify-center w-36 py-1"
          onClick={() => handleSingleDelete(ManageCompanyProfiles[0]._id)} // assuming deletion for the first profile, update logic as necessary
        >
          <MdDelete className="mr-2" />
          Delete
        </button>
      </div>

      <PageData ManageCompanyProfiles={ManageCompanyProfiles}></PageData>

      {/* Edit Company Profile Modal */}
      <dialog id="Edit_Company_Profiles_Modal" className="modal">
        <ModalEditCompanyProfile
          CompanyProfileData={editCompanyProfileData}
          refetch={refetch}
        />
      </dialog>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[800px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Company Profiles</h2>
            <p>Selected Company Profiles:</p>
            <ul className="mb-4">
              {selectedCompanyProfile.map((profileId) => {
                const profile = ManageCompanyProfiles.find(
                  (profile) => profile._id === profileId
                );
                return <li key={profileId}>{profile?.companyName}</li>;
              })}
            </ul>
            <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
                className="textarea textarea-bordered w-full bg-white border-black h-40"
                placeholder="Enter the reason for deletion"
                {...register("deleteReason", { required: true })}
              ></textarea>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-400 px-4 py-2 text-white font-bold mt-4"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 hover:bg-gray-400 px-4 py-2 text-white font-bold mt-4 ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangeCompanyInfo;
