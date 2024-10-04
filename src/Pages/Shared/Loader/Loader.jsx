import "./Loader.css"; // Corrected import statement

const Loader = () => {
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-50 h-screen flex items-center justify-center">
      <p className="text-3xl text-black font-bold">Loading . . .</p>
      <div className="loader "></div>
    </div>
  );
};

export default Loader;
