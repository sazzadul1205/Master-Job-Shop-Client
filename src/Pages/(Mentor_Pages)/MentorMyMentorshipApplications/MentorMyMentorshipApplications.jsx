import { FaCheck } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";

import DefaultX from "../../../assets/Mentor/DefaultX.jpg";
import { IoIosEye } from "react-icons/io";
import { ImCross } from "react-icons/im";

// Format date like "22 Feb 2026 10:12 PM"
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };

  return date.toLocaleString("en-US", options).replace(",", "");
};

// Time ago calculation with months & years
const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

// Demo Applicants Data
const applicants = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "Requested",
    date: "2023-08-20T12:20:00Z",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Michael Smith",
    status: "Requested",
    date: "2023-08-19T15:10:00Z",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Sophia Brown",
    status: "Requested",
    date: "2023-08-18T18:00:00Z",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "James Wilson",
    status: "Requested",
    date: "2023-08-17T09:30:00Z",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Emma Davis",
    status: "Requested",
    date: "2023-08-16T21:15:00Z",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "David Miller",
    status: "Requested",
    date: "2023-08-15T10:00:00Z",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Olivia Garcia",
    status: "Requested",
    date: "2023-08-14T16:45:00Z",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    name: "Daniel Martinez",
    status: "Requested",
    date: "2023-08-13T08:20:00Z",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 9,
    name: "Isabella Lopez",
    status: "Requested",
    date: "2023-08-12T14:55:00Z",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 10,
    name: "Ethan Clark",
    status: "Requested",
    date: "2023-08-11T19:40:00Z",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
];

const MentorMyMentorshipApplications = () => {
  return (
    <div className="py-7 px-8">
      {/* Title */}
      <h3 className="font-bold text-3xl text-gray-700">
        Mentorship Applications Management
      </h3>

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
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-600">
              Software Engineering Mentorship
            </h2>

            {/* Filters & Complete Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                {/* Label */}
                <label
                  htmlFor="statusFilter"
                  className="text-sm font-semibold text-gray-700"
                >
                  Filter by Status:
                </label>

                {/* Dropdown */}
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

              {/* Complete Button */}
              <button className="flex items-center gap-2 text-black border border-gray-700 hover:border-green-700 px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-green-500 hover:text-white cursor-pointer">
                <FaCheck /> Complete Program
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pt-4 text-black">
            <table className="table">
              {/* head */}
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th>#</th>
                  <th>Applicant Info</th>
                  <th className="text-center">Status</th>
                  <th className="w-96 text-center">Application Time</th>
                  <th className="w-96 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-gray-100">
                    <th>{applicant.id}</th>
                    <td className="flex items-center gap-4">
                      <img
                        src={applicant.avatar}
                        alt={applicant.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <h3 className="font-bold">{applicant.name}</h3>
                    </td>

                    {/* Status */}
                    <td className="text-center">{applicant.status}</td>

                    {/* Application Time */}
                    <td className="text-center">
                      {formatDate(applicant.date)}{" "}
                      <span className="text-gray-500">
                        ({getTimeAgo(applicant.date)})
                      </span>
                    </td>

                    {/* Buttons */}
                    <td className="text-right w-96">
                      <div className="flex justify-end gap-2">
                        <button className="flex gap-2 items-center border-2 py-2 px-5 rounded">
                          <IoIosEye /> View
                        </button>
                        <button className="flex gap-2 items-center border-2 py-2 px-5 rounded">
                          <FaCheck /> Accept
                        </button>
                        <button className="flex gap-2 items-center border-2 py-2 px-5 rounded">
                          <ImCross /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorMyMentorshipApplications;
