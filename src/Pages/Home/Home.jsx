import CompanyProfiles from "./CompanyProfiles/CompanyProfiles";
import Courses from "./Courses/Courses";
import FeaturedGigs from "./FeaturedGigs/FeaturedGigs";
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import HomeBanners from "./HomeBanner/HomeBanner";
import SalaryInsights from "./SalaryInsights/SalaryInsights";
import UpcomingEvents from "./UpcomingEvents/UpcomingEvents";

const Home = () => {
  return (
    <div>
      <HomeBanners></HomeBanners>
      <FeaturedJobs></FeaturedJobs>
      <FeaturedGigs></FeaturedGigs>
      <CompanyProfiles></CompanyProfiles>
      <SalaryInsights></SalaryInsights>
      <UpcomingEvents></UpcomingEvents>
      <Courses></Courses>
    </div>
  );
};

export default Home;
