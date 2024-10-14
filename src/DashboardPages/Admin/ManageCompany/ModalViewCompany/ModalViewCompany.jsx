import { ImCross } from "react-icons/im";
import PropTypes from "prop-types";

const ModalViewCompany = ({ CompanyData }) => {
  return (
    <div>
      <div className="modal-box bg-white min-w-[1000px] p-0 pb-10">
        {/* Top part */}
        <div className="flex justify-between items-center p-5 bg-gray-400 text-white border-b-2 border-black">
          <p className="font-bold text-xl">View Company Details</p>
          <button
            onClick={() =>
              document.getElementById("Modal_Company_View").close()
            }
          >
            <ImCross className="hover:text-gray-700" />
          </button>
        </div>

        {/* Company Profile Details */}
        <div className="px-5">
          {/* Top section */}
          <div className="flex justify-between">
            <div className="py-2">
              <h1 className="text-3xl font-bold mb-2">
                {CompanyData?.companyName || "N/A"}
              </h1>
              <p className="text-lg mb-2">
                <strong>Industry:</strong> {CompanyData?.industry || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <strong>Location:</strong> {CompanyData?.location || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <strong>Company Code:</strong> {CompanyData?.companyCode || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <strong>Posted By:</strong> {CompanyData?.postedBy || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <strong>Website:</strong>{" "}
                <a
                  href={CompanyData?.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {CompanyData?.website || "N/A"}
                </a>
              </p>
              <p className="mb-4">
                <strong>Description:</strong>{" "}
                {CompanyData?.description || "N/A"}
              </p>
            </div>
            <img
              src={CompanyData?.logo || "/placeholder-logo.png"}
              alt={`${CompanyData?.companyName || "Company"} Logo`}
              className="w-80 h-52 mb-4"
            />
          </div>

          {/* Company Details */}
          <div className="py-2">
            <h2 className="text-2xl font-semibold mb-2">Company Details</h2>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>Founding Year:</strong>{" "}
              {CompanyData?.companyDetails?.foundingYear || "N/A"}
            </p>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>Employees:</strong>{" "}
              {CompanyData?.companyDetails?.employees || "N/A"}
            </p>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>Revenue:</strong>{" "}
              {CompanyData?.companyDetails?.revenue || "N/A"}
            </p>
            <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
              <strong>CEO:</strong> {CompanyData?.companyDetails?.ceo || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-2">
            {/* Services Offered */}
            <div className="py-2">
              <h3 className="text-2xl font-semibold py-2 mt-4">
                Services Offered
              </h3>
              <ul className="list-disc list-inside">
                {CompanyData?.companyDetails?.services?.length > 0 ? (
                  CompanyData.companyDetails.services.map((service, index) => (
                    <li key={index} className="text-lg">
                      {service}
                    </li>
                  ))
                ) : (
                  <li className="text-lg">No services listed</li>
                )}
              </ul>
            </div>

            {/* Clients */}
            <div className="py-2">
              <h3 className="text-2xl font-semibold py-2 mt-4">Clients</h3>
              <ul className="list-disc list-inside">
                {CompanyData?.companyDetails?.clients?.length > 0 ? (
                  CompanyData.companyDetails.clients.map((client, index) => (
                    <li key={index} className="text-lg">
                      {client}
                    </li>
                  ))
                ) : (
                  <li className="text-lg">No clients listed</li>
                )}
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Key Projects</h3>
            <ul className="list-disc list-inside">
              {CompanyData?.companyDetails?.keyProjects?.length > 0 ? (
                CompanyData.companyDetails.keyProjects.map((project, index) => (
                  <li key={index} className="text-lg">
                    <strong>{project.projectName}:</strong>{" "}
                    {project.description} ({project.year})
                  </li>
                ))
              ) : (
                <li className="text-lg">No key projects listed</li>
              )}
            </ul>
          </div>

          {/* Awards */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Awards</h3>
            <ul className="list-disc list-inside">
              {CompanyData?.companyDetails?.awards?.length > 0 ? (
                CompanyData.companyDetails.awards.map((award, index) => (
                  <li key={index} className="text-lg">
                    <strong>{award.awardName}</strong> ({award.year}) -{" "}
                    {award.organization}
                  </li>
                ))
              ) : (
                <li className="text-lg">No awards listed</li>
              )}
            </ul>
          </div>

          {/* Office Locations */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">
              Office Locations
            </h3>
            <ul className="list-disc list-inside">
              {CompanyData?.companyDetails?.officeLocations?.length > 0 ? (
                CompanyData.companyDetails.officeLocations.map(
                  (location, index) => (
                    <li key={index} className="text-lg">
                      {location}
                    </li>
                  )
                )
              ) : (
                <li className="text-lg">No office locations listed</li>
              )}
            </ul>
          </div>

          {/* Partnerships */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Partnerships</h3>
            <ul className="list-disc list-inside">
              {CompanyData?.companyDetails?.partnerships?.length > 0 ? (
                CompanyData.companyDetails.partnerships.map(
                  (partnership, index) => (
                    <li key={index} className="text-lg">
                      <strong>{partnership.partnerName}</strong> (since{" "}
                      {partnership.since}) - {partnership.description}
                    </li>
                  )
                )
              ) : (
                <li className="text-lg">No partnerships listed</li>
              )}
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Social Media</h3>
            <ul className="list-disc list-inside">
              {CompanyData?.companyDetails?.socialMedia ? (
                Object.entries(CompanyData.companyDetails.socialMedia).map(
                  ([platform, link], index) => (
                    <li key={index} className="text-lg">
                      <strong>{platform}:</strong>{" "}
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )
              ) : (
                <li className="text-lg">No social media links available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ModalViewCompany.propTypes = {
  CompanyData: PropTypes.shape({
    companyName: PropTypes.string,
    industry: PropTypes.string,
    location: PropTypes.string,
    website: PropTypes.string,
    companyCode: PropTypes.string,
    postedBy: PropTypes.string,
    description: PropTypes.string,
    logo: PropTypes.string,
    companyDetails: PropTypes.shape({
      foundingYear: PropTypes.number,
      employees: PropTypes.number,
      revenue: PropTypes.string,
      ceo: PropTypes.string,
      services: PropTypes.arrayOf(PropTypes.string),
      clients: PropTypes.arrayOf(PropTypes.string),
      keyProjects: PropTypes.arrayOf(
        PropTypes.shape({
          projectName: PropTypes.string,
          description: PropTypes.string,
          year: PropTypes.number,
        })
      ),
      awards: PropTypes.arrayOf(
        PropTypes.shape({
          awardName: PropTypes.string,
          year: PropTypes.number,
          organization: PropTypes.string,
        })
      ),
      officeLocations: PropTypes.arrayOf(PropTypes.string),
      partnerships: PropTypes.arrayOf(
        PropTypes.shape({
          partnerName: PropTypes.string,
          since: PropTypes.number,
          description: PropTypes.string,
        })
      ),
      socialMedia: PropTypes.objectOf(PropTypes.string),
    }),
  }),
};

export default ModalViewCompany;
