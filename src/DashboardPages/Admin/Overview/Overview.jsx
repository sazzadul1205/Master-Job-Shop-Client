import Loader from "../../../Pages/Shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const Overview = () => {
  const axiosPublic = useAxiosPublic();

  // Fetching relevant data for Admin
  const {
    data: UsersCount,
    isLoading: UsersCountIsLoading,
    error: UsersCountError,
  } = useQuery({
    queryKey: ["UsersCount"],
    queryFn: () => axiosPublic.get(`/UsersCount`).then((res) => res.data),
  });

  const {
    data: PostedJobCount,
    isLoading: PostedJobCountIsLoading,
    error: PostedJobCountError,
  } = useQuery({
    queryKey: ["PostedJobCount"],
    queryFn: () => axiosPublic.get(`/PostedJobCount`).then((res) => res.data),
  });

  const {
    data: PostedGigCount,
    isLoading: PostedGigCountIsLoading,
    error: PostedGigCountError,
  } = useQuery({
    queryKey: ["PostedGigCount"],
    queryFn: () => axiosPublic.get(`/PostedGigCount`).then((res) => res.data),
  });

  const {
    data: CompanyProfilesCount,
    isLoading: CompanyProfilesCountIsLoading,
    error: CompanyProfilesCountError,
  } = useQuery({
    queryKey: ["CompanyProfilesCount"],
    queryFn: () =>
      axiosPublic.get(`/CompanyProfilesCount`).then((res) => res.data),
  });

  const {
    data: SalaryInsightCount,
    isLoading: SalaryInsightCountIsLoading,
    error: SalaryInsightCountError,
  } = useQuery({
    queryKey: ["SalaryInsightCount"],
    queryFn: () =>
      axiosPublic.get(`/SalaryInsightCount`).then((res) => res.data),
  });

  const {
    data: UpcomingEventsCount,
    isLoading: UpcomingEventsCountIsLoading,
    error: UpcomingEventsCountError,
  } = useQuery({
    queryKey: ["UpcomingEventsCount"],
    queryFn: () =>
      axiosPublic.get(`/UpcomingEventsCount`).then((res) => res.data),
  });

  const {
    data: CoursesCount,
    isLoading: CoursesCountIsLoading,
    error: CoursesCountError,
  } = useQuery({
    queryKey: ["CoursesCount"],
    queryFn: () => axiosPublic.get(`/CoursesCount`).then((res) => res.data),
  });

  const {
    data: MentorshipCount,
    isLoading: MentorshipCountIsLoading,
    error: MentorshipCountError,
  } = useQuery({
    queryKey: ["MentorshipCount"],
    queryFn: () => axiosPublic.get(`/MentorshipCount`).then((res) => res.data),
  });

  const {
    data: InternshipCount,
    isLoading: InternshipCountIsLoading,
    error: InternshipCountError,
  } = useQuery({
    queryKey: ["InternshipCount"],
    queryFn: () => axiosPublic.get(`/InternshipCount`).then((res) => res.data),
  });

  const {
    data: NewsLetterCount,
    isLoading: NewsLetterCountIsLoading,
    error: NewsLetterCountError,
  } = useQuery({
    queryKey: ["NewsLetterCount"],
    queryFn: () => axiosPublic.get(`/NewsLetterCount`).then((res) => res.data),
  });

  const {
    data: TestimonialsCount,
    isLoading: TestimonialsCountIsLoading,
    error: TestimonialsCountError,
  } = useQuery({
    queryKey: ["TestimonialsCount"],
    queryFn: () =>
      axiosPublic.get(`/TestimonialsCount`).then((res) => res.data),
  });

  const {
    data: BlogsCount,
    isLoading: BlogsCountIsLoading,
    error: BlogsCountError,
  } = useQuery({
    queryKey: ["BlogsCount"],
    queryFn: () => axiosPublic.get(`/BlogsCount`).then((res) => res.data),
  });

  // Loading state
  if (
    UsersCountIsLoading ||
    PostedJobCountIsLoading ||
    PostedGigCountIsLoading ||
    CompanyProfilesCountIsLoading ||
    SalaryInsightCountIsLoading ||
    UpcomingEventsCountIsLoading ||
    CoursesCountIsLoading ||
    MentorshipCountIsLoading ||
    InternshipCountIsLoading ||
    NewsLetterCountIsLoading ||
    TestimonialsCountIsLoading ||
    BlogsCountIsLoading
  ) {
    return <Loader />;
  }

  // Error state
  if (
    UsersCountError ||
    PostedJobCountError ||
    PostedGigCountError ||
    CompanyProfilesCountError ||
    SalaryInsightCountError ||
    UpcomingEventsCountError ||
    CoursesCountError ||
    MentorshipCountError ||
    InternshipCountError ||
    NewsLetterCountError ||
    TestimonialsCountError ||
    BlogsCountError
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

  const MetricCard = ({ title, value }) => {
    return (
      <div className="border border-blue-100 bg-gradient-to-bl from-sky-100 to-sky-50 p-4 rounded-lg shadow-md hover:shadow-2xl">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex justify-end">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2">
            {" "}
            Manage{" "}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-black min-h-screen">
      <p className="text-3xl font-bold text-white pl-10 py-5 bg-blue-400">
        Admin Overview
      </p>

      <div className="mb-8 px-5 text-black">
        <h2 className="text-xl font-semibold mb-4 mt-3">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard title="Total Users" value={UsersCount.count} />
          <MetricCard title="Total Jobs" value={PostedJobCount.count} />
          <MetricCard title="Total Gigs" value={PostedGigCount.count} />
          <MetricCard
            title="Total Company Profiles"
            value={CompanyProfilesCount.count}
          />
          <MetricCard
            title="Total Salary Insights"
            value={SalaryInsightCount.count}
          />
          <MetricCard
            title="Total Upcoming Events"
            value={UpcomingEventsCount.count}
          />
          <MetricCard title="Total Courses" value={CoursesCount.count} />
          <MetricCard title="Total Mentorships" value={MentorshipCount.count} />
          <MetricCard title="Total Internships" value={InternshipCount.count} />
          <MetricCard title="Total Newsletters" value={NewsLetterCount.count} />
          <MetricCard
            title="Total Testimonials"
            value={TestimonialsCount.count}
          />
          <MetricCard title="Total Blogs" value={BlogsCount.count} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
