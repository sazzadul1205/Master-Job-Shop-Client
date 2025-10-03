import "./index.css";

// Core React & Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// State & Data
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Providers
import AuthProvider from "./Provider/AuthProvider";

// Layouts
import MainLayout from "./Layouts/MainLayout";
import PublicLayout from "./Layouts/PublicLayout";
import MentorLayout from "./Layouts/MentorLayout";
import EmployerLayout from "./Layouts/EmployerLayout";

// ------------------ Public Pages ------------------

// Main Public Pages
import Home from "./Pages/(Public_Pages)/Home/Home";
import Jobs from "./Pages/(Public_Pages)/Jobs/Jobs";
import Gigs from "./Pages/(Public_Pages)/Gigs/Gigs";
import Events from "./Pages/(Public_Pages)/Events/Events";
import Courses from "./Pages/(Public_Pages)/Courses/Courses";
import Mentorship from "./Pages/(Public_Pages)/Mentorship/Mentorship";
import Internship from "./Pages/(Public_Pages)/Internship/Internship";
import CompanyProfiles from "./Pages/(Public_Pages)/CompanyProfiles/CompanyProfiles";
import CompanyProfilesDetails from "./Pages/(Public_Pages)/CompanyProfilesDetails/CompanyProfilesDetails";

// Extra Public Pages
import Blogs from "./Pages/(Public_Pages)/Blogs/Blogs";
import AboutUs from "./Pages/(Public_Pages)/AboutUs/AboutUs";
import Testimonials from "./Pages/(Public_Pages)/Testimonials/Testimonials";

// Application / Bidding Pages
import JobsApplyPage from "./Pages/(Public_Pages)/JobsApplyPage/JobsApplyPage";
import GigBiddingpage from "./Pages/(Public_Pages)/GigBiddingpage/GigBiddingpage";
import CoursesApplyPage from "./Pages/(Public_Pages)/CoursesApplyPage/CoursesApplyPage";
import MentorshipApplyPage from "./Pages/(Public_Pages)/MentorshipApplyPage/MentorshipApplyPage";
import InternshipApplyPage from "./Pages/(Public_Pages)/InternshipApplyPage/InternshipApplyPage";
import EventApplicationPage from "./Pages/(Public_Pages)/EventApplicationPage/EventApplicationPage";

// Public User
import PublicUserProfile from "./Pages/(Public_Pages)/PublicUserProfile/PublicUserProfile";

// ------------------ Auth Pages ------------------
import Login from "./Pages/(Auth_Pages)/Login/Login";
import SignUp from "./Pages/(Auth_Pages)/SignUp/SignUp";
import SignUpDetails from "./Pages/(Auth_Pages)/SignUpDetails/SignUpDetails";

// ------------------ Member Pages ------------------
import MyGigBids from "./Pages/(Member_Pages)/MyGigBids/MyGigBids";
import UserProfile from "./Pages/(Member_Pages)/UserProfile/UserProfile";
import MyJobApplications from "./Pages/(Member_Pages)/MyJobApplications/MyJobApplications";
import MyEventApplications from "./Pages/(Member_Pages)/MyEventApplications/MyEventApplications";
import MyCourseApplications from "./Pages/(Member_Pages)/MyCourseApplications/MyCourseApplications";
import MyMentorshipApplications from "./Pages/(Member_Pages)/MyMentorshipApplications/MyMentorshipApplications";
import MyInternshipApplications from "./Pages/(Member_Pages)/MyInternshipApplications/MyInternshipApplications";

// ------------------ Employer Pages ------------------
import CompanyDashboard from "./Pages/(Employer_Pages)/CompanyDashboard/CompanyDashboard";
import EmployerDashboard from "./Pages/(Employer_Pages)/EmployerDashboard/EmployerDashboard";

