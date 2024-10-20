import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const UserOverview = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  // Fetch Jobs where user has applied
  const { data: AppliedJobs = [] } = useQuery({
    queryKey: ["AppliedJobs", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/applied-jobs?email=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run if the user is logged in
  });

  // Fetch Gigs where user has applied
  const { data: AppliedGig = [] } = useQuery({
    queryKey: ["AppliedGig", user?.email],
    queryFn: () =>
      axiosPublic
        .get(`/applied-gigs?biderEmail=${user?.email}`)
        .then((res) => res.data),
    enabled: !!user?.email, // Only run if the user is logged in
  });

  return (
    <div className="bg-white border border-black min-h-screen">
      <p className="text-3xl font-bold text-white pl-10 py-5 bg-blue-400">
        {user?.displayName} Overview
      </p>

      {/* Jobs Section */}
      <div className="p-5 text-black">
        <h2 className="text-2xl font-bold mb-5">Jobs You've Applied For</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-black">
            {/* Table Head */}
            <thead className="bg-gray-200">
              <tr>
                <th className=" px-4 py-2">#</th>
                <th className=" px-4 py-2">Job Title</th>
                <th className=" px-4 py-2">Company</th>
                <th className=" px-4 py-2">Location</th>
                <th className=" px-4 py-2">Available Until</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {AppliedJobs.length > 0 ? (
                AppliedJobs.map((job, index) => (
                  <tr key={job._id} className="hover:bg-gray-100">
                    <td className="border-y border-black px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {job.jobTitle}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {job.companyName}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {job.location}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {job.availableUntil}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No jobs applied for yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gigs Section */}
      <div className="p-5 text-black">
        <h2 className="text-2xl font-bold mb-5">Gigs You&apos;ve Applied For</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-black">
            {/* Table Head */}
            <thead className="bg-gray-200">
              <tr>
                <th className=" px-4 py-2">#</th>
                <th className=" px-4 py-2">Gig Title</th>
                <th className=" px-4 py-2">Client</th>
                <th className=" px-4 py-2">Location</th>
                <th className=" px-4 py-2">Expiration Date</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {AppliedGig.length > 0 ? (
                AppliedGig.map((gig, index) => (
                  <tr key={gig._id} className="hover:bg-gray-100">
                    <td className="border-y border-black px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {gig.gigTitle}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {gig.clientName}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {gig.location}
                    </td>
                    <td className="border-y border-black px-4 py-2">
                      {gig.expirationDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No gigs applied for yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
