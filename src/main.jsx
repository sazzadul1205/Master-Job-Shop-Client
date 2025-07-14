import "./index.css";

// React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Authentication Provider
import AuthProvider from "./Provider/AuthProvider";

// Layouts
import MainLayout from "./Layouts/MainLayout";
import PublicLayout from "./Layouts/PublicLayout";

// Public Pages
import Home from "./Pages/(Public_Pages)/Home/Home";

// Auth Pages
import Login from "./Pages/(Auth_Pages)/Login/Login";
import SignUp from "./Pages/(Auth_Pages)/SignUp/SignUp";
import SignUpDetails from "./Pages/(Auth_Pages)/SignUpDetails/SignUpDetails";

// Jobs
import Jobs from "./Pages/(Public_Pages)/Jobs/Jobs";
import JobsApplyPage from "./Pages/(Public_Pages)/JobsApplyPage/JobsApplyPage";

// Gigs
import Gigs from "./Pages/(Public_Pages)/Gigs/Gigs";
import GigBiddingpage from "./Pages/(Public_Pages)/GigBiddingpage/GigBiddingpage";

// Blogs
import Blogs from "./Pages/(Public_Pages)/Blogs/Blogs";

// Courses
import Courses from "./Pages/(Public_Pages)/Courses/Courses";
import CoursesApplyPage from "./Pages/(Public_Pages)/CoursesApplyPage/CoursesApplyPage";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Home Page Layout */}
            <Route element={<MainLayout />}>
              {/* Home Pages Link */}
              <Route path="/" element={<Home />} />

              {/* Auth Pages */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SignUpDetails />} />
            </Route>

            <Route element={<PublicLayout />}>
              {/* Jobs Part */}
              <Route path="/Jobs" element={<Jobs />} />
              <Route path="/Jobs/Apply/:jobId" element={<JobsApplyPage />} />

              {/* Gigs Part */}
              <Route path="/Gigs" element={<Gigs />} />
              <Route path="/Gigs/Bidding/:gigId" element={<GigBiddingpage />} />

              {/* Blogs Part */}
              <Route path="/Blogs" element={<Blogs />} />

              {/* Courses */}
              <Route path="/Courses" element={<Courses />} />
              <Route
                path="/Courses/Apply/:courseId"
                element={<CoursesApplyPage />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* <RouterProvider router={router} /> */}
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
