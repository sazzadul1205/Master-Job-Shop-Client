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
import { Helmet } from "react-helmet";
import Loading from "../Shared/Loading/Loading";

const Home = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching Jobs Data
  const {
    data: JobsData,
    isLoading: JobsIsLoading,
    error: JobsError,
  } = useQuery({
    queryKey: ["JobsData"],
    queryFn: () => axiosPublic.get(`/Jobs`).then((res) => res.data),
  });

  // Fetching GigsData
  const {
    data: GigsData,
    isLoading: GigsIsLoading,
    error: GigsError,
  } = useQuery({
    queryKey: ["PostedGigsData"],
    queryFn: () => axiosPublic.get(`/Gigs`).then((res) => res.data),
  });

  // Fetching CompanyData
  const {
    data: CompanyData,
    isLoading: CompanyIsLoading,
    error: CompanyError,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () => axiosPublic.get(`/Company`).then((res) => res.data),
  });

  // Fetching InsightsData
  const {
    data: InsightsData,
    isLoading: InsightsDataIsLoading,
    error: InsightsDataError,
  } = useQuery({
    queryKey: ["InsightsData"],
    queryFn: () => axiosPublic.get(`/Insights`).then((res) => res.data),
  });

  // Fetching EventsData
  const {
    data: EventsData,
    isLoading: EventsIsLoading,
    error: EventsError,
  } = useQuery({
    queryKey: ["EventsData"],
    queryFn: () => axiosPublic.get(`/Events`).then((res) => res.data),
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
    CompanyProfilesDataIsLoading ||
    UpcomingEventsDataIsLoading ||
    SalaryInsightDataIsLoading ||
    testimonialsDataIsLoading ||
    PostedJobsDataIsLoading ||
    PostedGigsDataIsLoading ||
    MentorshipDataIsLoading ||
    InternshipDataIsLoading ||
    WhyChooseUsDataIsLoading ||
    CoursesDataIsLoading
  ) {
    return <Loading />;
  }

  if (
    CompanyProfilesDataError ||
    UpcomingEventsDataError ||
    SalaryInsightDataError ||
    testimonialsDataError ||
    WhyChooseUsDataError ||
    MentorshipDataError ||
    InternshipDataError ||
    PostedJobsDataError ||
    PostedGigsDataError ||
    CoursesDataError
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
      <HomeBanners />
      {/* <FeaturedJobs PostedJobsData={PostedJobsData} />
      <FeaturedGigs PostedGigsData={PostedGigsData} />
      <FeaturedCompanyProfiles CompanyProfilesData={CompanyProfilesData} />
      <FeaturedSalaryInsights SalaryInsightData={SalaryInsightData} />
      <FeaturedUpcomingEvents UpcomingEventsData={UpcomingEventsData} />
      <FeaturedCourses CoursesData={CoursesData} />
      <MentorshipPrograms MentorshipData={MentorshipData} />
      <InternshipPrograms InternshipData={InternshipData} />
      <NewsLetter />
      <Testimonials testimonialsData={testimonialsData} />
      <WhyChooseUs WhyChooseUsData={WhyChooseUsData} /> */}
    </div>
  );
};

export default Home;
