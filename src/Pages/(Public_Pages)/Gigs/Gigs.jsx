import { useState, useMemo } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaSearch, FaTimes } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import Loading from "../../../Shared/Loading/Loading";
import GigCard from "../../../Shared/GigCard/GigCard";
import Error from "../../../Shared/Error/Error";

// Modals
import GigDetailsModal from "../Home/FeaturedGigs/GigDetailsModal/GigDetailsModal";

const Gigs = () => {
  const axiosPublic = useAxiosPublic();

  // Filter States
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Selected Gig
  const [selectedGigID, setSelectedGigID] = useState(null);

  // Fetch Gigs
  const {
    data: GigsData = [],
    isLoading: GigsIsLoading,
    error: GigsError,
  } = useQuery({
    queryKey: ["GigsData"],
    queryFn: () => axiosPublic.get(`/Gigs`).then((res) => res.data),
  });

  // Reset filters
  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinBudget("");
    setMaxBudget("");
  };

  // Filtered Gigs
  const filteredGigs = useMemo(() => {
    return GigsData.filter((gig) => {
      // Match keyword in title or description
      const matchesSearch =
        searchTerm === "" ||
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Match selected category
      const matchesCategory =
        selectedCategory === "" || gig.category === selectedCategory;

      // Match budget range
      const matchesBudget =
        (!minBudget || gig.budget.min >= parseFloat(minBudget)) &&
        (!maxBudget || gig.budget.max <= parseFloat(maxBudget));

      // Include gig only if all filters match
      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [GigsData, searchTerm, selectedCategory, minBudget, maxBudget]);

  // Loading / Error
  if (GigsIsLoading) return <Loading />;
  if (GigsError) return <Error />;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="relative text-center">
        {/* Search Toggle */}
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2">
          <div
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white hover:bg-gray-200 rounded-full p-3 cursor-pointer"
          >
            {showFilters ? (
              <FaTimes className="text-lg text-black font-bold" />
            ) : (
              <FaSearch className="text-lg text-black font-bold" />
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white px-4 md:px-20">
          Explore Gigs
        </h1>

        {/* Sub Title */}
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Browse freelance opportunities and apply based on your skills and
          budget preferences.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-5 px-10">
        <span className="w-3 h-3 bg-white rounded-full"></span>
        <div className="flex-grow h-[2px] bg-white opacity-70"></div>
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </div>

      {/* Filters */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black px-20 pt-10">
          {/* Keyword Search */}
          <div className="flex flex-col">
            <label
              htmlFor="keyword"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Keyword
            </label>
            <input
              id="keyword"
              type="text"
              name="keyword"
              placeholder="Title, skill, company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            />
          </div>

          {/* Category Select */}
          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Categories</option>
              {[...new Set(GigsData.map((gig) => gig.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Min Budget */}
          <div className="flex flex-col">
            <label
              htmlFor="minBudget"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Min Budget
            </label>
            <input
              id="minBudget"
              type="number"
              placeholder="$0"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            />
          </div>

          {/* Max Budget */}
          <div className="flex flex-col">
            <label
              htmlFor="maxBudget"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Max Budget
            </label>
            <input
              id="maxBudget"
              type="number"
              placeholder="$1000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            />
          </div>
        </div>

        {/* Clear all and Found Document  */}
        <div className="flex justify-between items-center px-20 py-3">
          {/* Documents Found */}
          <div className="text-lg text-white playfair">
            {filteredGigs.length} Gig{filteredGigs.length !== 1 && "s"} found
          </div>

          {/* Remove Button */}
          <div className="flex gap-2">
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

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-5 px-10">
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <div className="flex-grow h-[2px] bg-white opacity-70"></div>
          <span className="w-3 h-3 bg-white rounded-full"></span>
        </div>
      </div>

      {/* Gigs Display */}
      <div className="py-6 px-20">
        {filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGigs.map((gig) => (
              <div key={gig._id}>
                <GigCard gig={gig} setSelectedGigID={setSelectedGigID} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No Gigs Found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting the filters or clearing them to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Gigs Modal */}
      <dialog id="Gig_Details_Modal" className="modal">
        <GigDetailsModal
          selectedGigID={selectedGigID}
          setSelectedGigID={setSelectedGigID}
        />
      </dialog>
    </div>
  );
};

export default Gigs;
