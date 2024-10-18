import PropTypes from "prop-types";

const PageData = ({ ManageCompanyProfiles }) => {
  return (
    <div>
      {/* Company Profile Content */}
      <div className="px-5 py-5">
        {/* Top section */}
        <div className="flex justify-between">
          <div className="py-2">
            <h1 className="text-3xl font-bold mb-2">
              {ManageCompanyProfiles[0]?.companyName}
            </h1>
            <p className="text-lg mb-2">
              <strong>Industry:</strong> {ManageCompanyProfiles[0]?.industry}
            </p>
            <p className="text-lg mb-2">
              <strong>Location:</strong> {ManageCompanyProfiles[0]?.location}
            </p>
            <p className="text-lg mb-2">
              <strong>Website:</strong>{" "}
              <a
                href={ManageCompanyProfiles[0]?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {ManageCompanyProfiles[0]?.website}
              </a>
            </p>
            <p className="mb-4">
              <strong>Description:</strong>{" "}
              {ManageCompanyProfiles[0]?.description}
            </p>
          </div>
          <img
            src={ManageCompanyProfiles[0]?.logo}
            alt={`${ManageCompanyProfiles[0]?.companyName} Logo`}
            className="border border-dotted border-black w-80 h-52 mb-4"
          />
        </div>

        {/* Company Details */}
        <div className="py-2">
          <h2 className="text-2xl font-semibold mb-2">Company Details</h2>
          <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
            <strong>Founding Year:</strong>{" "}
            {ManageCompanyProfiles[0]?.companyDetails.foundingYear}
          </p>
          <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
            <strong>Employees:</strong>{" "}
            {ManageCompanyProfiles[0]?.companyDetails.employees}
          </p>
          <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
            <strong>Revenue:</strong>{" "}
            {ManageCompanyProfiles[0]?.companyDetails.revenue}
          </p>
          <p className="text-lg grid grid-cols-2 w-1/3 mb-2">
            <strong>CEO:</strong> {ManageCompanyProfiles[0]?.companyDetails.ceo}
          </p>
        </div>

        <div className="grid grid-cols-2">
          {/* Services Offered */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">
              Services Offered
            </h3>
            <ul className="list-disc list-inside">
              {ManageCompanyProfiles[0]?.companyDetails.services.map(
                (service, index) => (
                  <li key={index} className="text-lg">
                    {service}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Clients */}
          <div className="py-2">
            <h3 className="text-2xl font-semibold py-2 mt-4">Clients</h3>
            <ul className="list-disc list-inside">
              {ManageCompanyProfiles[0]?.companyDetails.clients.map(
                (client, index) => (
                  <li key={index} className="text-lg">
                    {client}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Key Projects */}
        <div className="py-2">
          <h3 className="text-2xl font-semibold py-2 mt-4">Key Projects</h3>
          <ul className="list-disc list-inside">
            {ManageCompanyProfiles[0]?.companyDetails.keyProjects.map(
              (project, index) => (
                <li key={index} className="text-lg">
                  <strong>{project.projectName}:</strong> {project.description}{" "}
                  ({project.year})
                </li>
              )
            )}
          </ul>
        </div>

        {/* Awards */}
        <div className="py-2">
          <h3 className="text-2xl font-semibold py-2 mt-4">Awards</h3>
          <ul className="list-disc list-inside">
            {ManageCompanyProfiles[0]?.companyDetails.awards.map(
              (award, index) => (
                <li key={index} className="text-lg">
                  <strong>{award.awardName}</strong> ({award.year}) -{" "}
                  {award.organization}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Office Locations */}
        <div className="py-2">
          <h3 className="text-2xl font-semibold py-2 mt-4">Office Locations</h3>
          <ul className="list-disc list-inside">
            {ManageCompanyProfiles[0]?.companyDetails.officeLocations.map(
              (location, index) => (
                <li key={index} className="text-lg">
                  {location}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Partnerships */}
        <div className="py-2">
          <h3 className="text-2xl font-semibold py-2 mt-4">Partnerships</h3>
          <ul className="list-disc list-inside">
            {ManageCompanyProfiles[0]?.companyDetails.partnerships.map(
              (partnership, index) => (
                <li key={index} className="text-lg">
                  <strong>{partnership.partnerName}</strong> (since{" "}
                  {partnership.since}) - {partnership.description}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="py-2">
          <h3 className="text-2xl font-semibold py-2 mt-4">Social Media</h3>
          <ul className="list-disc list-inside">
            {Object.entries(
              ManageCompanyProfiles[0]?.companyDetails.socialMedia
            ).map(([platform, link], index) => (
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Adding PropTypes
PageData.propTypes = {
  ManageCompanyProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      companyName: PropTypes.string,
      industry: PropTypes.string,
      location: PropTypes.string,
      website: PropTypes.string,
      logo: PropTypes.string,
      description: PropTypes.string,
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
    })
  ).isRequired,
};

export default PageData;
