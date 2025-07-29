import { useState, useMemo } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Icons
import { FaSearch, FaTimes } from "react-icons/fa";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Shared
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import EventCard from "../../../Shared/EventCard/EventCard";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Modal
import EventDetailsModal from "../Home/FeaturedEvents/EventDetailsModal/EventDetailsModal";

const Events = () => {
  const axiosPublic = useAxiosPublic();

  // UI States
  const [selectedEventID, setSelectedEventID] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [category, setCategory] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [format, setFormat] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  // Fetch events
  const {
    data: EventsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["EventsData"],
    queryFn: () => axiosPublic.get("/Events").then((res) => res.data),
  });

  // Filter the list of events based on all selected criteria
  const filteredEvent = EventsData.filter((event) => {
    // Check if keyword matches event title or any of the tags
    const matchesKeyword =
      event.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      event.tags.some((tag) =>
        tag.toLowerCase().includes(searchKeyword.toLowerCase())
      );

    // Check if the event matches selected category (if set)
    const matchesCategory = category ? event.category === category : true;

    // Check if the event matches selected subcategory (if set)
    const matchesSubCategory = subCategory
      ? event.subCategory === subCategory
      : true;

    // Check if the event matches selected type (e.g., Workshop, Seminar)
    const matchesType = type ? event.type === type : true;

    // Check if the event matches selected format (e.g., Online, Offline)
    const matchesFormat = format ? event.format === format : true;

    // Check if the city name matches user input (case-insensitive)
    const matchesCity = city
      ? event.location?.city.toLowerCase().includes(city.toLowerCase())
      : true;

    // Check if the event is marked as free when the "isFree" toggle is enabled
    const matchesFree = isFree ? event.price.isFree === true : true;

    // Return true only if all filters match
    return (
      matchesKeyword &&
      matchesCategory &&
      matchesSubCategory &&
      matchesType &&
      matchesFormat &&
      matchesCity &&
      matchesFree
    );
  });

  // Extract unique categories from the event list for the category dropdown
  const uniqueCategories = useMemo(
    () => [...new Set(EventsData.map((e) => e.category).filter(Boolean))],
    [EventsData]
  );

  // Extract unique subcategories from the event list
  const uniqueSubCategories = useMemo(
    () => [...new Set(EventsData.map((e) => e.subCategory).filter(Boolean))],
    [EventsData]
  );

  // Extract unique event types (e.g., Workshop, Webinar) from the data
  const uniqueTypes = useMemo(
    () => [...new Set(EventsData.map((e) => e.type).filter(Boolean))],
    [EventsData]
  );

  // Extract unique formats (e.g., Online, Offline) from the event data
  const uniqueFormats = useMemo(
    () => [...new Set(EventsData.map((e) => e.format).filter(Boolean))],
    [EventsData]
  );

  // Extract unique cities from event locations for the city dropdown
  const uniqueCities = useMemo(
    () => [...new Set(EventsData.map((e) => e.location?.city).filter(Boolean))],
    [EventsData]
  );

  //  Loading / Error UI
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  // Function to clear all filter states back to default values
  const handleClear = () => {
    setSearchKeyword("");
    setCategory("");
    setSubCategory("");
    setType("");
    setFormat("");
    setCity("");
    setIsFree(false);
  };

  return (
    <div className="min-h-screen">
      {/* Page Title */}
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
          Explore Upcoming Events & Opportunities
        </h1>

        {/* Sub Title */}
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Stay informed and engaged. Discover events that inspire growth, foster
          connections, and advance your journey.
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
              placeholder="Title, tags, poster..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
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
              {uniqueCategories.map((cat) => (
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
              {uniqueSubCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Formats</option>
              {uniqueFormats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="mb-1 text-lg text-white playfair font-medium">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 border rounded text-black bg-white"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Free Events Only */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={isFree}
              onChange={() => setIsFree((prev) => !prev)}
              id="freeEventsOnly"
              className="w-5 h-5 cursor-pointer"
            />
            <label
              htmlFor="freeEventsOnly"
              className="text-white text-lg font-medium cursor-pointer"
            >
              Free Events Only
            </label>
          </div>
        </div>

        {/* Results Info & Clear Button */}
        <div className="flex justify-between items-center px-4 md:px-20 py-4">
          {/* Results */}
          <div className="text-lg text-white playfair">
            {filteredEvent.length} Event{filteredEvent.length !== 1 && "s"}{" "}
            found
          </div>

          {/* Clear Button */}
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

      {/* Event Cards */}
      <div className="py-6 px-4 md:px-20">
        {filteredEvent.length > 0 ? (
          // Display event cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvent.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                setSelectedEventID={setSelectedEventID}
              />
            ))}
          </div>
        ) : (
          // Display no events found message
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No Event&apos;s found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting or clearing filters to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Event Modal */}
      <dialog id="Event_Details_Modal" className="modal">
        <EventDetailsModal
          selectedEventID={selectedEventID}
          setSelectedEventID={setSelectedEventID}
        />
      </dialog>
    </div>
  );
};

export default Events;
