import { FaCheck } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";

const MentorMyMentorshipApplications = () => {
  return (
    <div className="py-7 px-8">
      {/* Title */}
      <h3 className="font-bold text-3xl text-gray-700">Mentorship Applications Management</h3>

      {/* Filters */}
      <div className="pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchSharp className="w-5 h-5 text-gray-500" />
          </span>
          <input
            type="text"
            placeholder="Search mentorship..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="statusFilter"
            className="text-sm font-semibold text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            defaultValue=""
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
            <option value="onhold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Container for Mentorship Applications */}
      <div className="py-6">
        {/* Card-1 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-600">
              Software Engineering Mentorship
            </h2>

            {/* Filters & Complete Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <label
                  htmlFor="statusFilter"
                  className="text-sm font-semibold text-gray-700"
                >
                  Filter by Status:
                </label>
                <select
                  id="statusFilter"
                  className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                  <option value="onhold">On Hold</option>
                </select>
              </div>

              <button className="flex items-center gap-2 text-black border border-gray-700 hover:border-green-700 px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-green-500 hover:text-white cursor-pointer">
                <FaCheck /> Complete Program
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorMyMentorshipApplications;
