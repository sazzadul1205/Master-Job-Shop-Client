import PropTypes from "prop-types";

// Icons
import { BiRefresh } from "react-icons/bi";

const Error = ({ message }) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-800 text-white px-6">
      <div className="max-w-lg text-center space-y-8">
        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
          Oops! Something went wrong.
        </h1>

        {/* Message */}
        <p className="text-lg text-blue-100 leading-relaxed">
          {message
            ? message
            : "We couldn’t load the page properly. Please try reloading or check back later."}
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-blue-700 bg-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <BiRefresh className="text-xl" />
            <span>Reload Page</span>
          </button>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="absolute bottom-6 text-sm text-blue-200">
        If this keeps happening, contact support.
      </div>
    </div>
  );
};

// Prop Validation
Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
