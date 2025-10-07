import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const RestrictedAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <FaLock className="text-6xl text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Access Restricted
        </h1>
        <p className="text-blue-600 mb-6">
          You do not have permission to view this page. If you believe this is
          an error, please contact support or return to a safe page.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default RestrictedAccess;
