import { FaSearch } from "react-icons/fa";
import JobCard from "../Home/FeaturedJobs/JobCard/JobCard";
import { useState } from "react";

// Job data array in JSON format
const jobData = [
  {
    jobTitle: "Project Manager",
    jobDescription:
      "We are looking for a Project Manager to oversee and coordinate projects from inception to completion, ensuring they are delivered on time and within budget.",
    companyName: "ABC Construction",
    companyLogo: "https://i.ibb.co/jrkC9Rc/ABC-Construction.png",
    location: "Remote, Dallas, TX, USA",
    jobType: "Full-Time",
    salary: "$80,000 - $100,000 per year",
    postedDate: "2024-10-01T10:00:00",
    availableUntil: "2024-11-01T23:59:59",
    PeopleApplied: [
      {
        name: "Alice Brown",
        email: "alice.brown@example.com",
        appliedDate: "2024-09-30T14:15:00",
        AboutMe:
          "Experienced project manager with a focus on delivering projects on time and within budget.",
        image: "",
      },
    ],
    responsibilities: [
      "Plan and define project scope and objectives.",
      "Coordinate internal resources and third parties for the flawless execution of projects.",
      "Ensure resource availability and allocation.",
    ],
    qualifications: [
      "Proven working experience in project management.",
      "Strong leadership and team management skills.",
    ],
    toolsAndTechnologies: ["Microsoft Project", "Trello"],
  },
  {
    jobTitle: "HR Coordinator",
    jobDescription:
      "The HR Coordinator will assist in various HR functions, including recruitment, onboarding, and employee relations. A key role in supporting HR initiatives.",
    companyName: "XYZ Corp",
    companyLogo: "https://i.ibb.co/RpJc7zv/XYZ-Corp.png",
    location: "Remote, Atlanta, GA, USA",
    jobType: "Full-Time",
    salary: "$50,000 - $70,000 per year",
    postedDate: "2024-09-25T11:00:00",
    availableUntil: "2024-10-31T23:59:59",
    PeopleApplied: [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        appliedDate: "2024-09-26T15:30:00",
        AboutMe:
          "HR professional with experience in recruitment and employee engagement.",
        image: "",
      },
      {
        name: "Emily Johnson",
        email: "emily.johnson@example.com",
        appliedDate: "2024-09-27T09:00:00",
        AboutMe:
          "Detail-oriented HR coordinator skilled in onboarding and training.",
        image: "",
      },
    ],
    responsibilities: [
      "Support the recruitment process and manage applicant tracking.",
      "Assist with employee onboarding and orientation.",
      "Maintain HR records and ensure compliance with labor laws.",
    ],
    qualifications: [
      "Bachelor's degree in Human Resources or related field.",
      "1-2 years of experience in HR roles.",
    ],
    toolsAndTechnologies: ["HRIS", "Microsoft Office"],
  },
  {
    jobTitle: "Sales Representative",
    jobDescription:
      "We are looking for a motivated Sales Representative to join our team. You will be responsible for driving sales and building relationships with clients.",
    companyName: "ABC Products",
    companyLogo: "https://i.ibb.co.com/sFk00kV/ABC-Products.png",
    location: "Remote, Miami, FL, USA",
    jobType: "Full-Time",
    salary: "$60,000 - $80,000 per year",
    postedDate: "2024-09-20T14:00:00",
    availableUntil: "2024-10-30T23:59:59",
    PeopleApplied: [
      {
        name: "Michael Lee",
        email: "michael.lee@example.com",
        appliedDate: "2024-09-21T12:30:00",
        AboutMe:
          "Dynamic sales professional with a proven track record in meeting and exceeding targets.",
        image: "",
      },
      {
        name: "Sophia Brown",
        email: "sophia.brown@example.com",
        appliedDate: "2024-09-23T17:00:00",
        AboutMe: "Passionate about sales and customer satisfaction.",
        image: "",
      },
    ],
    responsibilities: [
      "Generate leads and develop sales opportunities.",
      "Build and maintain customer relationships.",
      "Achieve monthly sales targets.",
    ],
    qualifications: [
      "1-3 years of experience in sales.",
      "Strong communication and negotiation skills.",
    ],
    toolsAndTechnologies: ["CRM Software", "Microsoft Office"],
  },
  {
    jobTitle: "Content Writer",
    jobDescription:
      "Seeking a creative and detail-oriented Content Writer to produce engaging content for our website, blog, and social media platforms.",
    companyName: "Creative Agency",
    companyLogo: "https://i.ibb.co.com/1qf6WgF/Creative-Agency.png",
    location: "Remote, Seattle, WA, USA",
    jobType: "Part-Time",
    salary: "$30 - $50 per hour",
    postedDate: "2024-09-18T10:00:00",
    availableUntil: "2024-10-25T23:59:59",
    PeopleApplied: [
      {
        name: "Anna Wilson",
        email: "anna.wilson@example.com",
        appliedDate: "2024-09-19T11:15:00",
        AboutMe:
          "Passionate writer with a knack for creating compelling stories.",
        image: "",
      },
    ],
    responsibilities: [
      "Research and write articles on various topics.",
      "Edit and proofread content before publication.",
    ],
    qualifications: [
      "Bachelor's degree in English, Journalism, or a related field.",
      "Proven experience in content writing.",
    ],
    toolsAndTechnologies: ["WordPress", "Google Docs"],
  },
  {
    jobTitle: "Customer Service Representative",
    jobDescription:
      "Join our Customer Service team as a representative. You will handle inquiries and provide support to our customers.",
    companyName: "Retail Co.",
    companyLogo: "https://i.ibb.co.com/K71CqTz/Retail-Co.png",
    location: "Remote, Boston, MA, USA",
    jobType: "Full-Time",
    salary: "$40,000 - $55,000 per year",
    postedDate: "2024-09-15T09:00:00",
    availableUntil: "2024-10-20T23:59:59",
    PeopleApplied: [
      {
        name: "Liam Martin",
        email: "liam.martin@example.com",
        appliedDate: "2024-09-16T14:45:00",
        AboutMe:
          "Dedicated customer service professional with excellent communication skills.",
        image: "",
      },
      {
        name: "Emma Clark",
        email: "emma.clark@example.com",
        appliedDate: "2024-09-17T10:30:00",
        AboutMe:
          "Experienced in handling customer queries and providing solutions.",
        image: "",
      },
    ],
    responsibilities: [
      "Respond to customer inquiries via phone and email.",
      "Provide information about products and services.",
    ],
    qualifications: [
      "High school diploma or equivalent.",
      "1-2 years of customer service experience.",
    ],
    toolsAndTechnologies: ["Zendesk", "CRM Software"],
  },
  {
    jobTitle: "Graphic Designer",
    jobDescription:
      "We are searching for a talented Graphic Designer to create visually appealing designs for marketing materials, websites, and branding.",
    companyName: "Design Studio",
    companyLogo: "https://i.ibb.co.com/nkKg5zn/Design-Studio.png",
    location: "Remote, Portland, OR, USA",
    jobType: "Freelance",
    salary: "$25 - $40 per hour",
    postedDate: "2024-09-10T15:00:00",
    availableUntil: "2024-10-15T23:59:59",
    PeopleApplied: [
      {
        name: "Olivia Adams",
        email: "olivia.adams@example.com",
        appliedDate: "2024-09-11T12:00:00",
        AboutMe:
          "Creative graphic designer with a passion for visual storytelling.",
        image: "",
      },
    ],
    responsibilities: [
      "Design and produce engaging graphics and layouts.",
      "Collaborate with marketing teams to create visual content.",
    ],
    qualifications: [
      "Proven experience as a graphic designer.",
      "Strong portfolio showcasing design work.",
    ],
    toolsAndTechnologies: ["Adobe Creative Suite", "Figma"],
  },
  {
    jobTitle: "Event Coordinator",
    jobDescription:
      "Seeking an Event Coordinator to plan and organize events from start to finish. The ideal candidate will have excellent organizational skills and attention to detail.",
    companyName: "Events Company",
    companyLogo: "https://i.ibb.co.com/gr4yZ9W/Events-Company.png",
    location: "Remote, New York, NY, USA",
    jobType: "Full-Time",
    salary: "$55,000 - $75,000 per year",
    postedDate: "2024-09-05T14:00:00",
    availableUntil: "2024-10-05T23:59:59",
    PeopleApplied: [
      {
        name: "Ethan Scott",
        email: "ethan.scott@example.com",
        appliedDate: "2024-09-06T09:00:00",
        AboutMe:
          "Skilled event planner with a proven track record of successful events.",
        image: "",
      },
      {
        name: "Mia Green",
        email: "mia.green@example.com",
        appliedDate: "2024-09-07T13:00:00",
        AboutMe:
          "Detail-oriented event coordinator with strong communication skills.",
        image: "",
      },
    ],
    responsibilities: [
      "Plan and execute events, ensuring client satisfaction.",
      "Manage logistics, vendors, and budgets.",
    ],
    qualifications: [
      "Bachelor's degree in Event Management or related field.",
      "1-3 years of experience in event planning.",
    ],
    toolsAndTechnologies: ["Event Management Software", "Microsoft Office"],
  },
  {
    jobTitle: "Accountant",
    jobDescription:
      "We are looking for an Accountant to manage financial records and ensure compliance with regulations. The ideal candidate will have strong analytical skills and attention to detail.",
    companyName: "Finance Group",
    companyLogo: "https://i.ibb.co.com/yf116XL/Finance-Group.png",
    location: "Remote, San Francisco, CA, USA",
    jobType: "Full-Time",
    salary: "$70,000 - $90,000 per year",
    postedDate: "2024-09-01T10:00:00",
    availableUntil: "2024-10-01T23:59:59",
    PeopleApplied: [
      {
        name: "Isabella King",
        email: "isabella.king@example.com",
        appliedDate: "2024-09-02T14:00:00",
        AboutMe:
          "Detail-oriented accountant with experience in financial reporting.",
        image: "",
      },
    ],
    responsibilities: [
      "Prepare and examine financial records.",
      "Ensure compliance with financial regulations.",
    ],
    qualifications: [
      "Bachelor's degree in Accounting or Finance.",
      "3+ years of experience in accounting.",
    ],
    toolsAndTechnologies: ["QuickBooks", "Excel"],
  },
  {
    jobTitle: "Administrative Assistant",
    jobDescription:
      "We are looking for an organized Administrative Assistant to support daily operations and provide administrative support to the team.",
    companyName: "Business Solutions Inc.",
    companyLogo: "https://i.ibb.co.com/N6tHYg6/Business-Solutions-Inc.png",
    location: "Remote, Denver, CO, USA",
    jobType: "Full-Time",
    salary: "$40,000 - $55,000 per year",
    postedDate: "2024-08-28T10:00:00",
    availableUntil: "2024-09-28T23:59:59",
    PeopleApplied: [
      {
        name: "Grace Davis",
        email: "grace.davis@example.com",
        appliedDate: "2024-08-29T12:30:00",
        AboutMe:
          "Motivated administrative assistant with strong organizational skills.",
        image: "",
      },
      {
        name: "Lucas Johnson",
        email: "lucas.johnson@example.com",
        appliedDate: "2024-08-30T15:45:00",
        AboutMe: "Experienced in office management and administrative support.",
        image: "",
      },
    ],
    responsibilities: [
      "Manage schedules and organize meetings.",
      "Handle correspondence and maintain filing systems.",
    ],
    qualifications: [
      "High school diploma or equivalent.",
      "1-2 years of experience in an administrative role.",
    ],
    toolsAndTechnologies: ["Microsoft Office", "Google Workspace"],
  },
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  // Get unique job titles for the dropdown
  const uniqueJobTitles = [...new Set(jobData.map((job) => job.jobTitle))];
  // Get unique job types for the dropdown
  const uniqueJobTypes = [...new Set(jobData.map((job) => job.jobType))];

  // Filter jobs based on search input, selected title, and selected job type
  const filteredJobs = jobData.filter((job) => {
    const matchesSearch = job.jobTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTitle = selectedTitle === "" || job.jobTitle === selectedTitle;
    const matchesJobType =
      selectedJobType === "" || job.jobType === selectedJobType;

    return matchesSearch && matchesTitle && matchesJobType;
  });

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-50 min-h-screen">
      <div className="mx-auto max-w-[1200px] pt-20">
        {/* Top Section */}
        <div className="flex justify-between items-center gap-5 pt-5">
          {/* Title */}
          <div className="text-black">
            <h1 className="text-2xl font-bold m-0 pt-5">Our Posted Jobs</h1>
            <p>Find Your Preferred Job</p>
          </div>

          {/* Search */}
          <div>
            <label className="input input-bordered flex items-center gap-2 w-[500px] bg-white">
              <input
                type="text"
                className="grow py-2 px-3 focus:outline-none"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="h-4 w-4 opacity-70 text-black" />
            </label>
          </div>

          {/* Dropdown for Job Title Filter */}
          <select
            className="border border-gray-300 p-2 w-[200px] bg-white text-black"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            <option value="">All Job Titles</option>
            {uniqueJobTitles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>

          {/* Dropdown for Job Type Filter */}
          <select
            className="border border-gray-300 p-2 w-[200px] bg-white text-black"
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
          >
            <option value="">All Job Types</option>
            {uniqueJobTypes.map((jobType, index) => (
              <option key={index} value={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </div>

        {/* Job Cards Section */}
        <div className="grid grid-cols-3 gap-5 py-10">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <JobCard key={index} jobsData={job} />
            ))
          ) : (
            <p>No jobs found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
