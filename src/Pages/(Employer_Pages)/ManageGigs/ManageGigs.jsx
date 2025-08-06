// Icons
import { FaPlus } from "react-icons/fa";

// Assets
import GigBlue from "../../../assets/EmployerLayout/Gig/GigBlue.png";
import AddNewGigModal from "./AddNewGigModal/AddNewGigModal";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

const ManageGigs = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

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
    // JobsRefetch();
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
          <img src={GigBlue} alt="Gig Blue Icon" className="w-8 h-8" /> Manage
          Gigs
        </h3>

        {/* Add New Gig Button */}
        <button
          onClick={() =>
            document.getElementById("Add_New_Gig_Modal").showModal()
          }
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Gig
        </button>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Add New Gig Modals */}
      <dialog id="Add_New_Gig_Modal" className="modal">
        <AddNewGigModal CompanyData={company} refetch={refetch} />
      </dialog>
    </>
  );
};

export default ManageGigs;
