import CompanyProfiles from "./CompanyProfiles/CompanyProfiles";
import Courses from "./Courses/Courses";
import FeaturedGigs from "./FeaturedGigs/FeaturedGigs";
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import HomeBanners from "./HomeBanner/HomeBanner";
import InternshipPrograms from "./InternshipPrograms/InternshipPrograms";
import MentorshipPrograms from "./MentorshipPrograms/MentorshipPrograms";
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
      <MentorshipPrograms></MentorshipPrograms>
      <InternshipPrograms></InternshipPrograms>
      
    </div>
  );
};

export default Home;
