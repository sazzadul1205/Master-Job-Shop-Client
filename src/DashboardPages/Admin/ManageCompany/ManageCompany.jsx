import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaSearch } from "react-icons/fa";
import { CiViewBoard } from "react-icons/ci";
import { useState } from "react";
import ModalViewCompany from "./ModalViewCompany/ModalViewCompany";

const ManageCompany = () => {
  const axiosPublic = useAxiosPublic();
  const [viewCompanyData, setViewCompanyData] = useState(null);

  // Fetching Company Profile Data
  const {
    data: CompanyProfileData = [], // Default to empty array
    isLoading: CompanyProfileDataIsLoading,
    error: CompanyProfileDataError,
  } = useQuery({
    queryKey: ["CompanyProfileData"],
    queryFn: () => axiosPublic.get(`/Company-Profiles`).then((res) => res.data),
  });

  // Loading state
  if (CompanyProfileDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CompanyProfileDataError) {
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

  // Handle view gig
  const handleViewCompany = (gig) => {
    setViewCompanyData(gig); // Set the selected gig details
    document.getElementById("Modal_Company_View").showModal(); // Show the modal
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Company Profiles
      </p>

      {/* Search */}
      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input type="text" className="grow" placeholder="Search" />
            <FaSearch />
          </label>
        </div>
      </div>

      {/* Company Profile Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Company Name</th>
              <th>Industry</th>
              <th>Location</th>
              <th>Founding Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping through fetched CompanyProfileData */}
            {CompanyProfileData.map((company, index) => (
              <tr key={company._id}>
                <td>{index + 1}</td>
                <td>{company?.companyName}</td>
                <td>{company?.industry}</td>
                <td>{company?.location}</td>
                <td>{company?.postedBy}</td>

                <td>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                      onClick={() => handleViewCompany(company)}
                    >
                      <CiViewBoard />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View gig modal */}
      <dialog id="Modal_Company_View" className="modal">
        <ModalViewCompany CompanyData={viewCompanyData} />
      </dialog>
    </div>
  );
};

export default ManageCompany;
