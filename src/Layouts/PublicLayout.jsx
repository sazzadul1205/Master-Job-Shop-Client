import { Outlet } from "react-router-dom";

// Shared
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";

const PublicLayout = () => {
  return (
    <div data-theme="cupcake">
      <Navbar />
      <main className="bg-gradient-to-bl from-blue-400 to-blue-600 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
