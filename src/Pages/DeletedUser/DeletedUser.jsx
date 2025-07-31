import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeletedUser = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-400 to-blue-600 flex items-center justify-center px-4">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center space-y-6">
        <div className="flex flex-col items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-5xl" />
          <h1 className="text-3xl font-extrabold">Account Deactivated</h1>
          <p className="text-lg text-gray-600">
            This account has been marked as{" "}
            <span className="font-semibold text-red-600">deleted</span>. If this
            is unexpected or you believe it&apos;s a mistake, please reach out
            to our support team immediately.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate("/MyProfile")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition cursor-pointer"
          >
            Go to Profile Settings
          </button>

          {/* Contact Support Button */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=pSazzadul@gmail.com&su=Support%20Request%3A%20Deleted%20Account&body=Hi%20Support%20Team%2C%0D%0A%0D%0AMy%20account%20has%20been%20marked%20as%20deleted.%20Please%20review%20this.%0D%0A%0D%0AThank%20you%2C%0D%0A[Your%20Name]"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-gray-200 border-2 border-blue-600 text-gray-800 font-medium py-3 px-6 rounded-lg transition cursor-pointer"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeletedUser;
