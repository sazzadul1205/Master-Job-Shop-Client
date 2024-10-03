import EventCard from "./EventCard/EventCard";

const UpcomingEvents = () => {
  // Upcoming events data array in JSON format
  const eventsData = [
    {
      eventTitle: "Tech Career Fair",
      date: "2024-10-15",
      time: "10:00 AM - 3:00 PM",
      location: "New York, NY, USA",
      description:
        "Meet leading tech companies and discover job opportunities.",
    },
    {
      eventTitle: "Web Development Workshop",
      date: "2024-10-20",
      time: "2:00 PM - 5:00 PM",
      location: "San Francisco, CA, USA",
      description:
        "Learn the latest trends in web development and enhance your skills.",
    },
    {
      eventTitle: "Resume Building Seminar",
      date: "2024-10-25",
      time: "1:00 PM - 4:00 PM",
      location: "Online",
      description: "Join us for a workshop on creating effective resumes.",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50">
      <div className="max-w-[1200px] mx-auto text-black py-10">
        {/* Top section */}
        <div className="text-xl pt-20 text-center">
          <p className="text-5xl font-bold italic text-blue-700">
            Upcoming Events
          </p>
          <p className="text-xl">
            Don’t miss out on these great opportunities!
          </p>
        </div>

        {/* Event Cards Section */}
        <div className="grid grid-cols-3 gap-4 py-10">
          {eventsData.map((event, index) => (
            <EventCard
              key={index}
              eventTitle={event.eventTitle}
              date={event.date}
              time={event.time}
              location={event.location}
              description={event.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
