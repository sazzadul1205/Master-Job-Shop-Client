import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="flex text-2xl items-center hover:text-red-500 border-2 border-black px-2 lg:px-5 lg:py-2"
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft className="mr-5" /> Back
    </button>
  );
};

export default BackButton;
