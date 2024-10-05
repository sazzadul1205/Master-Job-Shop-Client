import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Jobs from "../Pages/Jobs/Jobs";
import PostedJobDetail from "../Pages/PostedJobDetail/PostedJobDetail";
import Gigs from "../Pages/Gigs/Gigs";
import PostedGigDetail from "../Pages/PostedGigDetail/PostedGigDetail";

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
    ],
  },
]);
