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
    ],
  },
]);
