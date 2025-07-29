import { useState, useMemo } from "react";

// Icons
import { FaSearch, FaTimes } from "react-icons/fa";

// Packages
import { useQuery } from "@tanstack/react-query";

// Shared
import Error from "../../../Shared/Error/Error";
import Loading from "../../../Shared/Loading/Loading";
import CompanyCard from "../../../Shared/CompanyCard/CompanyCard";
import CommonButton from "../../../Shared/CommonButton/CommonButton";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const CompanyProfiles = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");

  // Fetch companies Data
  const {
    data: CompanyData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CompanyData"],
    queryFn: () => axiosPublic.get("/Company").then((res) => res.data),
  });

  // Unique list of industries (e.g., Tech, Finance, Healthcare)
  const uniqueIndustries = [...new Set(CompanyData.map((c) => c.industry))];

  // Unique list of countries from company headquarters
  const uniqueCountries = [
    ...new Set(CompanyData.map((c) => c.headquarters?.country)),
  ];

  // Unique list of company sizes (e.g., Small, Medium, Large)
  const uniqueSizes = [...new Set(CompanyData.map((c) => c.size))];

  // Filter companies based on search keyword and selected filters
  const filteredCompanies = useMemo(() => {
    return CompanyData.filter((company) => {
      // Convert the search keyword to lowercase once for comparison
      const keyword = searchKeyword.toLowerCase();

      // Match against company name, tagline, industry, city, and tags
      const keywordMatch =
        company.name?.toLowerCase().includes(keyword) ||
        company.tagline?.toLowerCase().includes(keyword) ||
        company.industry?.toLowerCase().includes(keyword) ||
        company.headquarters?.city?.toLowerCase().includes(keyword) ||
        company.tags?.some((tag) => tag.toLowerCase().includes(keyword));

      // Match selected industry (if any)
      const industryMatch = industry ? company.industry === industry : true;

      // Match selected country (if any)
      const countryMatch = country
        ? company.headquarters?.country === country
        : true;

      // Match selected company size (if any)
      const sizeMatch = size ? company.size === size : true;

      // Include company only if all conditions match
      return keywordMatch && industryMatch && countryMatch && sizeMatch;
    });
  }, [searchKeyword, industry, country, size, CompanyData]);

  // Clear all filters and reset to defaults
  const handleClear = () => {
    setSearchKeyword("");
    setIndustry("");
    setCountry("");
    setSize("");
  };

  // Loading / Error UI
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <div className="relative text-center">
        {/* Search Toggle */}
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-white px-4 md:px-20">
          Explore Leading Company Profiles
        </h1>

        {/* Sub Title */}
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Get to know top organizations, their missions, values, and what makes
          them unique. Discover companies shaping the future of work and
          innovation.
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
          showFilters ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-white px-4 md:px-20 pt-10">
          {/* Keyword */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Keyword
            </label>
            <input
              type="text"
              placeholder="Company name, tags, industry..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            />
          </div>

          {/* Industry */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Industries</option>
              {uniqueIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Countries</option>
              {uniqueCountries.map((cty) => (
                <option key={cty} value={cty}>
                  {cty}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Company Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Sizes</option>
              {uniqueSizes.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info & Clear Button */}
        <div className="flex justify-between items-center px-4 md:px-20 py-4">
          {/* Results */}
          <div className="text-lg text-white playfair">
            {filteredCompanies.length} Compan
            {filteredCompanies.length !== 1 ? "ies" : "y"} found
          </div>

          {/* Clear Buttons */}
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

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-5 px-10">
          <span className="w-3 h-3 bg-white rounded-full"></span>
          <div className="flex-grow h-[2px] bg-white opacity-70"></div>
          <span className="w-3 h-3 bg-white rounded-full"></span>
        </div>
      </div>

      {/* Company Cards */}
      <div className="py-6 px-4 md:px-20">
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((Company) => (
              // Render company cards
              <CompanyCard key={Company._id} Company={Company} />
            ))}
          </div>
        ) : (
          // Display no companies found message
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No Companies found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfiles;
