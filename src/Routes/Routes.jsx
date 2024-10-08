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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
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
          fetch(`http://localhost:5000/Posted-Job/${params.id}`),
      },
      {
        path: "/Gigs",
        element: <Gigs></Gigs>,
      },
      {
        path: "/PostedGigsDetails/:id",
        element: <PostedGigDetail></PostedGigDetail>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/Posted-Gig/${params.id}`),
      },
      {
        path: "/CompanyProfiles",
        element: <CompanyProfiles></CompanyProfiles>,
      },
      {
        path: "/CompanyProfiles/:id",
        element: <CompanyProfileDetails></CompanyProfileDetails>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/Company-Profiles/${params.id}`),
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
          fetch(`http://localhost:5000/Upcoming-Events/${params.id}`),
      },
      {
        path: "/Courses",
        element: <Courses></Courses>,
      },
      {
        path: "/Courses/:id",
        element: <CoursesDetails></CoursesDetails>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/Courses/${params.id}`),
      },
      {
        path: "/Mentorship",
        element: <Mentorship></Mentorship>,
      },
      {
        path: "/Mentorship/:id",
        element: <MentorshipDetails></MentorshipDetails>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/Mentorship/${params.id}`),
      },
      {
        path: "/Internship",
        element: <Internship></Internship>,
      },
      {
        path: "/Internship/:id",
        element: <InternshipDetails></InternshipDetails>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/Internship/${params.id}`),
      },
      {
        path: "/Login",
        element: <Login></Login>,
      },
    ],
  },
]);
