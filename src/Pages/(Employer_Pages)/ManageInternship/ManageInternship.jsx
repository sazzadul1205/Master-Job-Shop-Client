import { useState } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaPlus } from "react-icons/fa";

// Assets
import InternshipBlue from "../../../assets/EmployerLayout/Internship/InternshipBlue.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Modal
import AddNewInternshipModal from "./AddNewInternshipModal/AddNewInternshipModal";

const ManageInternship = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [selectedGigID, setSelectedGigID] = useState(null);
  const [selectedGigData, setSelectedGigData] = useState(null);

  // Company Data
  const {
    data: CompanyData,
    isLoading: CompanyIsLoading,
    error: CompanyError,
    refetch: CompanyRefetch,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () =>
      axiosPublic.get(`/Company?email=${user?.email}`).then((res) => res.data),
  });

  // Company Data Destructuring
  const company = CompanyData || {};

  // Refetching Data
  const refetch = () => {
    // GigsRefetch();
    CompanyRefetch();
  };

  // Loading / Error UI
  if (CompanyIsLoading || loading) return <Loading />;
  if (CompanyError) return <Error />;

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center py-3 px-5 ">
        {/* Title */}
        <h3 className="text-blue-700 font-bold text-2xl flex items-center gap-4">
          <img
            src={InternshipBlue}
            alt="Internship Blue Icon"
            className="w-8 h-8"
          />{" "}
          Manage Internships
        </h3>

        {/* Add New Internship Button */}
        <button
          onClick={() =>
            document.getElementById("Add_New_Internship_Modal").showModal()
          }
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Internship
        </button>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Add New Internship Modals */}
      <dialog id="Add_New_Internship_Modal" className="modal">
        <AddNewInternshipModal CompanyData={company} refetch={refetch} />
      </dialog>
    </>
  );
};

export default ManageInternship;
