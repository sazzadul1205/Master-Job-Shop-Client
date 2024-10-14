import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Pages/Shared/Loader/Loader";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaSearch } from "react-icons/fa";
import { CiViewBoard } from "react-icons/ci";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import ModalViewSalaryInsights from "./ModalViewSalaryInsights/ModalViewSalaryInsights";
import ModalAddSalaryInsights from "./ModalAddSalaryInsights/ModalAddSalaryInsights";
import Swal from "sweetalert2";

const ManageSalaryInsights = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedInsights, setSelectedInsights] = useState([]);
  const [viewSalaryData, setViewSalaryData] = useState(null); // state to hold job details for modal

  // Fetching Salary Insight Data
  const {
    data: SalaryInsightData = [],
    isLoading: SalaryInsightDataIsLoading,
    error: SalaryInsightDataError,
    refetch,
  } = useQuery({
    queryKey: ["SalaryInsightData"],
    queryFn: () => axiosPublic.get(`/Salary-Insight`).then((res) => res.data),
  });

  // Loading state
  if (SalaryInsightDataIsLoading) {
    return <Loader />;
  }

  // Error state
  if (SalaryInsightDataError) {
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

  // Handle checkbox click
  const handleCheckboxClick = (id) => {
    setSelectedInsights((prevSelectedInsights) =>
      prevSelectedInsights.includes(id)
        ? prevSelectedInsights.filter((insightId) => insightId !== id)
        : [...prevSelectedInsights, id]
    );
  };

  // Handle view salary insight
  const handleViewInsights = (salary) => {
    setViewSalaryData(salary); // Set the selected salary insight details
    document.getElementById("Modal_Salary_Insights_View").showModal(); // Show the modal
  };

  // Handle individual delete
  const handleIndividualDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete salary insight by ID
          await axiosPublic.delete(`/Salary-Insight/delete/${id}`);

          // Show success message
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Salary insight has been deleted.",
          });

          // Refetch data to update the table
          refetch();
        } catch (error) {
          console.error("Error deleting insight:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete salary insight. Please try again.",
          });
        }
      }
    });
  };

  // Handle deletion of selected insights
  const handleDelete = async () => {
    if (selectedInsights.length > 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete the selected salary insights. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete them!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Delete salary insights by ID
            await axiosPublic.delete(`/Salary-Insight/delete`, {
              data: { insightsToDelete: selectedInsights },
            });

            // Show success message
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Selected salary insights have been successfully deleted.",
              confirmButtonText: "Okay",
            });

            // Clear the selected insights and refetch data
            setSelectedInsights([]);
            refetch();
          } catch (error) {
            console.error("Error deleting insights:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete salary insights. Please try again.",
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "No Insights Selected",
        text: "Please select at least one salary insight to delete.",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen border border-black text-black">
      {/* Title */}
      <p className="text-2xl font-bold text-white pl-10 py-4 bg-blue-400">
        Manage Salary Insights
      </p>

      {/* Search */}
      <div className="py-5 flex justify-between items-center px-5">
        <div>
          <label className="input input-bordered flex items-center gap-2 bg-white border-gray-400 w-[500px]">
            <input type="text" className="grow" placeholder="Search" />
            <FaSearch />
          </label>
        </div>
      </div>

      {/* Add and Delete selected insights button */}
      <div className="flex justify-between mx-5 my-2">
        <button
          className="bg-green-500 hover:bg-green-300 px-10 py-2 text-white font-bold"
          onClick={() =>
            document.getElementById("Create_New_Salary_Insights").showModal()
          }
        >
          + Add New Salary Insights
        </button>
        <button
          className="bg-red-500 hover:bg-red-300 px-10 py-2 text-white font-bold"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* Salary Insight Table */}
      <div className="overflow-x-auto p-2">
        <table className="table border border-black">
          {/* Table Header */}
          <thead className="text-black">
            <tr className="bg-gray-500 text-white">
              <th>No</th>
              <th>Check</th>
              <th>Job Title</th>
              <th>Job Type</th>
              <th>Posted By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {SalaryInsightData.map((salary, index) => (
              <tr
                key={salary._id}
                className={
                  selectedInsights.includes(salary._id) ? "bg-red-50" : ""
                }
              >
                <td>{index + 1}</td>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox border border-black w-5 h-5"
                      checked={selectedInsights.includes(salary._id)}
                      onChange={() => handleCheckboxClick(salary._id)}
                    />
                  </label>
                </th>
                <td>{salary?.jobTitle}</td>
                <td>{salary?.jobType}</td>
                <td>{salary?.postedBy}</td>

                <td>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-400 p-2 text-white text-2xl"
                      onClick={() => handleViewInsights(salary)} // Pass salary data on view
                    >
                      <CiViewBoard />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-400 p-2 text-white text-2xl"
                      onClick={() => handleIndividualDelete(salary._id)} // Handle individual deletion
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View job modal */}
      <dialog id="Modal_Salary_Insights_View" className="modal">
        <ModalViewSalaryInsights salaryData={viewSalaryData} />
      </dialog>

      <dialog id="Create_New_Salary_Insights" className="modal">
        <ModalAddSalaryInsights refetch={refetch}></ModalAddSalaryInsights>
      </dialog>
    </div>
  );
};

export default ManageSalaryInsights;
