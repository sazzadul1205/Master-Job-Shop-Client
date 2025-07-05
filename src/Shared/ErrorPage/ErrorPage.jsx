import { IoWarningOutline } from "react-icons/io5";
import CommonButton from "../CommonButton/CommonButton";

const ErrorPage = () => {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-linear-to-br bg-gradient-to-br from-blue-500 to-blue-100 animate-fadeIn"
      aria-live="polite"
    >
      {/* Warning Icon */}
      <IoWarningOutline className="text-red-600 text-6xl mb-4" />

      {/* Error Message */}
      <p className="text-center playfair text-red-600 font-bold text-3xl mb-6">
        Oops! Something went wrong.
      </p>
      <p className="text-center playfair text-gray-700 text-lg mb-6">
        Please check your connection or try reloading the page.
      </p>

      {/* Reload Button */}
      <CommonButton
        text="Reload Page"
        clickEvent={() => window.location.reload()}
        textColor="text-white"
        bgColor="blue"
        px="px-6"
        py="py-3"
        borderRadius="rounded-lg"
        type="button"
      />
    </div>
  );
};

export default ErrorPage;
