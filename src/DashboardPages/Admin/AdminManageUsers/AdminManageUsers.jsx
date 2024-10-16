import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loader from "../../../Pages/Shared/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminManageUsers = () => {
  const axiosPublic = useAxiosPublic();

  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [companyCode, setCompanyCode] = useState("");

  // Fetching users data
  const {
    data: usersData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["UsersData"],
    queryFn: () => axiosPublic.get("/Users").then((res) => res.data),
  });

  if (isLoading) return <Loader />;
  if (error) return renderError();

  // Filter users
  const filteredUsers = usersData.filter((user) => {
    const matchesSearchTerm =
      (user.displayName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearchTerm && matchesRole;
  });

  // Unique roles
  const roles = ["Member", "Manager"];

  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setUserRole(selected);
    setCompanyCode(
      selected === "Bidder" || selected === "Company"
        ? Math.random().toString(36).substring(2, 10).toUpperCase()
        : ""
    );
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserRole(user.role);
    document.getElementById("my_modal_1").showModal();
  };

  const handleRoleUpdate = async () => {
    try {
      await axiosPublic.put(`/Users/${selectedUser._id}`, {
        role: userRole,
        companyCode,
      });
      Swal.fire({
        icon: "success",
        title: "Role Updated Successfully",
        text: `User ${selectedUser.displayName}'s role has been updated to ${userRole}!`,
      });
      document.getElementById("my_modal_1").close();
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the role. Please try again later.",
      });
      console.log(error);
    }
  };

  const renderError = () => (
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

  return (
    <div className="bg-white min-h-screen border border-black">
      <p className="text-3xl font-bold text-white pl-10 py-5 bg-blue-400">
        Users Control
      </p>

      {/* Search and Role Filter */}
      <div className="flex items-center justify-between p-4 text-black gap-10">
        <label className="input input-bordered flex items-center gap-2 w-[500px] bg-white">
          <input
            type="text"
            className="grow py-2 px-3 focus:outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="h-4 w-4 opacity-70 text-black" />
        </label>

        <select
          className="border border-gray-300 p-2 w-[200px] bg-white text-black"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto p-2 text-black">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2">#</th>
              <th className="p-2">Display Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Created Date</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="bg-gray-100 hover:bg-gray-200">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{user.displayName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  {new Date(user.createdDate).toLocaleDateString()}
                </td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    className="bg-gray-200 hover:bg-gray-400 hover:text-white border border-gray-500 px-10 py-1"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white text-black">
          {selectedUser && (
            <>
              <h3 className="font-bold text-xl">Edit User:</h3>
              <p className="py-2 grid grid-cols-2">
                <span className="font-bold">Name:</span>{" "}
                {selectedUser.displayName}
              </p>
              <p className="py-2 grid grid-cols-2">
                <span className="font-bold">Email:</span> {selectedUser.email}
              </p>
              <p className="py-2 grid grid-cols-2">
                <span className="font-bold">Created Date:</span>{" "}
                {new Date(selectedUser.createdDate).toLocaleDateString()}
              </p>
              <p className="py-2 grid grid-cols-2">
                <span className="font-bold">Current Role:</span>{" "}
                {selectedUser.role}
              </p>

              {/* Role Selector */}
              <div className="py-2">
                <label className="block font-semibold mb-1">Select Role</label>
                {selectedUser.role === "Admin" ? (
                  <p className="text-red-500">Admin role cannot be changed.</p>
                ) : (
                  <select
                    className="border border-gray-300 p-2 w-full bg-white text-black mt-2"
                    value={userRole}
                    onChange={handleRoleChange}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Company Code */}
              {companyCode && (
                <p className="py-2 grid grid-cols-2">
                  <span className="font-bold">Generated Code:</span>{" "}
                  {companyCode}
                </p>
              )}

              {/* Modal Actions */}
              <div className="modal-action">
                <button
                  className="bg-blue-500 hover:bg-blue-600 px-10 py-2 disabled:bg-gray-500"
                  disabled={selectedUser.role === "Admin"}
                  onClick={handleRoleUpdate}
                >
                  Update Role
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 px-10 py-2"
                  onClick={() => document.getElementById("my_modal_1").close()}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default AdminManageUsers;
