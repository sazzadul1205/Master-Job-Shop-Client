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
import EmployerLayout from "./Layouts/EmployerLayout";

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

// User Profile
import UserProfile from "./Pages/(Member_Pages)/UserProfile/UserProfile";

// Member Private Route
import MemberPrivateRoute from "./Routes/MemberPrivateRoute";

// Deleted User Page
import DeletedUser from "./Pages/DeletedUser/DeletedUser";

// Public User Profile
import PublicUserProfile from "./Pages/(Public_Pages)/PublicUserProfile/PublicUserProfile";

// Become Employer Page
import BecomeEmployer from "./Pages/BecomeEmployer/BecomeEmployer";

// Become Mentor Page
import BecomeMentor from "./Pages/BecomeMentor/BecomeMentor";

// Employer Pages
import ManageGigs from "./Pages/(Employer_Pages)/ManageGigs/ManageGigs";
import ManageJobs from "./Pages/(Employer_Pages)/ManageJobs/ManageJobs";
import ManageGigBids from "./Pages/(Employer_Pages)/ManageGigBids/ManageGigBids";
import ManageInternship from "./Pages/(Employer_Pages)/ManageInternship/ManageInternship";
import EmployerDashboard from "./Pages/(Employer_Pages)/EmployerDashboard/EmployerDashboard";
import ManageCompanyProfile from "./Pages/(Employer_Pages)/ManageCompanyProfile/ManageCompanyProfile";
import ManageJobApplications from "./Pages/(Employer_Pages)/ManageJobApplications/ManageJobApplications";
import ManageInternshipApplications from "./Pages/(Employer_Pages)/ManageInternshipApplications/ManageInternshipApplications";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Deleted User */}
            <Route path="/DeletedUser" element={<DeletedUser />} />

            {/* Home Page Layout */}
            <Route element={<MainLayout />}>
              {/* Home Pages Link */}
              <Route path="/" element={<Home />} />

              {/* Auth Pages */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SignUpDetails />} />
            </Route>

            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              {/* Jobs Part */}
              <Route path="/Jobs" element={<Jobs />} />
              <Route
                path="/Jobs/Apply/:jobId"
                element={
                  <MemberPrivateRoute>
                    <JobsApplyPage />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/MyJobApplications"
                element={
                  <MemberPrivateRoute>
                    <MyJobApplications />
                  </MemberPrivateRoute>
                }
              />

              {/* Gigs Part */}
              <Route path="/Gigs" element={<Gigs />} />
              <Route
                path="/Gigs/Bidding/:gigId"
                element={
                  <MemberPrivateRoute>
                    <GigBiddingpage />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/MyGigBids"
                element={
                  <MemberPrivateRoute>
                    <MyGigBids />
                  </MemberPrivateRoute>
                }
              />

              {/* Blogs Part */}
              <Route path="/Blogs" element={<Blogs />} />

              {/* Courses */}
              <Route path="/Courses" element={<Courses />} />
              <Route
                path="/Courses/Apply/:courseId"
                element={
                  <MemberPrivateRoute>
                    <CoursesApplyPage />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/MyCourseApplications"
                element={
                  <MemberPrivateRoute>
                    <MyCourseApplications />
                  </MemberPrivateRoute>
                }
              />

              {/* Mentorship */}
              <Route path="/Mentorship" element={<Mentorship />} />
              <Route
                path="/Mentorship/Apply/:mentorshipId"
                element={
                  <MemberPrivateRoute>
                    <MentorshipApplyPage />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/MyMentorshipApplication"
                element={
                  <MemberPrivateRoute>
                    <MyMentorshipApplications />
                  </MemberPrivateRoute>
                }
              />

              {/* Internship */}
              <Route path="/Internship" element={<Internship />} />
              <Route
                path="/Internship/Apply/:internshipId"
                element={
                  <MemberPrivateRoute>
                    <InternshipApplyPage />
                  </MemberPrivateRoute>
                }
              />
              <Route
                path="/MyInternshipApplications"
                element={
                  <MemberPrivateRoute>
                    <MyInternshipApplications />
                  </MemberPrivateRoute>
                }
              />

              {/* Events */}
              <Route path="/Events" element={<Events />} />
              <Route
                path="/Events/Apply/:eventId"
                element={<EventApplicationPage />}
              />
              <Route
                path="/MyEventApplications"
                element={
                  <MemberPrivateRoute>
                    <MyEventApplications />
                  </MemberPrivateRoute>
                }
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

              {/* User Profile */}
              <Route path="/MyProfile" element={<UserProfile />} />

              {/* Public User Profile */}
              <Route path="/Profile/:email" element={<PublicUserProfile />} />

              {/* Become Employer */}
              <Route path="/BecomeEmployer" element={<BecomeEmployer />} />

              {/* Become Mentor */}
              <Route path="/BecomeMentor" element={<BecomeMentor />} />
            </Route>

            {/* Employer Route */}
            <Route element={<EmployerLayout />}>
              {/* Employer Dashboard */}
              <Route
                path="/Employer/Dashboard"
                element={<EmployerDashboard />}
              />

              {/* Company Profile */}
              <Route
                path="/Employer/CompanyProfile"
                element={<ManageCompanyProfile />}
              />

              {/* Employer Jobs */}
              <Route path="/Employer/Jobs" element={<ManageJobs />} />

              {/* Employer Jobs */}
              <Route
                path="/Employer/JobApplications"
                element={<ManageJobApplications />}
              />

              {/* Employer Gigs */}
              <Route path="/Employer/Gigs" element={<ManageGigs />} />

              {/* Employer Gig Bids */}
              <Route path="/Employer/GigBids" element={<ManageGigBids />} />

              {/* Employer Internship */}
              <Route
                path="/Employer/Internship"
                element={<ManageInternship />}
              />

              {/* Employer Internship Application */}
              <Route
                path="/Employer/InternshipApplications"
                element={<ManageInternshipApplications />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
