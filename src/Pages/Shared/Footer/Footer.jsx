import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { FaFacebook, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="pt-5 bg-blue-500">
      <footer className="footer max-w-[1200px] mx-auto py-10 text-white">
        <aside className="text-center">
          <Link to={"/"}>
            <div className="flex justify-center items-center mb-4">
              <img src={Logo} alt="Master Job Shop Logo" className="w-16" />
              <p className="text-xl font-bold ml-2">Master Job Shop</p>
            </div>
          </Link>
          <p className="text-lg text-left">
            Sazzadul Islam Molla
            <br />
            Providing reliable tech since 2024
          </p>
        </aside>
        <nav className="text-center mt-6">
          <h6 className="text-white text-lg font-bold mb-4">Social</h6>
          <div className="flex justify-center gap-4">
            <Link
              to="https://www.facebook.com/profile.php?id=100083112611384"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="text-3xl hover:text-gray-300" />
            </Link>
            <Link
              to="https://github.com/sazzadul1205?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-3xl hover:text-gray-300" />
            </Link>
            <Link
              to="https://x.com/sazzadu84352084"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-3xl hover:text-gray-300" />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
