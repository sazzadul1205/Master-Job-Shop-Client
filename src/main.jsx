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

import ManageJobs from "./Pages/(Employer_Pages)/ManageJobs/ManageJobs";
import ManageGigs from "./Pages/(Employer_Pages)/ManageGigs/ManageGigs";
import ManageEvents from "./Pages/(Employer_Pages)/ManageEvents/ManageEvents";
import ManageGigBids from "./Pages/(Employer_Pages)/ManageGigBids/ManageGigBids";
import ManageInternship from "./Pages/(Employer_Pages)/ManageInternship/ManageInternship";

import ManageJobApplications from "./Pages/(Employer_Pages)/ManageJobApplications/ManageJobApplications";
import ManageEventApplications from "./Pages/(Employer_Pages)/ManageEventApplications/ManageEventApplications";
import ManageInternshipApplications from "./Pages/(Employer_Pages)/ManageInternshipApplications/ManageInternshipApplications";

import ManageCompanyProfile from "./Pages/(Employer_Pages)/ManageCompanyProfile/ManageCompanyProfile";
import ManageEmployerProfile from "./Pages/(Employer_Pages)/ManageEmployerProfile/ManageEmployerProfile";

// ------------------ Mentor Pages ------------------
import MentorProfile from "./Pages/(Mentor_Pages)/MentorProfile/MentorProfile";
import MentorMentees from "./Pages/(Mentor_Pages)/MentorMentees/MentorMentees";
import MentorDashboard from "./Pages/(Mentor_Pages)/MentorDashboard/MentorDashboard";
import MentorMyCourses from "./Pages/(Mentor_Pages)/MentorMyCourses/MentorMyCourses";
import MentorMyMentorship from "./Pages/(Mentor_Pages)/MentorMyMentorship/MentorMyMentorship";
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
              <>
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
              </>

              {/* Gigs Part */}
              <>
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
              </>

              {/* Courses */}
              <>
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
              </>

              {/* Mentorship */}
              <>
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
              </>

              {/* Internship */}
              <>
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
              </>

              {/* Events */}
              <>
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
              </>

              {/* Company Profiles */}
              <>
                <Route path="/CompanyProfiles" element={<CompanyProfiles />} />

                <Route
                  path="/CompanyProfiles/:companyId"
                  element={<CompanyProfilesDetails />}
                />
              </>

              {/* Blogs Part */}
              <Route path="/Blogs" element={<Blogs />} />

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
                path="/Employer/Employer/Dashboard"
                element={
                  <EmployerPrivateRoute allowedRoles={["Employer"]}>
                    <EmployerDashboard />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Profile */}
              <Route
                path="/Employer/EmployerProfile"
                element={
                  <EmployerPrivateRoute allowedRoles={["Employer"]}>
                    <ManageEmployerProfile />
                  </EmployerPrivateRoute>
                }
              />

              {/* Company Dashboard */}
              <Route
                path="/Employer/Company/Dashboard"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <CompanyDashboard />
                  </EmployerPrivateRoute>
                }
              />

              {/* Company Profile */}
              <Route
                path="/Employer/CompanyProfile"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageCompanyProfile />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Jobs */}
              <Route
                path="/Employer/Jobs"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageJobs />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Jobs */}
              <Route
                path="/Employer/JobApplications"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageJobApplications />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Gigs */}
              <Route
                path="/Employer/Gigs"
                element={
                  <EmployerPrivateRoute>
                    <ManageGigs />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Gig Bids */}
              <Route
                path="/Employer/GigBids"
                element={
                  <EmployerPrivateRoute>
                    <ManageGigBids />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Internship */}
              <Route
                path="/Employer/Internship"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageInternship />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Internship Application */}
              <Route
                path="/Employer/InternshipApplications"
                element={
                  <EmployerPrivateRoute allowedRoles={["Company"]}>
                    <ManageInternshipApplications />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Events */}
              <Route
                path="/Employer/Events"
                element={
                  <EmployerPrivateRoute>
                    <ManageEvents />
                  </EmployerPrivateRoute>
                }
              />

              {/* Employer Event Application */}
              <Route
                path="/Employer/EventApplications"
                element={
                  <EmployerPrivateRoute>
                    <ManageEventApplications />
                  </EmployerPrivateRoute>
                }
              />
            </Route>

            {/* Mentor Route */}
            <Route element={<MentorLayout />}>
              {/* Redirect /Mentor to /Mentor/Dashboard */}
              <Route
                path="/Mentor"
                element={<Navigate to="/Mentor/Dashboard" replace />}
              />

              {/* Mentor Profile */}
              <Route path="/Mentor/Profile" element={<MentorProfile />} />

              {/* Mentor Dashboard */}
              <Route path="/Mentor/Dashboard" element={<MentorDashboard />} />

              {/* Mentor My Mentorship */}
              <Route
                path="/Mentor/MyMentorship's"
                element={<MentorMyMentorship />}
              />

              {/* Mentorship Applications */}
              <Route
                path="/Mentor/MentorshipApplications"
                element={<MentorMyMentorshipApplications />}
              />

              {/* Mentor My Courses */}
              <Route path="/Mentor/MyCourses" element={<MentorMyCourses />} />

              {/* Mentor Course Applications */}
              <Route
                path="/Mentor/CourseApplications"
                element={<MentorMyCourseApplications />}
              />

              {/* Mentor Mentees */}
              <Route path="/Mentor/Mentees" element={<MentorMentees />} />

              {/* Mentor Scheduled Sessions */}
              <Route
                path="/Mentor/ScheduledSessions"
                element={<MentorScheduledSessions />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
