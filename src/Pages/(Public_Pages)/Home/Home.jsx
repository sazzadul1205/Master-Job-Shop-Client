// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";

// Components
import HomeBanners from "./HomeBanner/HomeBanner";

// Components
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import FeaturedGigs from "./FeaturedGigs/FeaturedGigs";
import FeaturedInternships from "./FeaturedInternships/FeaturedInternships";
import FeaturedMentorship from "./FeaturedMentorship/FeaturedMentorship";

// Extra
import CoursesData from "../../../JSON/Course_Data.json";
import FeaturedCourses from "./FeaturedCourses/FeaturedCourses";

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

  // Fetching InternshipData
  const {
    data: InternshipData,
    isLoading: InternshipIsLoading,
    error: InternshipError,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: () => axiosPublic.get(`/Internship`).then((res) => res.data),
  });

  // Fetching MentorshipData
  const {
    data: MentorshipData,
    isLoading: MentorshipIsLoading,
    error: MentorshipError,
  } = useQuery({
    queryKey: ["MentorshipData"],
    queryFn: () => axiosPublic.get(`/Mentorship`).then((res) => res.data),
  });

  // Fetching CoursesData
  const {
    // data: CoursesData,
    isLoading: CoursesIsLoading,
    error: CoursesError,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get(`/Courses`).then((res) => res.data),
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

  // Fetching InsightsData
  const {
    data: InsightsData,
    isLoading: InsightsDataIsLoading,
    error: InsightsDataError,
  } = useQuery({
    queryKey: ["InsightsData"],
    queryFn: () => axiosPublic.get(`/Insights`).then((res) => res.data),
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

  // Fetching Blogs Data
  const {
    data: BlogsData,
    isLoading: BlogsIsLoading,
    error: BlogsError,
  } = useQuery({
    queryKey: ["BlogsData"],
    queryFn: () => axiosPublic.get(`/Blogs`).then((res) => res.data),
  });

  // Fetching Testimonials Data
  const {
    data: TestimonialsData,
    isLoading: TestimonialsIsLoading,
    error: TestimonialsError,
  } = useQuery({
    queryKey: ["TestimonialsData"],
    queryFn: () => axiosPublic.get(`/Testimonials`).then((res) => res.data),
  });

  // Loading
  if (
    InsightsDataIsLoading ||
    TestimonialsIsLoading ||
    MentorshipIsLoading ||
    InternshipIsLoading ||
    CoursesIsLoading ||
    CompanyIsLoading ||
    EventsIsLoading ||
    JobsIsLoading ||
    GigsIsLoading ||
    BlogsIsLoading
  ) {
    return <Loading />;
  }

  // Error
  if (
    TestimonialsError ||
    InsightsDataError ||
    MentorshipError ||
    InternshipError ||
    CoursesError ||
    CompanyError ||
    EventsError ||
    BlogsError ||
    JobsError ||
    GigsError
  ) {
    return <Error />;
  }

  console.log("TestimonialsData", TestimonialsData);
  console.log("MentorshipData", MentorshipData);
  console.log("InternshipData", InternshipData);
  console.log("InsightsData", InsightsData);
  console.log("CoursesData", CoursesData);
  console.log("CompanyData", CompanyData);
  console.log("EventsData", EventsData);
  console.log("BlogsData", BlogsData);
  console.log("JobsData", JobsData);
  console.log("GigsData", GigsData);

  return (
    <>
      <HomeBanners />

      <FeaturedJobs JobsData={JobsData} />

      <FeaturedGigs GigsData={GigsData} />

      <FeaturedInternships InternshipData={InternshipData} />

      <FeaturedMentorship MentorshipData={MentorshipData} />

      <FeaturedCourses CoursesData={CoursesData} />
      {/* 
      <FeaturedCompanyProfiles CompanyProfilesData={CompanyProfilesData} />
      <FeaturedSalaryInsights SalaryInsightData={SalaryInsightData} />
      <FeaturedUpcomingEvents UpcomingEventsData={UpcomingEventsData} />
      <NewsLetter />
      <Testimonials testimonialsData={testimonialsData} />
      <WhyChooseUs WhyChooseUsData={WhyChooseUsData} /> */}
    </>
  );
};

export default Home;
