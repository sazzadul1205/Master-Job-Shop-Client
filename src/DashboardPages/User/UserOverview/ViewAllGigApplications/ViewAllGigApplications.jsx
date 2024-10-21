/* eslint-disable react/prop-types */
const ViewAllGigApplications = ({ AppliedGig }) => {
  return (
    <div className="p-5 text-black bg-gray-100">
      <h2 className="text-2xl font-bold mb-5">Gigs You&apos;ve Applied For</h2>
      {AppliedGig.length > 0 ? (
        <div className="grid grid-cols-3 gap-5">
          {AppliedGig.map((gig) => (
            <div
              key={gig._id}
              className="border border-black p-4 rounded-lg hover:bg-gray-200 transition duration-200 h-44 "
            >
              <h3 className="text-lg font-semibold">{gig.gigTitle}</h3>
              <p className="text-gray-700">
                <strong>Client:</strong> {gig.clientName}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {gig.location}
              </p>
              <p className="text-gray-700">
                <strong>Expiration Date:</strong> {gig.expirationDate}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4">No gigs applied for yet.</p>
      )}
    </div>
  );
};

export default ViewAllGigApplications;
