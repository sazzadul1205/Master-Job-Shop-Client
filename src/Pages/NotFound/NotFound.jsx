import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        {/* 404 Message */}
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        {/* Button to go back to Home */}
        <Link to="/">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-md hover:bg-blue-600 transition duration-300">
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
