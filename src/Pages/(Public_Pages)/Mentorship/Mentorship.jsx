import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";
import MentorshipCard from "../../../Shared/MentorshipCard/MentorshipCard";
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import MentorshipDetailsModal from "../Home/FeaturedMentorship/MentorshipDetailsModal/MentorshipDetailsModal";

const Mentorship = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMentorshipID, setSelectedMentorshipID] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // Fetch Mentorship
  const {
    data: MentorshipData = [],
    isLoading: MentorshipIsLoading,
    error: MentorshipError,
  } = useQuery({
    queryKey: ["MentorshipData"],
    queryFn: () => axiosPublic.get("/Mentorship").then((res) => res.data),
  });
  

  // Filtered mentorship's
  const filteredMentorship = MentorshipData.filter((mentorship) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchSearch =
      mentorship.title.toLowerCase().includes(lowerSearch) ||
      mentorship.description.toLowerCase().includes(lowerSearch) ||
      mentorship.mentor.name.toLowerCase().includes(lowerSearch) ||
      mentorship.skillsCovered?.some((skill) =>
        skill.toLowerCase().includes(lowerSearch)
      );

    const matchCategory = category ? mentorship.category === category : true;
    const matchSubCategory = subCategory
      ? mentorship.subCategory === subCategory
      : true;

    return matchSearch && matchCategory && matchSubCategory;
  });

  if (MentorshipIsLoading) return <Loading />;
  if (MentorshipError) return <Error />;

  const handleClear = () => {
    setSearchTerm("");
    setCategory("");
    setSubCategory("");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative text-center">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-200 rounded-full p-3 cursor-pointer"
            title="Toggle Filters"
          >
            {showFilters ? (
              <FaTimes className="text-lg text-black font-bold" />
            ) : (
              <FaSearch className="text-lg text-black font-bold" />
            )}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white px-4 md:px-20 pb-2">
          Find Your Ideal Mentor
        </h1>
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Connect with experienced professionals for one-on-one guidance, career
          advice, and real-world insights tailored to your goals.
        </p>
      </div>

      {/* Filters */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black px-20 pt-10">
          {/* Keyword */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Keyword
            </label>
            <input
              type="text"
              placeholder="Title, description, mentor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Categories</option>
              {[...new Set(MentorshipData.map((m) => m.category))].map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>

          {/* SubCategory */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Subcategory
            </label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Subcategories</option>
              {[...new Set(MentorshipData.map((m) => m.subCategory))].map(
                (sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Skill */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Skill
            </label>
            <select
              className="p-2 border rounded text-black bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            >
              <option value="">All Skills</option>
              {[...new Set(MentorshipData.flatMap((m) => m.skillsCovered))].map(
                (skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Remote Only */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="remoteOnly"
              onChange={(e) => setSearchTerm(e.target.checked ? "remote" : "")}
              className="w-4 h-4"
            />
            <label
              htmlFor="remoteOnly"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Remote Only
            </label>
          </div>

          {/* Free Only */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="freeOnly"
              onChange={(e) => setSearchTerm(e.target.checked ? "free" : "")}
              className="w-4 h-4"
            />
            <label
              htmlFor="freeOnly"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Free Only
            </label>
          </div>
        </div>

        {/* Clear Button & Results */}
        <div className="flex justify-between items-center px-20 py-3">
          <div className="text-lg text-white playfair">
            {filteredMentorship.length} Course
            {filteredMentorship.length !== 1 && "s"} found
          </div>

          <CommonButton
            clickEvent={handleClear}
            text="Clear"
            icon={<FaTimes />}
            bgColor="white"
            textColor="text-black"
            px="px-10"
            py="py-2"
            borderRadius="rounded"
            iconSize="text-base"
            width="auto"
          />
        </div>
      </div>

      {/* Mentorship Cards */}
      <div className="py-6 px-4 md:px-20">
        {filteredMentorship.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMentorship.map((mentorship) => (
              <MentorshipCard
                key={mentorship._id}
                mentorship={mentorship}
                setSelectedMentorshipID={setSelectedMentorshipID}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No mentorship&apos;s found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Mentorship Modal */}
      <dialog id="Mentorship_Details_Modal" className="modal">
        <MentorshipDetailsModal
          selectedMentorshipID={selectedMentorshipID}
          setSelectedMentorshipID={setSelectedMentorshipID}
        />
      </dialog>
    </div>
  );
};

export default Mentorship;
