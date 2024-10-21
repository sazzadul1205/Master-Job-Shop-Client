import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import ModalCompanyProfilesDetails from "../../Shared/ModalCompanyProfilesDetails/ModalCompanyProfilesDetails";

const FeaturedCompanyProfiles = ({ CompanyProfilesData }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const openModal = (company) => {
    setSelectedCompany(company);
    const modal = document.getElementById("View_CompanyProfiles_view");
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("View_CompanyProfiles_view");
    modal.close();
    setSelectedCompany(null);
  };

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row items-center pt-20 px-5">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-4xl md:text-5xl font-bold italic text-blue-700">
              Company Profiles
            </p>
            <p className="lg:text-xl">
              Discover companies and their career opportunities.
            </p>
          </div>
          <button className="mt-4 md:mt-0 md:ml-auto text-lg border-2 border-sky-800 px-8 py-2 rounded-full font-semibold text-black hover:text-blue-800 hover:bg-sky-300">
            <Link to={"/CompanyProfiles"} className="flex items-center">
              Show More <FaArrowRight className="ml-2" />
            </Link>
          </button>
        </div>

        {/* Company Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10 px-5 lg:px-0">
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
                className="card bg-white lg:w-96 shadow-xl transform transition duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-2xl"
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
                  <div className="flex justify-end gap-1 lg:gap-3 mt-5">
                    <Link to={`/CompanyProfiles/${company._id}`}>
                      <button className="bg-green-500 hover:bg-green-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white">
                        View rofile
                      </button>
                    </Link>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 lg:px-5 py-2 lg:text-lg font-semibold text-white"
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
      <dialog id="View_CompanyProfiles_view" className="modal">
        {selectedCompany && (
          <ModalCompanyProfilesDetails
            selectedCompany={selectedCompany}
            closeModal={closeModal}
          ></ModalCompanyProfilesDetails>
        )}
      </dialog>
    </div>
  );
};

FeaturedCompanyProfiles.propTypes = {
  CompanyProfilesData: PropTypes.arrayOf(
    PropTypes.shape({
      companyName: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      industry: PropTypes.string.isRequired,
      website: PropTypes.string,
      logo: PropTypes.string,
      description: PropTypes.string,
      companyDetails: PropTypes.shape({
        foundingYear: PropTypes.string,
        employees: PropTypes.number,
        revenue: PropTypes.string,
        ceo: PropTypes.string,
        services: PropTypes.arrayOf(PropTypes.string),
        socialMedia: PropTypes.shape({
          LinkedIn: PropTypes.string,
          Twitter: PropTypes.string,
          Facebook: PropTypes.string,
        }),
      }),
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FeaturedCompanyProfiles;
