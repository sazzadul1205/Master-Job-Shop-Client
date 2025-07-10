// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Components
import HomeBanners from "./HomeBanner/HomeBanner";

// Components
import FeaturedCompanyProfiles from "./FeaturedCompanyProfiles/FeaturedCompanyProfiles";
import FeaturedSalaryInsights from "./FeaturedSalaryInsights/FeaturedSalaryInsights";
import FeaturedTestimonials from "./FeaturedTestimonials/FeaturedTestimonials";
import FeaturedInternships from "./FeaturedInternships/FeaturedInternships";
import FeaturedMentorship from "./FeaturedMentorship/FeaturedMentorship";
import FeaturedCourses from "./FeaturedCourses/FeaturedCourses";
import FeaturedEvents from "./FeaturedEvents/FeaturedEvents";
import FeaturedBlogs from "./FeaturedBlogs/FeaturedBlogs";
import FeaturedGigs from "./FeaturedGigs/FeaturedGigs";
import FeaturedJobs from "./FeaturedJobs/FeaturedJobs";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";
import NewsLetter from "./NewsLetter/NewsLetter";


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
    data: CoursesData,
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

  return (
    <>
      <HomeBanners />

      <FeaturedJobs JobsData={JobsData} />

      <FeaturedGigs GigsData={GigsData} />

      <FeaturedInternships InternshipData={InternshipData} />

      <FeaturedMentorship MentorshipData={MentorshipData} />

      <FeaturedCourses CoursesData={CoursesData} />

      <FeaturedEvents EventsData={EventsData} />

      <FeaturedSalaryInsights InsightsData={InsightsData} />

      <FeaturedCompanyProfiles CompanyData={CompanyData} />

      <FeaturedBlogs BlogsData={BlogsData} />

      <FeaturedTestimonials TestimonialsData={TestimonialsData} />

      <NewsLetter />

      <WhyChooseUs />
    </>
  );
};

export default Home;
