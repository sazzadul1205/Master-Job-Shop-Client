/* eslint-disable react/prop-types */
const ViewAllJobApplications = ({ AppliedJobs }) => {
  return (
    <div className="p-5 text-black bg-slate-50">
      {/* Jobs Section */}
      <h2 className="text-2xl font-bold mb-5">Jobs You&apos;ve Applied For</h2>
      {AppliedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AppliedJobs.map((job) => (
            <div
              key={job._id}
              className="border border-black p-5 shadow-lg hover:shadow-xl transition-shadow duration-200 h-48 hover:bg-gray-200"
            >
              <h3 className="font-semibold text-xl mb-2">{job.jobTitle}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Company:</strong> {job.companyName}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-gray-700">
                <strong>Available Until:</strong> {job.availableUntil}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4">No jobs applied for yet.</p>
      )}
    </div>
  );
};

export default ViewAllJobApplications;
