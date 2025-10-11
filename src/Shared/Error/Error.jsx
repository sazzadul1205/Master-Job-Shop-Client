import PropTypes from "prop-types";
import { BiRefresh } from "react-icons/bi";

const Error = ({ message, height }) => {
  return (
    <div
      className={`w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-800 text-white px-4 sm:px-6 ${
        height || "min-h-screen"
      } relative`}
    >
      <div className="max-w-lg text-center space-y-6 sm:space-y-8">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
          Oops! Something went wrong.
        </h1>

        {/* Message */}
        <p className="text-sm sm:text-lg text-blue-100 leading-relaxed">
          {message
            ? message
            : "We couldn’t load the page properly. Please try reloading or check back later."}
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex flex-wrap items-center justify-center gap-2 text-blue-700 bg-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:bg-gray-200 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <BiRefresh className="text-lg sm:text-xl" />
            <span className="text-sm sm:text-base">Reload Page</span>
          </button>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="absolute bottom-4 sm:bottom-6 text-xs sm:text-sm text-blue-200 text-center px-4">
        If this keeps happening, contact support.
      </div>
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string,
  height: PropTypes.string,
};

export default Error;