// Manage
import ManageJobs from "./Pages/(Employer_Pages)/ManageJobs/ManageJobs";
import ManageGigs from "./Pages/(Employer_Pages)/ManageGigs/ManageGigs";
import ManageEvents from "./Pages/(Employer_Pages)/ManageEvents/ManageEvents";
import ManageGigBids from "./Pages/(Employer_Pages)/ManageGigBids/ManageGigBids";
import ManageInternship from "./Pages/(Employer_Pages)/ManageInternship/ManageInternship";

// Applications
import ManageJobApplications from "./Pages/(Employer_Pages)/ManageJobApplications/ManageJobApplications";
import ManageEventApplications from "./Pages/(Employer_Pages)/ManageEventApplications/ManageEventApplications";
import ManageInternshipApplications from "./Pages/(Employer_Pages)/ManageInternshipApplications/ManageInternshipApplications";

// Profiles
import ManageCompanyProfile from "./Pages/(Employer_Pages)/ManageCompanyProfile/ManageCompanyProfile";
import ManageEmployerProfile from "./Pages/(Employer_Pages)/ManageEmployerProfile/ManageEmployerProfile";

// ------------------ Mentor Pages ------------------
import MentorProfile from "./Pages/(Mentor_Pages)/MentorProfile/MentorProfile";
import MentorMentees from "./Pages/(Mentor_Pages)/MentorMentees/MentorMentees";
import MentorMessages from "./Pages/(Mentor_Pages)/MentorMessages/MentorMessages";
import MentorDashboard from "./Pages/(Mentor_Pages)/MentorDashboard/MentorDashboard";
import MentorMyCourses from "./Pages/(Mentor_Pages)/MentorMyCourses/MentorMyCourses";
import MentorMyMentorship from "./Pages/(Mentor_Pages)/MentorMyMentorship/MentorMyMentorship";
import MentorNotifications from "./Pages/(Mentor_Pages)/MentorNotifications/MentorNotifications";
import MentorScheduledSessions from "./Pages/(Mentor_Pages)/MentorScheduledSessions/MentorScheduledSessions";
import MentorMyCourseApplications from "./Pages/(Mentor_Pages)/MentorMyCourseApplications/MentorMyCourseApplications";
import MentorMyMentorshipApplications from "./Pages/(Mentor_Pages)/MentorMyMentorshipApplications/MentorMyMentorshipApplications";

// ------------------ Misc Pages ------------------
import DeletedUser from "./Pages/DeletedUser/DeletedUser";
import BecomeMentor from "./Pages/BecomeMentor/BecomeMentor";
import BecomeEmployer from "./Pages/BecomeEmployer/BecomeEmployer";

