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
import InternshipCard from "../../../Shared/InternshipCard/InternshipCard";

// Modal
import EditInternshipModal from "./EditInternshipModal/EditInternshipModal";
import AddNewInternshipModal from "./AddNewInternshipModal/AddNewInternshipModal";
import InternshipDetailsModal from "../../(Public_Pages)/Home/FeaturedInternships/InternshipDetailsModal/InternshipDetailsModal";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";

const ManageInternship = () => {
  const { user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();

  // State Management
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);
  const [selectedInternshipData, setSelectedInternshipData] = useState(null);

  // Internship Data
  const {
    data: InternshipData,
    isLoading: InternshipIsLoading,
    error: InternshipError,
    refetch: InternshipRefetch,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(
          `/Internship?postedBy=${user?.email}`
        );
        const data = res.data;

        if (Array.isArray(data)) return data;
        if (data && typeof data === "object") return [data]; // wrap single object in array
        return [];
      } catch (err) {
        if (err.response?.status === 404) return []; // no Internship found
        return []; // fallback for other cases too
      }
    },
    enabled: !!user?.email, // prevents running before user is loaded
  });

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
    InternshipRefetch();
    CompanyRefetch();
  };

  // Loading / Error UI
  if (CompanyIsLoading || InternshipIsLoading || loading) return <Loading />;
  if (CompanyError || InternshipError) return <Error />;

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
          onClick={() => {
            if (!company?._id) {
              // Company data missing: show warning
              document
                .getElementById("Company_Profile_Warning_Modal")
                .showModal();
            } else {
              // Company data present: show Add New Job modal
              document.getElementById("Add_New_Internship_Modal").showModal();
            }
          }}
          className="flex items-center gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
        >
          <FaPlus />
          Add New Internship
        </button>
      </div>

      {/* Divider */}
      <div className="py-[1px] w-full bg-blue-700 my-1" />

      {/* Internships Display */}
      <div className="py-3 px-5">
        {InternshipData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {InternshipData.map((internship) => (
              <div key={internship._id}>
                <InternshipCard
                  internship={internship}
                  poster={true}
                  refetch={refetch}
                  setSelectedInternshipID={setSelectedInternshipID}
                  setSelectedInternshipData={setSelectedInternshipData}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-black text-2xl font-medium bg-white/10 rounded p-6">
            {/* Title */}
            <h3>No Internship postings available at the moment.</h3>

            {/* Content */}
            <p className="text-lg text-gray-800 mt-2 w-3xl mx-auto">
              You haven’t posted any internships yet. Share a new opportunity to
              attract talented interns eager to learn and contribute to your
              projects.
            </p>

            {/* Add New Internship Button */}
            <div className="flex justify-center pt-5">
              <button
                onClick={() => {
                  if (!company?._id) {
                    // Company data missing: show warning
                    document
                      .getElementById("Company_Profile_Warning_Modal")
                      .showModal();
                  } else {
                    // Company data present: show Add New Job modal
                    document
                      .getElementById("Add_New_Internship_Modal")
                      .showModal();
                  }
                }}
                className="flex items-center text-lg gap-2 border-2 border-blue-700 font-semibold text-blue-700 rounded shadow-xl px-10 py-2 cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-500"
              >
                <FaPlus />
                Add New Internship
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Internship Modals */}
      <dialog id="Add_New_Internship_Modal" className="modal">
        <AddNewInternshipModal CompanyData={company} refetch={refetch} />
      </dialog>

      {/* Edit Internship Modals */}
      <dialog id="Edit_Internship_Modal" className="modal">
        <EditInternshipModal
          refetch={refetch}
          selectedInternshipData={selectedInternshipData}
        />
      </dialog>

      {/* Internship Details Modal */}
      <dialog id="Internship_Details_Modal" className="modal">
        <InternshipDetailsModal
          poster={true}
          selectedInternshipID={selectedInternshipID}
          setSelectedInternshipID={setSelectedInternshipID}
        />
      </dialog>

      {/* If No Company Profile Warning */}
      <dialog id="Company_Profile_Warning_Modal" className="modal">
        <div className="modal-box min-w-[24rem] max-w-xl mx-auto max-h-[90vh] p-8 bg-white rounded-lg shadow-lg relative overflow-y-auto text-gray-900 flex flex-col items-center text-center">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              document.getElementById("Company_Profile_Warning_Modal").close();
            }}
            className="absolute top-3 right-3 z-50 bg-gray-50 hover:bg-gray-200 p-2 rounded-full"
          >
            <ImCross className="text-xl text-black hover:text-red-500 cursor-pointer" />
          </button>

          <h3 className="text-xl font-semibold mb-4 text-red-700">
            Please Create Your Company Profile First
          </h3>
          <p className="mb-8 text-gray-700 leading-relaxed max-w-md">
            You need to set up your company profile before posting jobs. This
            helps you showcase your business and attract the right candidates.
          </p>

          <Link
            to={"/Employer/CompanyProfile"}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              document.getElementById("Company_Profile_Warning_Modal").close();
            }}
          >
            Make My Profile Now
          </Link>
        </div>
      </dialog>
    </>
  );
};

export default ManageInternship;
