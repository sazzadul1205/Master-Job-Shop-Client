import { useState, useMemo } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaSearch, FaTimes } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import InternshipCard from "../../../Shared/InternshipCard/InternshipCard";
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Modal
import InternshipDetailsModal from "../Home/FeaturedInternships/InternshipDetailsModal/InternshipDetailsModal";

const Internship = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInternshipID, setSelectedInternshipID] = useState(null);

  // Filter States
  const [category, setCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const {
    data: InternshipData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["InternshipData"],
    queryFn: () => axiosPublic.get("/Internship").then((res) => res.data),
  });

  const categories = useMemo(
    () => [...new Set(InternshipData.map((i) => i.category))],
    [InternshipData]
  );
  const subCategories = useMemo(
    () => [...new Set(InternshipData.map((i) => i.subCategory))],
    [InternshipData]
  );

  const filteredInternship = InternshipData.filter((item) => {
    const keyword = searchTerm.toLowerCase().trim();

    const title = item.title?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";
    const tags = item.tags?.map((tag) => tag.toLowerCase()) || [];
    const postedBy = item.postedBy?.name?.toLowerCase() || "";

    const matchKeyword =
      title.includes(keyword) ||
      description.includes(keyword) ||
      tags.some((tag) => tag.includes(keyword)) ||
      postedBy.includes(keyword);

    const matchCategory = category ? item.category === category : true;
    const matchSubCategory = subCategory
      ? item.subCategory === subCategory
      : true;
    const matchRemote = isRemote ? item.isRemote === true : true;

    const matchSkills =
      selectedSkills.length > 0
        ? selectedSkills.every((skill) =>
            item.requiredSkills
              ?.map((s) => s.toLowerCase())
              .includes(skill.toLowerCase())
          )
        : true;

    const min = parseFloat(minBudget);
    const max = parseFloat(maxBudget);

    const internshipMin = item.budget?.min ?? item.budget?.amount ?? 0;
    const internshipMax = item.budget?.max ?? item.budget?.amount ?? Infinity;

    const matchBudgetMin = !isNaN(min) ? internshipMin >= min : true;
    const matchBudgetMax = !isNaN(max) ? internshipMax <= max : true;

    return (
      matchKeyword &&
      matchCategory &&
      matchSubCategory &&
      matchRemote &&
      matchSkills &&
      matchBudgetMin &&
      matchBudgetMax
    );
  });

  const handleClear = () => {
    setCategory("");
    setMinBudget("");
    setMaxBudget("");
    setSearchTerm("");
    setSubCategory("");
    setIsRemote(false);
    setSelectedSkills([]);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <div className="relative text-center">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
          <div
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-200 rounded-full p-3 cursor-pointer"
            title={showFilters ? "Hide Filters" : "Show Filters"}
            aria-label="Toggle Filters"
          >
            {showFilters ? (
              <FaTimes className="text-lg text-black font-bold" />
            ) : (
              <FaSearch className="text-lg text-black font-bold" />
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white px-4 md:px-20">
          Discover Internship Opportunities
        </h1>
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Launch your career with hands-on experience. Browse internships that
          align with your goals and grow under real-world Internship.
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
              placeholder="Title, tags, poster..."
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
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
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Remote Only (Checkbox) */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="remoteOnly"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="w-4 h-4"
            />
            <label
              htmlFor="remoteOnly"
              className="text-lg text-white playfair font-medium"
            >
              Remote Only
            </label>
          </div>

          {/* Min Budget */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Min Budget (USD)
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="Min"
              className="p-2 border rounded text-black bg-white"
            />
          </div>

          {/* Max Budget */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Max Budget (USD)
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="Max"
              className="p-2 border rounded text-black bg-white"
            />
          </div>
        </div>

        {/* Clear Button & Results */}
        <div className="flex justify-between items-center px-20 py-3">
          <div className="text-lg text-white playfair">
            {filteredInternship.length} Internship
            {filteredInternship.length !== 1 && "s"} found
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

      {/* Internship Cards */}
      <div className="py-6 px-4 md:px-20">
        {filteredInternship.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInternship.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                setSelectedInternshipID={setSelectedInternshipID}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No Internship&apos;s found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Internship Modal */}
      <dialog id="Internship_Details_Modal" className="modal">
        <InternshipDetailsModal
          selectedInternshipID={selectedInternshipID}
          setSelectedInternshipID={setSelectedInternshipID}
        />
      </dialog>
    </div>
  );
};

export default Internship;
