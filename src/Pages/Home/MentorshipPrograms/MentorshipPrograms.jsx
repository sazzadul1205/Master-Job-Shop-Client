import MentorshipCard from "./MentorshipCard/MentorshipCard";

const MentorshipPrograms = () => {
  // Sample data for mentorship programs
  const mentorshipData = [
    {
      mentorName: "Sarah Johnson",
      mentorImage: "https://i.ibb.co.com/c398p1M/Mentor-Img-4.jpg",
      expertise: "Career Development",
      duration: "6 weeks",
      description:
        "Gain insights on career paths and enhance your job search strategies.",
    },
    {
      mentorName: "Michael Smith",
      mentorImage: "https://i.ibb.co.com/CJr6YJh/Mentor-Img-3.jpg",
      expertise: "Web Development",
      duration: "8 weeks",
      description:
        "Learn web development best practices and create your first website.",
    },
    {
      mentorName: "Emily Davis",
      mentorImage: "https://i.ibb.co.com/N1Y0Ynr/Mentor-Img-2.jpg",
      expertise: "Data Science",
      duration: "10 weeks",
      description:
        "Dive into data analysis, machine learning, and real-world projects.",
    },
    {
      mentorName: "James Williams",
      mentorImage: "https://i.ibb.co.com/xz74XfY/Mentor-Img-1.jpg",
      expertise: "UI/UX Design",
      duration: "8 weeks",
      description:
        "Master the principles of user-centered design and create interactive prototypes.",
    },
    {
      mentorName: "Sophia Martinez",
      mentorImage: "https://i.ibb.co.com/9vTgKdD/Mentor-Img-6.jpg",
      expertise: "Digital Marketing",
      duration: "6 weeks",
      description:
        "Learn how to drive traffic, engage users, and analyze digital marketing campaigns.",
    },
    {
      mentorName: "Daniel Thompson",
      mentorImage: "https://i.ibb.co.com/jH5nZZQ/Mentor-Img-5.jpg",
      expertise: "Software Engineering",
      duration: "12 weeks",
      description:
        "Develop your programming skills and learn best practices for scalable software development.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top Section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Mentorship Programs
          </p>
          <p className="text-xl">
            Join a mentorship program to advance your skills and career.
          </p>
        </div>

        {/* Mentorship Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {mentorshipData.map((mentor, index) => (
            <MentorshipCard
              key={index}
              mentorImage={mentor.mentorImage}
              mentorName={mentor.mentorName}
              expertise={mentor.expertise}
              duration={mentor.duration}
              description={mentor.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorshipPrograms;
