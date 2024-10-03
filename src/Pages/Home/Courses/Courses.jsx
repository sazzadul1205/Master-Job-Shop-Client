import CourseCard from "./CourseCard/CourseCard";

const Courses = () => {
  // Courses data array in JSON format
  const coursesData = [
    {
      courseTitle: "Full Stack Web Development",
      instructor: "John Doe",
      duration: "12 weeks",
      level: "Intermediate",
      description:
        "Learn to build modern web applications using HTML, CSS, JavaScript, and React.",
    },
    {
      courseTitle: "Data Science Bootcamp",
      instructor: "Jane Smith",
      duration: "8 weeks",
      level: "Beginner",
      description:
        "An intensive program covering Python, data analysis, and machine learning.",
    },
    {
      courseTitle: "Digital Marketing Strategy",
      instructor: "Emily Johnson",
      duration: "6 weeks",
      level: "Beginner",
      description:
        "Master the essentials of digital marketing, including SEO, social media, and analytics.",
    },
    {
      courseTitle: "UX/UI Design Fundamentals",
      instructor: "Michael Brown",
      duration: "10 weeks",
      level: "Intermediate",
      description:
        "Explore user-centered design principles and create beautiful user interfaces.",
    },
    {
      courseTitle: "Machine Learning A-Z",
      instructor: "Alice Roberts",
      duration: "10 weeks",
      level: "Advanced",
      description:
        "Master machine learning with this comprehensive course covering theory and practical applications using Python and TensorFlow.",
    },
    {
      courseTitle: "Introduction to Cybersecurity",
      instructor: "Mark Thompson",
      duration: "8 weeks",
      level: "Beginner",
      description:
        "Discover the fundamentals of cybersecurity, including risk management, security protocols, and ethical hacking.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-400">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Available Courses
          </p>
          <p className="text-xl">
            Enhance your skills and advance your career!
          </p>
        </div>

        {/* Course Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {coursesData.map((course, index) => (
            <CourseCard
              key={index}
              courseTitle={course.courseTitle}
              instructor={course.instructor}
              duration={course.duration}
              level={course.level}
              description={course.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
