import { useEffect } from "react";
import { Link } from "react-router-dom";

// Assets
import graduate from "../../../../assets/HomePageBanner/graduate.png";

// Hooks
import useAuth from "../../../../Hooks/useAuth";

// Shared
import CommonButton from "../../../../Shared/CommonButton/CommonButton";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";

const HomeBanners = () => {
  const { user } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative bg-gradient-to-tl from-blue-400 to-blue-600 text-white flex items-center min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between w-full">
        {/* Left Text Content */}
        <div
          className="max-w-xl text-center md:text-left"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Shape Your Career. One Opportunity at a Time.
          </h1>

          <p className="text-xl font-semibold text-white/90 mb-6">
            Discover jobs, gigs, internships, mentorship&apos;s, events, and more — all in one platform tailored for your professional journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center md:justify-start gap-4" data-aos="fade-up" data-aos-delay="300">
            <Link to={"/Jobs"}>
              <CommonButton
                text="Explore Jobs"
                textColor="text-blue-700"
                bgColor="white"
                px="px-6"
                py="py-3"
                borderRadius="rounded-lg"
                className="shadow hover:shadow-2xl"
                type="button"
              />
            </Link>

            {!user && (
              <Link to="/Login">
                <CommonButton
                  text="Get Started"
                  textColor="text-white"
                  bgColor=""
                  px="px-6"
                  py="py-3"
                  borderRadius="rounded-lg"
                  className="border border-white hover:bg-white hover:text-blue-700 transition-all duration-200 delay-100 transform hover:scale-105"
                  type="button"
                />
              </Link>
            )}

            {user && (
              <Link to="/Login">
                <CommonButton
                  text="Explore Gigs"
                  textColor="text-white"
                  bgColor=""
                  px="px-6"
                  py="py-3"
                  borderRadius="rounded-lg"
                  className="border border-white hover:bg-white hover:text-blue-700"
                  type="button"
                />
              </Link>
            )}
          </div>
        </div>

        {/* Right Image */}
        <div
          className="mt-10 md:mt-0 md:ml-8 w-full max-w-md hidden md:block"
          data-aos="fade-left"
          data-aos-delay="500"
        >
          <img
            src={graduate}
            alt="Career Growth Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeBanners;
