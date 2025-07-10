import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const blogs = [
  {
    id: "1",
    title: "Mastering React Hooks in 2025",
    excerpt:
      "Discover the latest advancements in React Hooks and how they enhance modern frontend development.",
    content: `React Hooks revolutionized functional components. In 2025, new best practices around custom hooks, context isolation, and performance optimization with useMemo/useCallback are more refined. Explore advanced strategies and how they impact modern development workflows.`,
    author: "Sazzadul Islam",
    publishedAt: "2025-07-01",
    image: "https://source.unsplash.com/400x250/?react,code",
    tags: ["React", "Frontend", "JavaScript"],
    category: "Frontend Development",
    readTime: "6 min",
  },
  {
    id: "2",
    title: "Web3 vs Web2: What Developers Need to Know",
    excerpt:
      "Explore the key differences between Web2 and Web3 development in today’s evolving tech space.",
    content: `Web3 introduces decentralization, ownership, and blockchain-backed applications. This article compares both paradigms, outlines transition strategies for Web2 devs, and includes tooling essentials like MetaMask, Ethers.js, and Solidity.`,
    author: "Amina Chowdhury",
    publishedAt: "2025-06-15",
    image: "https://source.unsplash.com/400x250/?blockchain,web",
    tags: ["Web3", "Blockchain", "Tech Trends"],
    category: "Blockchain",
    readTime: "7 min",
  },
  {
    id: "3",
    title: "Top 10 VS Code Extensions for Productivity",
    excerpt:
      "Boost your coding speed with these handpicked VS Code extensions for 2025.",
    content: `Tools like GitLens, ESLint, Prettier, and REST Client remain essential. We review new rising stars in 2025’s marketplace and how they integrate with cloud workspaces and AI-enhanced workflows.`,
    author: "Rafiq Islam",
    publishedAt: "2025-05-22",
    image: "https://source.unsplash.com/400x250/?code,workspace",
    tags: ["VS Code", "Productivity", "Tools"],
    category: "Developer Tools",
    readTime: "5 min",
  },
  {
    id: "4",
    title: "Designing for Accessibility: A 2025 Guide",
    excerpt:
      "Inclusive design isn't optional. Here's how to embed accessibility in your design system.",
    content: `From semantic HTML to ARIA roles, and WCAG 3.0 guidelines, learn how to build applications that serve all users. This post covers automated testing tools, keyboard navigation, and real-life inclusive UI examples.`,
    author: "Chris Mendez",
    publishedAt: "2025-06-05",
    image: "https://source.unsplash.com/400x250/?design,accessibility",
    tags: ["UI/UX", "Accessibility", "Best Practices"],
    category: "User Experience",
    readTime: "8 min",
  },
  {
    id: "5",
    title: "State Management in React: Context API vs Redux",
    excerpt:
      "Wondering whether to use Redux or Context API in 2025? Here’s what to consider.",
    content: `Context API has matured, but Redux still shines for complex state graphs. This guide walks through modern Redux Toolkit patterns, best Context usage practices, and performance implications of each.`,
    author: "Fatema Nahar",
    publishedAt: "2025-06-25",
    image: "https://source.unsplash.com/400x250/?react,redux",
    tags: ["React", "Redux", "State Management"],
    category: "Frontend Development",
    readTime: "6 min",
  },
  {
    id: "6",
    title: "How to Build a CI/CD Pipeline with GitHub Actions",
    excerpt:
      "Learn to automate deployment and testing using GitHub Actions in 2025.",
    content: `This tutorial covers how to build and deploy apps using workflows, secrets, environment matrices, and caching strategies in GitHub Actions. Plus, integration with Docker and preview environments.`,
    author: "Mizanur Rahman",
    publishedAt: "2025-06-10",
    image: "https://source.unsplash.com/400x250/?devops,github",
    tags: ["DevOps", "GitHub Actions", "CI/CD"],
    category: "DevOps",
    readTime: "9 min",
  },
  {
    id: "7",
    title: "Tailwind CSS: Advanced Layout Techniques",
    excerpt:
      "Learn how to push Tailwind beyond basic utilities with advanced grid, flex, and responsiveness.",
    content: `This blog dives into layout recipes for dashboards, modals, and responsive grids using Tailwind CSS. Explore new plugin integrations and upcoming utilities in Tailwind 4.0.`,
    author: "Shama Parveen",
    publishedAt: "2025-07-03",
    image: "https://source.unsplash.com/400x250/?tailwind,ui",
    tags: ["Tailwind CSS", "CSS", "Frontend"],
    category: "CSS Frameworks",
    readTime: "6 min",
  },
  {
    id: "8",
    title: "Performance Optimization Tips for Large React Apps",
    excerpt:
      "Big React apps come with big performance risks — here’s how to stay fast.",
    content: `Learn how to lazy-load components, split bundles, throttle renders, and manage expensive re-renders using memoization and selectors. Real-world examples included.`,
    author: "Tanvir Hossain",
    publishedAt: "2025-05-18",
    image: "https://source.unsplash.com/400x250/?performance,code",
    tags: ["React", "Performance", "Optimization"],
    category: "Frontend Performance",
    readTime: "7 min",
  },
  {
    id: "9",
    title: "Understanding TypeScript Generics with Real Examples",
    excerpt:
      "Struggling with generics in TypeScript? This guide makes it click.",
    content: `TypeScript generics can be overwhelming. We simplify the topic using array utilities, API functions, and generic components. You’ll also learn how to write reusable utility types.`,
    author: "Nazia Alam",
    publishedAt: "2025-06-29",
    image: "https://source.unsplash.com/400x250/?typescript,code",
    tags: ["TypeScript", "Generics", "Advanced"],
    category: "TypeScript",
    readTime: "6 min",
  },
  {
    id: "10",
    title: "What’s New in ECMAScript 2025",
    excerpt:
      "Check out the newest JavaScript features shipping in ES2025 and how to use them.",
    content: `From pipeline operators to pattern matching, ES2025 brings a wave of productivity-focused updates. We break down each major addition with examples and browser support notes.`,
    author: "Jahidul Islam",
    publishedAt: "2025-07-08",
    image: "https://source.unsplash.com/400x250/?javascript,code",
    tags: ["JavaScript", "ES2025", "New Features"],
    category: "JavaScript",
    readTime: "5 min",
  },
];

import DefaultBlogImage from "../../../../assets/DefaultBlogImage.jpg"; // Replace with actual path

const FeaturedBlogs = () => {
  return (
    <section className="bg-gradient-to-bl from-blue-400 to-blue-600 py-20">
      <div className="px-20 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-4xl font-bold text-white">Latest Blog Posts</h2>
            <p className="lg:text-xl text-gray-200">
              Stay up to date with industry insights and tutorials from our
              experts.
            </p>
          </div>

          {/* Go To Button */}
          <Link
            to="/Blogs"
            className="mt-4 md:mt-0 inline-flex items-center text-white hover:underline text-lg font-medium"
          >
            Show More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog) => (
            <Link
              to={`/blogs/${blog.id}`}
              key={blog.id}
              className="bg-white rounded-md shadow hover:shadow-2xl transition overflow-hidden group"
            >
              <img
                src={blog.image || DefaultBlogImage}
                alt={blog.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultBlogImage;
                }}
                className="w-full h-48 object-cover "
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-400">By {blog.author}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(blog.publishedAt).toLocaleDateString()}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
