// Assets - KPI
import Job from "../../../assets/EmployerLayout/form.png";
import Gig from "../../../assets/EmployerLayout/Gig/Gig.png";
import Internship from "../../../assets/EmployerLayout/Internship/Internship.png";
import Events from "../../../assets/EmployerLayout/Events/Events.png";

const CompanyDashboard = () => {
  return (
    <div>
      {/* KPI Summery Title  */}
      <h3 className="text-lg text-black font-bold py-3 px-5">KPI Summery </h3>

      <div className="grid grid-cols-4 gap-4 px-5">
        {/* Card-1 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Total Posted Jobs </h3>

            {/* Icons */}
            <img src={Job} alt="Job Icon" className="w-5 h-5" />
          </div>
        </div>

        {/* Card-2 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Total Gig Posted </h3>

            {/* Icons */}
            <img src={Gig} alt="Gig Icon" className="w-5 h-5" />
          </div>
        </div>

        {/* Card-3 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Active Internships </h3>

            {/* Icons */}
            <img src={Internship} alt="Internship Icon" className="w-5 h-5" />
          </div>
        </div>

        {/* Card-4 */}
        <div className="border-2 border-gray-300 bg-white rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between font-semibold px-5 py-5">
            {/* Title */}
            <h3 className="text-gray-500 text-base"> Upcoming Events </h3>

            {/* Icons */}
            <img src={Events} alt="Events Icon" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
