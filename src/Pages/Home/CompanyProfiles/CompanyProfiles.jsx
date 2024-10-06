import { useState } from "react";
import { FaArrowRight, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import Loader from "../../Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const CompanyProfiles = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Fetching CompanyProfilesData
  const {
    data: CompanyProfilesData,
    isLoading: CompanyProfilesDataIsLoading,
    error: CompanyProfilesDataError,
  } = useQuery({
    queryKey: ["CompanyProfilesData"],
    queryFn: () => axiosPublic.get(`/Company-Profiles`).then((res) => res.data),
  });

  // Loading state
  if (CompanyProfilesDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (CompanyProfilesDataError) {
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

  const openModal = (company) => {
    setSelectedCompany(company);
    const modal = document.getElementById("Company_Profiles_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("Company_Profiles_view");
    modal.close();
    setSelectedCompany(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex items-center pt-20 px-5">
          <div className="">
            <p className="text-5xl font-bold italic text-blue-700">
              Company Profiles
            </p>
            <p className="text-xl">
              Discover companies and their career opportunities.
            </p>
          </div>
          <button className="ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/CompanyProfiles"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Company Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {CompanyProfilesData.slice(0, 6).map((company, index) => {
            const {
              companyName,
              location,
              industry,
              website,
              logo,
              description,
            } = company;

            return (
              <div
                key={index}
                className="card bg-white w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl"
              >
                <div className="card-body">
                  {/* Company Logo */}
                  {logo && (
                    <img
                      src={logo}
                      alt={`${companyName} Logo`}
                      className="w-full h-32 object-cover mb-4"
                    />
                  )}

                  {/* Company Name */}
                  <p className="font-bold text-2xl">{companyName}</p>

                  {/* Location */}
                  <p className="text-gray-500">{location}</p>

                  {/* Industry */}
                  <p className="text-blue-500 font-semibold">
                    Industry: {industry}
                  </p>

                  {/* Website */}
                  {website && (
                    <p className="text-green-500">
                      Website:{" "}
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {website}
                      </a>
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-gray-700">{description}</p>

                  {/* Card Actions */}
                  <div className="card-actions justify-end mt-5">
                    <Link to={`/CompanyProfiles/${company._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                        View Jobs
                      </button>
                    </Link>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 text-lg font-semibold text-white"
                      onClick={() => openModal(company)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <dialog id="Company_Profiles_view" className="modal">
        {selectedCompany && (
          <div className="modal-box bg-green-50 text-black max-w-[800px]">
            {/* Top */}
            <div className="py-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-2xl">
                    {selectedCompany.companyName}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Location:</span>
                    {selectedCompany.location}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Industry:</span>
                    {selectedCompany.industry}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold mr-5">Website:</span>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {selectedCompany.website}
                    </a>
                  </p>
                  <p className="text-lg py-3 leading-5">
                    <span className="font-bold pr-3">Description:</span>
                    {selectedCompany.description}
                  </p>
                </div>
                {/* Company Logo */}
                {selectedCompany.logo && (
                  <img
                    src={selectedCompany.logo}
                    alt={`${selectedCompany.companyName} Logo`}
                    className="w-52 h-w-52 object-cover mb-4"
                  />
                )}
              </div>

              {/* Company Details */}
              <div className="w-full mt-4">
                <h4 className="font-bold text-lg text-blue-500">
                  Company Details:
                </h4>
                <p className="text-lg grid grid-cols-2">
                  <span className="font-bold">Founding Year:</span>
                  {selectedCompany.companyDetails.foundingYear}
                </p>
                <p className="text-lg grid grid-cols-2">
                  <span className="font-bold">Employees:</span>
                  {selectedCompany.companyDetails.employees}
                </p>
                <p className="text-lg grid grid-cols-2">
                  <span className="font-bold">Revenue:</span>
                  {selectedCompany.companyDetails.revenue}
                </p>
                <p className="text-lg grid grid-cols-2">
                  <span className="font-bold">CEO:</span>
                  {selectedCompany.companyDetails.ceo}
                </p>
              </div>

              {/* Services Section */}
              <div className="mt-4">
                <h4 className="font-bold text-lg text-blue-500">Services:</h4>
                <ul className="list-disc list-inside">
                  {selectedCompany.companyDetails.services.map(
                    (service, index) => (
                      <li key={index} className="text-lg">
                        {service}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Social Media Links */}
              <div className="flex justify-between mt-4">
                <div>
                  <h4 className="font-bold text-lg mt-4 text-blue-500">
                    Social Media:
                  </h4>
                  <div className="flex gap-5">
                    <a
                      href={selectedCompany.companyDetails.socialMedia.LinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl py-1 underline"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href={selectedCompany.companyDetails.socialMedia.Twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl py-1 underline"
                    >
                      <FaSquareXTwitter />
                    </a>
                    <a
                      href={selectedCompany.companyDetails.socialMedia.Facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-3xl py-1 underline"
                    >
                      <FaFacebook />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <Link to={`/CompanyProfiles/${selectedCompany._id}`}>
                <button className="bg-green-500 hover:bg-green-600 px-5 py-2 text-lg font-semibold text-white">
                  View Jobs
                </button>
              </Link>
              <button
                className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg font-semibold text-white"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default CompanyProfiles;
