import { Link } from "react-router-dom";

// Assets
import graduate from "../../../assets/HomePageBanner/graduate.png";

// Hooks
import useAuth from "../../../Hooks/useAuth";

// Shared
import CommonButton from "../../../../Shared/CommonButton/CommonButton";

const HomeBanners = () => {
  const { user } = useAuth();

  return (
    <section className="relative bg-gradient-to-l from-blue-400 to-blue-600 text-white flex items-center min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between w-full">
        {/* Left Text Content */}
        <div className="max-w-xl text-center md:text-left">
          {/* title */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Shape Your Career. One Opportunity at a Time.
          </h1>

          {/* Subtitle */}
          <p className="text-xl font-semibold text-white/90 mb-6">
            Discover jobs, gigs, internships, mentorships, events, and more —
            all in one platform tailored for your professional journey.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex justify-center md:justify-start gap-4">
            <Link to={"/Jobs"}>
              <CommonButton
                text="Explore Jobs"
                textColor="text-blue-700"
                bgColor="white"
                px="px-6"
                py="py-3"
                borderRadius="rounded-lg"
                className="shadow hover:shadow-2xl "
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
                  className="border border-white hover:bg-white hover:text-blue-700 
               transition-all duration-200 delay-100 transform 
               hover:scale-105 animate-fade-in-slide"
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

        {/* Optional Right Image */}
        <div className="mt-10 md:mt-0 md:ml-8 w-full max-w-md hidden md:block">
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
