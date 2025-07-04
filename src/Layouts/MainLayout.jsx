import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// Icons
import { GoMoveToTop } from "react-icons/go";

// Shared Components
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";

const MainLayout = () => {
  const [showToTop, setShowToTop] = useState(false);

  // Function to handle scrolling
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowToTop(true); // Show "To Top" button when scrolled more than 300px
    } else {
      setShowToTop(false); // Hide it when at the top
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Add scroll event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div data-theme="cupcake">
      {/* Scroll to Top Button */}
      {showToTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-800 transition"
        >
          <GoMoveToTop className="text-2xl" />
        </div>
      )}

      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
};

export default MainLayout;
