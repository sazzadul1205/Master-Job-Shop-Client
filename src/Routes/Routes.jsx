import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import Jobs from "../Pages/Jobs/Jobs";
import PostedJobDetail from "../Pages/PostedJobDetail/PostedJobDetail";

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
        path: "/jobs",
        element: <Jobs></Jobs>,
      },
      {
        path: "/PostedJobsDetails/:id",
        element: <PostedJobDetail></PostedJobDetail>,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/Posted-Job/${params.id}`),
      },
    ],
  },
]);
