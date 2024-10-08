import FeaturedGigs from "./FeaturedGigs/FeaturedGigs";
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import HomeBanners from "./HomeBanner/HomeBanner";
import InternshipPrograms from "./InternshipPrograms/InternshipPrograms";
import MentorshipPrograms from "./MentorshipPrograms/MentorshipPrograms";
import NewsLetter from "./NewsLetter/NewsLetter";
import Testimonials from "./Testimonials/Testimonials";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";
import FeaturedCompanyProfiles from "./FeaturedCompanyProfiles/FeaturedCompanyProfiles";
import FeaturedSalaryInsights from "./FeaturedSalaryInsights/FeaturedSalaryInsights";
import FeaturedUpcomingEvents from "./FeaturedUpcomingEvents/FeaturedUpcomingEvents";
import FeaturedCourses from "./FeaturedCourses/FeaturedCourses";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Shared/Loader/Loader";

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching HomeBanner Data
  const {
    data: HomeBannerData,
    isLoading: HomeBannerDataIsLoading,
    error: HomeBannerDataError,
  } = useQuery({
    queryKey: ["HomeBannerData"],
    queryFn: () => axiosPublic.get(`/Home-Banner`).then((res) => res.data),
  });

  // Fetching PostedJobs Data
  const {
    data: PostedJobsData,
    isLoading: PostedJobsDataIsLoading,
    error: PostedJobsDataError,
  } = useQuery({
    queryKey: ["PostedJobsData"],
    queryFn: () => axiosPublic.get(`/Posted-Job`).then((res) => res.data),
  });

  // Fetching PostedGigsData
  const {
    data: PostedGigsData,
    isLoading: PostedGigsDataIsLoading,
    error: PostedGigsDataError,
  } = useQuery({
    queryKey: ["PostedGigsData"],
    queryFn: () => axiosPublic.get(`/Posted-Gig`).then((res) => res.data),
  });

  // Fetching CompanyProfilesData
  const {
    data: CompanyProfilesData,
    isLoading: CompanyProfilesDataIsLoading,
    error: CompanyProfilesDataError,
  } = useQuery({
    queryKey: ["CompanyProfilesData"],
    queryFn: () => axiosPublic.get(`/Company-Profiles`).then((res) => res.data),
  });

  // Fetching SalaryInsightData
  const {
    data: SalaryInsightData,
    isLoading: SalaryInsightDataIsLoading,
    error: SalaryInsightDataError,
  } = useQuery({
    queryKey: ["SalaryInsightData"],
    queryFn: () => axiosPublic.get(`/Salary-Insight`).then((res) => res.data),
  });

  // Fetching UpcomingEventsData
  const {
    data: UpcomingEventsData,
    isLoading: UpcomingEventsDataIsLoading,
    error: UpcomingEventsDataError,
  } = useQuery({
    queryKey: ["UpcomingEventsData"],
    queryFn: () => axiosPublic.get(`/Upcoming-Events`).then((res) => res.data),
  });

  // Fetching CoursesData
  const {
    data: CoursesData,
    isLoading: CoursesDataIsLoading,
    error: CoursesDataError,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get(`/Courses`).then((res) => res.data),
  });

  // Fetching MentorshipData
  const {
    data: MentorshipData,
    isLoading: MentorshipDataIsLoading,
    error: MentorshipDataError,
  } = useQuery({
    queryKey: ["MentorshipData"],
    queryFn: () => axiosPublic.get(`/Mentorship`).then((res) => res.data),
  });

  // Fetching InternshipData
  const {
    data: InternshipData,
    isLoading: InternshipDataIsLoading,
    error: InternshipDataError,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: () => axiosPublic.get(`/Internship`).then((res) => res.data),
  });

  // Fetching TestimonialsData
  const {
    data: testimonialsData,
    isLoading: testimonialsDataIsLoading,
    error: testimonialsDataError,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
  });

  // Fetching WhyChooseUsData
  const {
    data: WhyChooseUsData,
    isLoading: WhyChooseUsDataIsLoading,
    error: WhyChooseUsDataError,
  } = useQuery({
    queryKey: ["WhyChooseUsData"],
    queryFn: () => axiosPublic.get(`/WhyChooseUs`).then((res) => res.data),
  });

  // Loading and error states (render below hooks)
  if (
    HomeBannerDataIsLoading ||
    PostedJobsDataIsLoading ||
    PostedGigsDataIsLoading ||
    CompanyProfilesDataIsLoading ||
    SalaryInsightDataIsLoading ||
    UpcomingEventsDataIsLoading ||
    CoursesDataIsLoading ||
    MentorshipDataIsLoading ||
    InternshipDataIsLoading ||
    testimonialsDataIsLoading ||
    WhyChooseUsDataIsLoading
  ) {
    return <Loader />;
  }

  if (
    HomeBannerDataError ||
    PostedJobsDataError ||
    PostedGigsDataError ||
    CompanyProfilesDataError ||
    SalaryInsightDataError ||
    UpcomingEventsDataError ||
    CoursesDataError ||
    MentorshipDataError ||
    InternshipDataError ||
    testimonialsDataError ||
    WhyChooseUsDataError
  ) {
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

  return (
    <div>
      {/* Render components after loading and error are handled */}
      <HomeBanners HomeBannerData={HomeBannerData} />
      <FeaturedJobs PostedJobsData={PostedJobsData} />
      <FeaturedGigs PostedGigsData={PostedGigsData} />
      <FeaturedCompanyProfiles CompanyProfilesData={CompanyProfilesData} />
      <FeaturedSalaryInsights SalaryInsightData={SalaryInsightData} />
      <FeaturedUpcomingEvents UpcomingEventsData={UpcomingEventsData} />
      <FeaturedCourses CoursesData={CoursesData} />
      <MentorshipPrograms MentorshipData={MentorshipData} />
      <InternshipPrograms InternshipData={InternshipData} />
      <NewsLetter />
      <Testimonials testimonialsData={testimonialsData} />
      <WhyChooseUs WhyChooseUsData={WhyChooseUsData} />
    </div>
  );
};

export default Home;
