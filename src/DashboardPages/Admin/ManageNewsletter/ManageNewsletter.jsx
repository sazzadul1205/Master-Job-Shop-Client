import { FaSearch } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";

const ManageNewsletter = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch NewsLetter data
  const {
    data: NewsLetterData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["NewsLetterData"],
    queryFn: () => axiosPublic.get(`/NewsLetter`).then((res) => res.data),
  });

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
  if (error) {
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

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage NewsLetter
      </p>

      {/* Search Bar */}
      <div className="py-5 flex justify-between items-center px-5">
        <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
          <input type="text" className="grow" placeholder="Search" />
          <FaSearch />
        </label>
      </div>

      {/* NewsLetter Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {NewsLetterData.length > 0 ? (
              NewsLetterData.map((subscriber, index) => (
                <tr key={subscriber._id}>
                  <td>{index + 1}</td>
                  <td>{subscriber?.name}</td>
                  <td>{subscriber?.email}</td>
                  <td>{subscriber?.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No newsletters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNewsletter;
