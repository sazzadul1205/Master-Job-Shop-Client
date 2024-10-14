import Loader from "../../../Pages/Shared/Loader/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import LogsComponent from "./LogsComponent/LogsComponent";
import { LuRefreshCcw } from "react-icons/lu";
import { Link } from "react-router-dom";

// Metric Card Component for reusability
const MetricCard = ({ title, value, to }) => (
  <div className="border border-blue-100 bg-gradient-to-br from-sky-300  to-sky-50 hover:from-blue-50 hover:to-blue-300 p-4 rounded-lg shadow-md hover:shadow-2xl">
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-2xl font-bold">{value || 0}</p>
    {to && (
      <div className="flex justify-end">
        <Link to={`/${to}`}>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2">
            Manage
          </button>
        </Link>
      </div>
    )}
  </div>
);

const AdminOverview = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient(); // Use QueryClient to manage queries
  // Array of query configurations
  const queries = [
    { key: "UsersCount", url: "/UsersCount" },
    { key: "PostedJobCount", url: "/PostedJobCount" },
    { key: "PostedGigCount", url: "/PostedGigCount" },
    { key: "CompanyProfilesCount", url: "/CompanyProfilesCount" },
    { key: "SalaryInsightCount", url: "/SalaryInsightCount" },
    { key: "UpcomingEventsCount", url: "/UpcomingEventsCount" },
    { key: "CoursesCount", url: "/CoursesCount" },
    { key: "MentorshipCount", url: "/MentorshipCount" },
    { key: "InternshipCount", url: "/InternshipCount" },
    { key: "NewsLetterCount", url: "/NewsLetterCount" },
    { key: "TestimonialsCount", url: "/TestimonialsCount" },
    { key: "BlogsCount", url: "/BlogsCount" },
  ];

  // Generate queries dynamically
  const queryResults = queries.map(({ key, url }) =>
    useQuery({
      queryKey: [key],
      queryFn: () => axiosPublic.get(url).then((res) => res.data),
    })
  );

  // Loading and error handling
  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);

  if (isLoading) return <Loader />;

  if (isError)
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

  // Extracting counts from query data
  const counts = [
    {
      title: "Total Users",
      value: queryResults[0]?.data?.count,
      to: "Dashboard/AdminManageUsers",
    },
    {
      title: "Total Jobs",
      value: queryResults[1]?.data?.count,
      to: "Dashboard/ManageJobs",
    },
    {
      title: "Total Gigs",
      value: queryResults[2]?.data?.count,
      to: "Dashboard/ManageGigs",
    },
    {
      title: "Total Company Profiles",
      value: queryResults[3]?.data?.count,
      to: "Dashboard/ManageCompany",
    },
    {
      title: "Total Salary Insights",
      value: queryResults[4]?.data?.count,
      to: "Dashboard/ManageSalaryInsight",
    },
    { title: "Total Upcoming Events", value: queryResults[5]?.data?.count },
    { title: "Total Courses", value: queryResults[6]?.data?.count },
    { title: "Total Mentorships", value: queryResults[7]?.data?.count },
    { title: "Total Internships", value: queryResults[8]?.data?.count },
    { title: "Total Newsletters", value: queryResults[9]?.data?.count },
    { title: "Total Testimonials", value: queryResults[10]?.data?.count },
    { title: "Total Blogs", value: queryResults[11]?.data?.count },
  ];

  // Function to refresh the data by invalidating queries instead of reloading the page
  const handleRefresh = () => {
    queries.forEach(({ key }) => queryClient.invalidateQueries([key]));
  };

  return (
    <div className="bg-white border border-black min-h-screen">
      <p className="text-3xl font-bold text-white pl-10 py-5 bg-blue-400">
        Admin Overview
      </p>
      {/* Total Contents */}
      <div className="mb-8 px-5 text-black">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4 mt-3">Total Contents: </h2>
          <button
            className="flex items-center text-lg font-semibold border-2 border-black px-10 rounded-full hover:bg-slate-200"
            onClick={handleRefresh} // Call the refresh function to refetch the data
          >
            <LuRefreshCcw className="mr-4" /> Refresh
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {counts.map((item, index) => (
            <MetricCard
              key={index}
              title={item.title}
              value={item.value}
              to={item.to}
            />
          ))}
        </div>
      </div>

      {/* Total Logs */}
      <LogsComponent />
    </div>
  );
};

export default AdminOverview;
