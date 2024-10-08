import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importing prop-types for validation

const HomeBanners = ({ HomeBannerData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!HomeBannerData || HomeBannerData.length === 0) return;

    // Automatically switch banners every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === HomeBannerData.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [HomeBannerData]);

  return (
    <div className="relative w-full h-[600px] pt-20 bg-blue-400">
      {HomeBannerData && HomeBannerData.length > 0 && (
        <div className="w-full h-full relative">
          {/* Banner Image with fade effect */}
          {HomeBannerData.map((banner, index) => (
            <img
              key={index}
              src={banner.Link}
              alt={banner.name}
              className={`absolute inset-0 w-full h-[600px] object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Prop validation using prop-types
HomeBanners.propTypes = {
  HomeBannerData: PropTypes.arrayOf(
    PropTypes.shape({
      Link: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HomeBanners;
