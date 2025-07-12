import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

const Gigs = () => {
  const axiosPublic = useAxiosPublic();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  // Fetch Gigs
  const {
    data: GigsData = [],
    isLoading: GigsIsLoading,
    error: GigsError,
  } = useQuery({
    queryKey: ["GigsData"],
    queryFn: () => axiosPublic.get(`/Gigs`).then((res) => res.data),
  });

  // Filtered Gigs
  const filteredGigs = useMemo(() => {
    return GigsData.filter((gig) => {
      const matchesSearch =
        searchTerm === "" ||
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || gig.category === selectedCategory;

      const matchesBudget =
        (!minBudget || gig.budget.min >= parseFloat(minBudget)) &&
        (!maxBudget || gig.budget.max <= parseFloat(maxBudget));

      return matchesSearch && matchesCategory && matchesBudget;
    });
  }, [GigsData, searchTerm, selectedCategory, minBudget, maxBudget]);

  // Loading / Error
  if (GigsIsLoading) return <Loading />;
  if (GigsError) return <Error />;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white px-4 md:px-20">
          Explore Gigs
        </h1>
        <p className="text-gray-200 font-semibold text-xl px-4 md:px-20">
          Browse freelance opportunities and apply based on your skills and
          budget preferences.
        </p>
      </div>

      {/*working on gigs page partially compleat Filter Control working on gigs page partially compleate */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Gigs Display */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredGigs.length > 0 ? (
          filteredGigs.map((gig) => (
            <div
              key={gig._id}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {gig.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{gig.category}</p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {gig.description}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Budget: ${gig.budget.min} - ${gig.budget.max}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Posted by: {gig.postedBy?.name}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No gigs match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
