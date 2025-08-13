import React from "react";

const CompanyDashboardApplicationOverview = ({
  DailyGigBidsStatus,
  DailyJobApplicationsStatus,
  DailyEventApplicationsStatus,
  DailyInternshipApplicationsStatus,
}) => {
  console.log("Daily Gig Bids Status : ", DailyGigBidsStatus);
  console.log("Daily Job Applications Status : ", DailyJobApplicationsStatus);
  console.log(
    "Daily Event Applications Status : ",
    DailyEventApplicationsStatus
  );
  console.log(
    "Daily Internship Applications Status : ",
    DailyInternshipApplicationsStatus
  );

  return (
    <div className="border border-gray-300 rounded mt-5 mx-5">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-5">
        {/* Applications Overview Title */}
        <h3 className="text-lg text-black font-bold">Applications Overview</h3>

        {/* Filter */}
        <select
          className="border border-gray-300 bg-white text-black rounded-lg px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue="7d"
        >
          <option value="7d">Last 7 Days</option>
          <option value="1m">Last Month</option>
          <option value="1y">Last Year</option>
        </select>
      </div>
    </div>
  );
};

export default CompanyDashboardApplicationOverview;


