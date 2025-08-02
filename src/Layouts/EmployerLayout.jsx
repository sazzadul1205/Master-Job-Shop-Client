

const EmployerLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-bl from-blue-100 to-white ">
      {/* Top Bar */}
      <div className="bg-white shadow-2xl w-full px-5">


        {/* center  Side */}
        <div className="flex items-center h-full gap-2">
          <p className="text-xl font-semibold playfair text-black">
            Master Job Shop
          </p>
          <p className="text-lg font-semibold playfair text-black py-1">
            Employer Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerLayout;
