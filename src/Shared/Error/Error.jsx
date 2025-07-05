// Common Button
import CommonButton from "../CommonButton/CommonButton";

// Icon
import { BiRefresh } from "react-icons/bi";

const Error = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Oops! Something went wrong.
        </h1>
        <p className="text-lg text-blue-100">
          We could not load the page properly. Try reloading it, or come back
          later.
        </p>

        <div className="flex justify-center">
          <CommonButton
            clickEvent={() => window.location.reload()}
            text="Reload Page"
            textColor="text-blue-700"
            bgColor="white"
            px="px-6"
            py="py-3"
            icon={<BiRefresh />}
            iconSize="text-xl"
            borderRadius="rounded-lg"
            className="shadow-md hover:bg-gray-100"
            width="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Error;
