import { NavLink } from "react-router-dom";

// JSON data for social links
import My_Social_Links from "../../JSON/My_Social_Links.json";

// Import icons from react-icons
import {
  FaGoogle,
  FaFacebookF,
  FaTwitter,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

// Packages
import { Tooltip } from "react-tooltip";

// Social icons mapping
const socialIcons = {
  google: FaGoogle,
  facebook: FaFacebookF,
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedinIn,
};

const Footer = () => {
  return (
    <div className="pt-5 bg-blue-500">
      <footer className="footer flex max-w-[1200px] mx-auto py-10 text-white">
        <nav className="text-center">
          {/* Logo */}
          <NavLink to="/">
            <div className="hidden md:flex items-center ">
              <p className="text-2xl font-semibold playfair">Master Job Shop</p>
            </div>
          </NavLink>

          {/* Description */}
          <p className="text-lg text-left">
            Sazzadul Islam Molla
            <br />
            Providing reliable tech since 2022
          </p>
        </nav>

        {/* Social Section */}
        <nav className="mx-auto">
          {/* Title */}
          <h6 className="text-lg font-semibold text-center md:text-left">
            Social
          </h6>

          {/* Social Links */}
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-6 mt-4 justify-center">
            {Object.entries(My_Social_Links).map(([platform, url]) => {
              const IconComponent = socialIcons[platform];
              if (!IconComponent) return null; // skip unknown platforms`

              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tooltip-id={`tooltip-${platform}`}
                  data-tooltip-content={platform.toUpperCase()}
                  className="hover:scale-110 transition-transform text-white text-2xl flex justify-center items-center"
                  aria-label={platform}
                >
                  <IconComponent />
                  <Tooltip id={`tooltip-${platform}`} place="top" />
                </a>
              );
            })}
          </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
