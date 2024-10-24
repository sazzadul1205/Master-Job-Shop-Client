import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Jobs from "../Pages/Jobs/Jobs";
import PostedJobDetail from "../Pages/Jobs/PostedJobDetail/PostedJobDetail";
import Gigs from "../Pages/Gigs/Gigs";
import PostedGigDetail from "../Pages/Gigs/PostedGigDetail/PostedGigDetail";
import CompanyProfileDetails from "../Pages/CompanyProfiles/CompanyProfileDetails/CompanyProfileDetails";
import UpcomingEvents from "../Pages/UpcomingEvents/UpcomingEvents";
import SalaryInsights from "../Pages/SalaryInsights/SalaryInsights";
import CompanyProfiles from "../Pages/CompanyProfiles/CompanyProfiles";
import UpcomingEventsDetails from "../Pages/UpcomingEvents/UpcomingEventsDetails/UpcomingEventsDetails";
import Courses from "../Pages/Courses/Courses";
import CoursesDetails from "../Pages/Courses/CoursesDetails/CoursesDetails";
import Mentorship from "../Pages/Mentorship/Mentorship";
import MentorshipDetails from "../Pages/Mentorship/MentorshipDetails/MentorshipDetails";
import Internship from "../Pages/Internship/Internship";
import InternshipDetails from "../Pages/Internship/InternshipDetails/InternshipDetails";
import Login from "../Pages/Auth/Login/Login";
import SignUp from "../Pages/Auth/SignUp/SignUp";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Blogs from "../Pages/Blogs/Blogs";
import Testimonials from "../Pages/Testimonials/Testimonials";
import NotFound from "../Pages/NotFound/NotFound";
import DashboardLayout from "../Layouts/DashboardLayout";
import AdminOverview from "../DashboardPages/Admin/AdminOverview/AdminOverview";
import AdminManageUsers from "../DashboardPages/Admin/AdminManageUsers/AdminManageUsers";
import ManageJobs from "../DashboardPages/Admin/ManageJobs/ManageJobs";
import ManageGigs from "../DashboardPages/Admin/ManageGigs/ManageGigs";
import ManageCompany from "../DashboardPages/Admin/ManageCompany/ManageCompany";
import ManageSalaryInsights from "../DashboardPages/Admin/ManageSalaryInsights/ManageSalaryInsights";
import ManageUpcomingEvents from "../DashboardPages/Admin/ManageUpcomingEvents/ManageUpcomingEvents";
import ManageCourses from "../DashboardPages/Admin/ManageCourses/ManageCourses";
import ManageMentorship from "../DashboardPages/Admin/ManageMentorship/ManageMentorship";
import ManageInternship from "../DashboardPages/Admin/ManageInternship/ManageInternship";
import ManageNewsletter from "../DashboardPages/Admin/ManageNewsletter/ManageNewsletter";
import ManageTestimonials from "../DashboardPages/Admin/ManageTestimonials/ManageTestimonials";
import ManageBlogs from "../DashboardPages/Admin/ManageBlogs/ManageBlogs";
import DetailsLogs from "../DashboardPages/Admin/DetailsLogs/DetailsLogs";
import ManageJobApplicant from "../DashboardPages/User/ManageJobApplicant/ManageJobApplicant";
import ManageGigApplicant from "../DashboardPages/User/ManageGigApplicant/ManageGigApplicant";
import ManageCompanyInfo from "../DashboardPages/User/MangeCompanyInfo/MangeCompanyInfo";
import ManageMyEvent from "../DashboardPages/User/ManageMyEvent/ManageMyEvent";
import ManageMyCourse from "../DashboardPages/User/ManageMyCourse/ManageMyCourse";
import ManageMyMentorship from "../DashboardPages/User/ManageMyMentorship/ManageMyMentorship";
import ManageMyInternship from "../DashboardPages/User/ManageMyInternship/ManageMyInternship";
import ManageMyTestimonial from "../DashboardPages/User/ManageMyTestimonial/ManageMyTestimonial";
import ManageMyBlog from "../DashboardPages/User/ManageMyBlog/ManageMyBlog";
import UserOverview from "../DashboardPages/User/UserOverview/UserOverview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/Jobs",
        element: <Jobs></Jobs>,
      },
      {
        path: "/PostedJobsDetails/:id",
        element: <PostedJobDetail></PostedJobDetail>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Posted-Job/${params.id}`
          ),
      },
      {
        path: "/Gigs",
        element: <Gigs></Gigs>,
      },
      {
        path: "/PostedGigsDetails/:id",
        element: <PostedGigDetail></PostedGigDetail>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Posted-Gig/${params.id}`
          ),
      },
      {
        path: "/CompanyProfiles",
        element: <CompanyProfiles></CompanyProfiles>,
      },
      {
        path: "/CompanyProfiles/:id",
        element: <CompanyProfileDetails></CompanyProfileDetails>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Company-Profiles/${params.id}`
          ),
      },
      {
        path: "/SalaryInsights",
        element: <SalaryInsights></SalaryInsights>,
      },
      {
        path: "/UpcomingEvents",
        element: <UpcomingEvents></UpcomingEvents>,
      },
      {
        path: "/UpcomingEventsDetails/:id",
        element: <UpcomingEventsDetails></UpcomingEventsDetails>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Upcoming-Events/${params.id}`
          ),
      },
      {
        path: "/Courses",
        element: <Courses></Courses>,
      },
      {
        path: "/Courses/:id",
        element: <CoursesDetails></CoursesDetails>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Courses/${params.id}`
          ),
      },
      {
        path: "/Mentorship",
        element: <Mentorship></Mentorship>,
      },
      {
        path: "/Mentorship/:id",
        element: <MentorshipDetails></MentorshipDetails>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Mentorship/${params.id}`
          ),
      },
      {
        path: "/Internship",
        element: <Internship></Internship>,
      },
      {
        path: "/Internship/:id",
        element: <InternshipDetails></InternshipDetails>,
        loader: ({ params }) =>
          fetch(
            `https://master-job-shop-server.vercel.app/Internship/${params.id}`
          ),
      },
      {
        path: "/Login",
        element: <Login></Login>,
      },
      {
        path: "/SignUp",
        element: <SignUp></SignUp>,
      },
      {
        path: "/AboutUS",
        element: <AboutUs></AboutUs>,
      },
      {
        path: "/Blogs",
        element: <Blogs></Blogs>,
      },
      {
        path: "/Testimonials",
        element: <Testimonials></Testimonials>,
      },
    ],
  },
  {
    path: "/Dashboard",
    element: <DashboardLayout></DashboardLayout>,
    children: [
      {
        path: "AdminOverview",
        element: <AdminOverview></AdminOverview>,
      },
      {
        path: "userOverview",
        element: <UserOverview></UserOverview>,
      },
      {
        path: "AdminManageUsers",
        element: <AdminManageUsers></AdminManageUsers>,
      },
      {
        path: "ManageJobs",
        element: <ManageJobs></ManageJobs>,
      },
      {
        path: "ManageGigs",
        element: <ManageGigs></ManageGigs>,
      },
      {
        path: "ManageCompany",
        element: <ManageCompany></ManageCompany>,
      },
      {
        path: "ManageSalaryInsight",
        element: <ManageSalaryInsights></ManageSalaryInsights>,
      },
      {
        path: "ManageUpcomingEvent",
        element: <ManageUpcomingEvents></ManageUpcomingEvents>,
      },
      {
        path: "ManageCourses",
        element: <ManageCourses></ManageCourses>,
      },
      {
        path: "ManageMentorship",
        element: <ManageMentorship></ManageMentorship>,
      },
      {
        path: "ManageInternship",
        element: <ManageInternship></ManageInternship>,
      },
      {
        path: "ManageNewsLetter",
        element: <ManageNewsletter></ManageNewsletter>,
      },
      {
        path: "ManageTestimonials",
        element: <ManageTestimonials></ManageTestimonials>,
      },
      {
        path: "ManageBlogs",
        element: <ManageBlogs></ManageBlogs>,
      },
      {
        path: "DetailedLog",
        element: <DetailsLogs></DetailsLogs>,
      },

      {
        path: "ManageJobApplicants",
        element: <ManageJobApplicant></ManageJobApplicant>,
      },
      {
        path: "ManageGigApplicant",
        element: <ManageGigApplicant></ManageGigApplicant>,
      },
      {
        path: "ManageCompanyInfo",
        element: <ManageCompanyInfo></ManageCompanyInfo>,
      },
      {
        path: "ManageMyevent",
        element: <ManageMyEvent></ManageMyEvent>,
      },
      {
        path: "ManageMyCourse",
        element: <ManageMyCourse></ManageMyCourse>,
      },
      {
        path: "ManageMyMentorship",
        element: <ManageMyMentorship></ManageMyMentorship>,
      },
      {
        path: "ManageMyInternship",
        element: <ManageMyInternship></ManageMyInternship>,
      },
      {
        path: "ManageMyTestimonials",
        element: <ManageMyTestimonial></ManageMyTestimonial>,
      },
      {
        path: "ManageMyBlogs",
        element: <ManageMyBlog></ManageMyBlog>,
      },
    ],
  },
]);