// ------------------ Routes ------------------
import MemberPrivateRoute from "./Routes/MemberPrivateRoute";
import EmployerPrivateRoute from "./Routes/EmployerPrivateRoute";
import MentorSettings from "./Pages/(Mentor_Pages)/MentorSettings/MentorSettings";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* ========================== Deleted User ========================== */}
            <Route path="/DeletedUser" element={<DeletedUser />} />

            {/* ========================== Home Page Layout ========================== */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />

              {/* --------- Auth Pages --------- */}
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignUp/Details" element={<SignUpDetails />} />
            </Route>

            {/* ========================== Public Pages ========================== */}
            <Route element={<PublicLayout />}>
              {/* --------- Jobs --------- */}
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

              {/* --------- Gigs --------- */}
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

              {/* --------- Courses --------- */}
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

              {/* --------- Mentorship --------- */}
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

              {/* --------- Internship --------- */}
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

              {/* --------- Events --------- */}
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

              {/* --------- Company Profiles --------- */}
              <Route path="/CompanyProfiles" element={<CompanyProfiles />} />
              <Route
                path="/CompanyProfiles/:companyId"
                element={<CompanyProfilesDetails />}
              />

              {/* --------- Other Public Pages --------- */}
              <Route path="/Blogs" element={<Blogs />} />
              <Route path="/Testimonials" element={<Testimonials />} />
              <Route path="/AboutUs" element={<AboutUs />} />

              {/* --------- User Profiles --------- */}
              <Route path="/MyProfile" element={<UserProfile />} />
              <Route path="/Profile/:email" element={<PublicUserProfile />} />

              {/* --------- Become Pages --------- */}
              <Route path="/BecomeEmployer" element={<BecomeEmployer />} />
              <Route path="/BecomeMentor" element={<BecomeMentor />} />
            </Route>

            {/* ========================== Employer Routes ========================== */}
            <Route element={<EmployerLayout />}>
              {/* --------- Employer Dashboard --------- */}
              <Route
                path="/Employer/Employer/Dashboard"
                element={
                  <EmployerPrivateRoute allowedRoles={["Employer"]}>
                    <EmployerDashboard />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Employer Profile --------- */}
              <Route
                path="/Employer/EmployerProfile"
                element={
                  <EmployerPrivateRoute allowedRoles={["Employer"]}>
                    <ManageEmployerProfile />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Company Dashboard --------- */}
              <Route
                path="/Employer/Company/Dashboard"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <CompanyDashboard />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Company Profile --------- */}
              <Route
                path="/Employer/CompanyProfile"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageCompanyProfile />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Jobs & Applications --------- */}
              <Route
                path="/Employer/Jobs"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageJobs />
                  </EmployerPrivateRoute>
                }
              />
              <Route
                path="/Employer/JobApplications"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageJobApplications />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Gigs --------- */}
              <Route
                path="/Employer/Gigs"
                element={
                  <EmployerPrivateRoute>
                    <ManageGigs />
                  </EmployerPrivateRoute>
                }
              />
              <Route
                path="/Employer/GigBids"
                element={
                  <EmployerPrivateRoute>
                    <ManageGigBids />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Internship --------- */}
              <Route
                path="/Employer/Internship"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageInternship />
                  </EmployerPrivateRoute>
                }
              />
              <Route
                path="/Employer/InternshipApplications"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageInternshipApplications />
                  </EmployerPrivateRoute>
                }
              />

              {/* --------- Events --------- */}
              <Route
                path="/Employer/Events"
                element={
                  <EmployerPrivateRoute>
                    <ManageEvents />
                  </EmployerPrivateRoute>
                }
              />
              <Route
                path="/Employer/EventApplications"
                element={
                  <EmployerPrivateRoute>
                    <ManageEventApplications />
                  </EmployerPrivateRoute>
                }
              />
            </Route>

            {/* ========================== Mentor Routes ========================== */}
            <Route element={<MentorLayout />}>
              {/* Redirect /Mentor to /Mentor/Dashboard */}
              <Route
                path="/Mentor"
                element={<Navigate to="/Mentor/Dashboard" replace />}
              />

              {/* Mentor Profile & Dashboard */}
              <Route path="/Mentor/Profile" element={<MentorProfile />} />
              <Route path="/Mentor/Dashboard" element={<MentorDashboard />} />

              {/* Mentorship */}
              <Route
                path="/Mentor/MyMentorship's"
                element={<MentorMyMentorship />}
              />
              <Route
                path="/Mentor/MentorshipApplications"
                element={<MentorMyMentorshipApplications />}
              />

              {/* Courses */}
              <Route path="/Mentor/MyCourses" element={<MentorMyCourses />} />
              <Route
                path="/Mentor/CourseApplications"
                element={<MentorMyCourseApplications />}
              />

              {/* Mentees & Scheduled Sessions */}
              <Route path="/Mentor/Mentees" element={<MentorMentees />} />
              <Route
                path="/Mentor/ScheduledSessions"
                element={<MentorScheduledSessions />}
              />

              {/* Messages */}
              <Route path="/Mentor/Messages" element={<MentorMessages />} />

              {/* Notifications */}
              <Route
                path="/Mentor/Notifications"
                element={<MentorNotifications />}
              />

              {/* Settings */}
              <Route path="/Mentor/Settings" element={<MentorSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
