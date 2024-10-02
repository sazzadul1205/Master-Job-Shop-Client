import { useState, useEffect } from "react";
import Banner1 from "../../../assets/Banner/Banner-1.png";
import Banner2 from "../../../assets/Banner/Banner-2.png";
import Banner3 from "../../../assets/Banner/Banner-3.png";
import Banner4 from "../../../assets/Banner/Banner-4.png";

// Define the banner data array
const HomeBannerData = [
  { _id: 1, Link: Banner1, name: "Banner 1" },
  { _id: 2, Link: Banner2, name: "Banner 2" },
  { _id: 3, Link: Banner3, name: "Banner 3" },
  { _id: 4, Link: Banner4, name: "Banner 4" },
];

const HomeBanners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Automatically switch banners every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === HomeBannerData.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] pt-20">
      {/* Banner Image */}
      <img
        src={HomeBannerData[currentIndex].Link}
        alt={HomeBannerData[currentIndex].name}
        className="w-full h-[600px] transition-opacity duration-1000 ease-in-out"
      />
    </div>
  );
};

export default HomeBanners;
