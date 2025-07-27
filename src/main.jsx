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
import MyJobApplications from "./Pages/(Member_Pages)/MyJobApplications/MyJobApplications";

// Gigs
import Gigs from "./Pages/(Public_Pages)/Gigs/Gigs";
import MyGigBids from "./Pages/(Member_Pages)/MyGigBids/MyGigBids";
import GigBiddingpage from "./Pages/(Public_Pages)/GigBiddingpage/GigBiddingpage";

// Blogs
import Blogs from "./Pages/(Public_Pages)/Blogs/Blogs";

// Courses
import Courses from "./Pages/(Public_Pages)/Courses/Courses";
import CoursesApplyPage from "./Pages/(Public_Pages)/CoursesApplyPage/CoursesApplyPage";

// Mentorship
import Mentorship from "./Pages/(Public_Pages)/Mentorship/Mentorship";
import MentorshipApplyPage from "./Pages/(Public_Pages)/MentorshipApplyPage/MentorshipApplyPage";
import MyMentorshipApplications from "./Pages/(Member_Pages)/MyMentorshipApplications/MyMentorshipApplications";

// Internship
import Internship from "./Pages/(Public_Pages)/Internship/Internship";
import InternshipApplyPage from "./Pages/(Public_Pages)/InternshipApplyPage/InternshipApplyPage";
import MyInternshipApplications from "./Pages/(Member_Pages)/MyInternshipApplications/MyInternshipApplications";

// Event
import Events from "./Pages/(Public_Pages)/Events/Events";
import MyEventApplications from "./Pages/(Member_Pages)/MyEventApplications/MyEventApplications";
import EventApplicationPage from "./Pages/(Public_Pages)/EventApplicationPage/EventApplicationPage";

// Company Profile
import CompanyProfiles from "./Pages/(Public_Pages)/CompanyProfiles/CompanyProfiles";
import MyCourseApplications from "./Pages/(Member_Pages)/MyCourseApplications/MyCourseApplications";
import CompanyProfilesDetails from "./Pages/(Public_Pages)/CompanyProfilesDetails/CompanyProfilesDetails";

// Testimonials
import Testimonials from "./Pages/(Public_Pages)/Testimonials/Testimonials";

// About Us
import AboutUs from "./Pages/(Public_Pages)/AboutUs/AboutUs";

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
              <Route
                path="/MyJobApplications"
                element={<MyJobApplications />}
              />

              {/* Gigs Part */}
              <Route path="/Gigs" element={<Gigs />} />
              <Route path="/Gigs/Bidding/:gigId" element={<GigBiddingpage />} />
              <Route path="/MyGigBids" element={<MyGigBids />} />

              {/* Blogs Part */}
              <Route path="/Blogs" element={<Blogs />} />

              {/* Courses */}
              <Route path="/Courses" element={<Courses />} />
              <Route
                path="/Courses/Apply/:courseId"
                element={<CoursesApplyPage />}
              />
              <Route
                path="/MyCourseApplications"
                element={<MyCourseApplications />}
              />

              {/* Mentorship */}
              <Route path="/Mentorship" element={<Mentorship />} />
              <Route
                path="/Mentorship/Apply/:mentorshipId"
                element={<MentorshipApplyPage />}
              />
              <Route
                path="/MyMentorshipApplication"
                element={<MyMentorshipApplications />}
              />

              {/* Internship */}
              <Route path="/Internship" element={<Internship />} />
              <Route
                path="/Internship/Apply/:internshipId"
                element={<InternshipApplyPage />}
              />
              <Route
                path="/MyInternshipApplications"
                element={<MyInternshipApplications />}
              />

              {/* Events */}
              <Route path="/Events" element={<Events />} />
              <Route
                path="/Events/Apply/:eventId"
                element={<EventApplicationPage />}
              />
              <Route
                path="/MyEventApplications"
                element={<MyEventApplications />}
              />

              {/* Company Profiles */}
              <Route path="/CompanyProfiles" element={<CompanyProfiles />} />
              <Route
                path="/CompanyProfiles/:companyId"
                element={<CompanyProfilesDetails />}
              />

              {/* Testimonials */}
              <Route path="/Testimonials" element={<Testimonials />} />

              {/* About Us */}
              <Route path="/AboutUs" element={<AboutUs />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
