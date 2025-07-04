// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../Hooks/useAxiosPublic";

// Shared
import Loading from "../../../Shared/Loading/Loading";

// Components
import HomeBanners from "./HomeBanner/HomeBanner";

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

  // Fetching CoursesData
  const {
    data: CoursesData,
    isLoading: CoursesIsLoading,
    error: CoursesError,
  } = useQuery({
    queryKey: ["CoursesData"],
    queryFn: () => axiosPublic.get(`/Courses`).then((res) => res.data),
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

  // Fetching InternshipData
  const {
    data: InternshipData,
    isLoading: InternshipIsLoading,
    error: InternshipError,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: () => axiosPublic.get(`/Internship`).then((res) => res.data),
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

  // Loading and error states (render below hooks)
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
    </>
  );
};

export default Home;
