import { MdEdit } from "react-icons/md";

import DefaultUserLogo from "../../../assets/DefaultUserLogo.jpg";

const MentorProfile = () => {
  return (
    <div className="p-8">
      {/* Basic Information Block */}
      <div className="bg-white text-black w-full px-6 rounded-xl pb-7">
        {/* Header */}
        <div className="flex items-center justify-between pt-7 ">
          {/* Title */}
          <h3 className="font-bold text-xl">Mentor Profile</h3>

          {/* Edit Button */}
          <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer">
            <MdEdit /> Edit Profile
          </button>
        </div>

        {/* Basic Information */}
        <div className="flex items-center gap-6 pt-5">
          {/* User Avatar */}
          <img
            src={DefaultUserLogo}
            alt=""
            className="w-20 h-20 rounded-full"
          />

          {/* Information */}
          <div>
            {/* User Name */}
            <h2 className="text-2xl font-semibold">Sazzadul Islam Molla</h2>

            {/* Industry | Position */}
            <p className="text-gray-500">
              Lead Software Architect | Senior Mentor
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="pt-1 pl-26">
          Specializing in scalable cloud solutions, distributed systems, and
          modern web frameworks. Passionate about guiding aspiring developers
          and architects. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Id earum aliquid accusantium quisquam debitis inventore
          dignissimos, illo, laborum exercitationem modi, aspernatur itaque
          architecto sequi et optio deleniti non quod perspiciatis! Lorem ipsum
          dolor sit amet consectetur, adipisicing elit. Explicabo alias iusto
          nemo ad mollitia dolorem quasi non repudiandae earum provident tenetur
          cupiditate et repellendus eum id, numquam, enim perspiciatis.
          Repellendus.
        </p>
      </div>

      {/* Contact Details Block */}
      <div className="bg-white text-black w-full px-6 rounded-xl pb-7 mt-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-7 ">
          {/* Title */}
          <h3 className="font-semibold text-xl">Mentor Profile</h3>

          {/* Edit Button */}
          <button className="flex items-center gap-2 border border-gray-400 hover:bg-gray-400 text-black hover:text-white font-semibold px-5 py-2 rounded-md transition-colors duration-500 cursor-pointer">
            <MdEdit /> Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
