import { Outlet } from "react-router-dom";

// Shared
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";

const PublicLayout = () => {
  return (
    <div data-theme="cupcake">
      <Navbar />
      <main className="bg-gradient-to-br from-blue-500 to-blue-100 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
