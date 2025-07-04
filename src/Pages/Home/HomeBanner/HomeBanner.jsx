const HomeBanners = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between w-full">
        {/* Left Text Content */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Shape Your Career. One Opportunity at a Time.
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Discover jobs, gigs, internships, mentorships, events, and more —
            all in one platform tailored for your professional journey.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="#jobs"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Explore Jobs
            </a>
            <a
              href="#get-started"
              className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Optional Right Image */}
        <div className="mt-10 md:mt-0 md:ml-8 w-full max-w-md hidden md:block">
          <img
            src="/hero-illustration.svg"
            alt="Career Growth Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeBanners;
