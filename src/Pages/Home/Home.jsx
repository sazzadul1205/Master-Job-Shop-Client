import { GoMoveToTop } from "react-icons/go";
import CompanyProfiles from "./CompanyProfiles/CompanyProfiles";
import Courses from "./Courses/Courses";
import FeaturedGigs from "./FeaturedGigs/FeaturedGigs";
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import HomeBanners from "./HomeBanner/HomeBanner";
import InternshipPrograms from "./InternshipPrograms/InternshipPrograms";
import MentorshipPrograms from "./MentorshipPrograms/MentorshipPrograms";
import NewsLetter from "./NewsLetter/NewsLetter";
import SalaryInsights from "./SalaryInsights/SalaryInsights";
import Testimonials from "./Testimonials/Testimonials";
import UpcomingEvents from "./UpcomingEvents/UpcomingEvents";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";
import { useState, useEffect } from "react";

const Home = () => {
  const [showToTop, setShowToTop] = useState(false);

  // Function to handle scrolling
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowToTop(true); // Show "To Top" button when scrolled more than 300px
    } else {
      setShowToTop(false); // Hide it when at the top
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Use effect to add/remove scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Scroll to Top Button */}
      {showToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-800 transition"
        >
          <GoMoveToTop className="text-2xl" />
        </div>
      )}

      <HomeBanners />
      <FeaturedJobs />
      <FeaturedGigs />
      <CompanyProfiles />
      <SalaryInsights />
      <UpcomingEvents />
      <Courses />
      <MentorshipPrograms />
      <InternshipPrograms />
      <NewsLetter />
      <Testimonials />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
