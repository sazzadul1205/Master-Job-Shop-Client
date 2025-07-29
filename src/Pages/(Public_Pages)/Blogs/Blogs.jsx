import { useState, useMemo } from "react";

// Packages
import { useQuery } from "@tanstack/react-query";

// Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

// Shared
import CommonButton from "../../../Shared/CommonButton/CommonButton";
import Loading from "../../../Shared/Loading/Loading";
import Error from "../../../Shared/Error/Error";

// Icons
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";

// Assets
import DefaultBlogImage from "../../../assets/DefaultBlogImage.jpg";

// Modals
import BlogDetailsModal from "../Home/FeaturedBlogs/BlogDetailsModal/BlogDetailsModal";
import BlogAddModal from "./BlogAddModal/BlogAddModal";

const Blogs = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [minReadTime, setMinReadTime] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch Blogs
  const {
    data: BlogsData = [],
    isLoading: BlogsIsLoading,
    error: BlogsError,
    refetch: BlogsRefetch,
  } = useQuery({
    queryKey: ["BlogsData"],
    queryFn: () => axiosPublic.get("/Blogs").then((res) => res.data),
  });

  // Filter and Sort Blogs locally
  const filteredBlogs = useMemo(() => {
    return BlogsData.filter((blog) => {
      const matchesSearch =
        searchTerm === "" ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || blog.category === selectedCategory;

      const matchesAuthor =
        selectedAuthor === "" || blog.author === selectedAuthor;

      const matchesTag =
        selectedTag === "" || (blog.tags && blog.tags.includes(selectedTag));

      const blogReadMinutes = blog.readTime
        ? parseInt(blog.readTime.split(" ")[0])
        : 0;

      const matchesMinReadTime =
        minReadTime === "" || blogReadMinutes >= parseInt(minReadTime);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAuthor &&
        matchesTag &&
        matchesMinReadTime
      );
    }).sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [
    BlogsData,
    searchTerm,
    selectedCategory,
    selectedAuthor,
    selectedTag,
    minReadTime,
    sortOrder,
  ]);

  // Loading / Hooks
  if (BlogsIsLoading) return <Loading />;
  if (BlogsError) return <Error />;

  // Reset filters handler
  const handleClear = () => {
    setSearchTerm("");
    setSelectedTag("");
    setMinReadTime("");
    setSelectedAuthor("");
    setSortOrder("newest");
    setSelectedCategory("");
  };

  console.log(BlogsData[0]);

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

        <h1 className="text-3xl font-bold text-white px-4 md:px-20">
          Explore Blogs
        </h1>
        <p className="text-gray-200 mx-auto max-w-4xl font-semibold text-xl px-4 md:px-20">
          Discover expert-written blogs across categories. Stay informed, get
          inspired, and learn something new today.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black px-20 pt-10">
          {/* Search by Keyword */}
          <div className="flex flex-col">
            <label
              htmlFor="searchTerm"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Search by Keyword
            </label>
            <input
              id="searchTerm"
              type="text"
              placeholder="e.g. SEO, branding"
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
              Filter by Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded border bg-white"
            >
              <option value="">All Categories</option>
              {[...new Set(BlogsData.map((b) => b.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Author Select */}
          <div className="flex flex-col">
            <label
              htmlFor="author"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Filter by Author
            </label>
            <select
              id="author"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="p-2 rounded border bg-white"
            >
              <option value="">All Authors</option>
              {[...new Set(BlogsData.map((b) => b.author))].map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Select */}
          <div className="flex flex-col">
            <label
              htmlFor="tag"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Filter by Tag
            </label>
            <select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="p-2 rounded border bg-white"
            >
              <option value="">All Tags</option>
              {[...new Set(BlogsData.flatMap((b) => b.tags || []))].map(
                (tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Minimum Read Time */}
          <div className="flex flex-col">
            <label
              htmlFor="minReadTime"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Minimum Read Time (minutes)
            </label>
            <input
              id="minReadTime"
              type="number"
              min={0}
              placeholder="e.g. 3"
              value={minReadTime}
              onChange={(e) => setMinReadTime(e.target.value)}
              className="p-2 rounded border bg-white"
            />
          </div>

          {/* Sort Order */}
          <div className="flex flex-col">
            <label
              htmlFor="sortOrder"
              className="mb-1 text-lg text-white playfair font-medium"
            >
              Sort by
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 rounded border bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Clear all and Found Document */}
        <div className="flex justify-between items-center px-20 py-3">
          <div className="text-lg text-white playfair">
            {filteredBlogs.length} Blog{filteredBlogs.length !== 1 && "s"} found
          </div>
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

      {/* Blog Add Button */}
      {user && (
        <div className="px-20">
          <CommonButton
            text="Add a new blog"
            clickEvent={() =>
              document.getElementById("Blog_Add_Modal")?.showModal()
            }
            bgColor="white"
            textColor="text-black"
            icon={<FaPlus />}
          />
        </div>
      )}

      {/* Blogs Display */}
      <div className="py-6 px-20">
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-md shadow hover:shadow-2xl transition overflow-hidden group"
                onClick={() => {
                  setSelectedBlog(blog);
                  document.getElementById("Blog_Details_Modal")?.showModal();
                }}
              >
                <img
                  src={blog.image || DefaultBlogImage}
                  alt={blog.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultBlogImage;
                  }}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Expert */}
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400">By {blog.author}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short", // abbreviated month like "Jan"
                        day: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2 text-xs">
                    {blog.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-lg font-medium bg-white/10 rounded p-6">
            <p>😕 No Blogs Found matching your criteria.</p>
            <p className="text-sm text-gray-300 mt-2">
              Try adjusting the filters or clearing them to see more results.
            </p>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <dialog id="Blog_Details_Modal" className="modal">
        <BlogDetailsModal
          selectedBlog={selectedBlog}
          setSelectedBlog={setSelectedBlog}
        />
      </dialog>

      {/* Blog Modal */}
      <dialog id="Blog_Add_Modal" className="modal">
        <BlogAddModal refetch={BlogsRefetch} />
      </dialog>
    </div>
  );
};

export default Blogs;
