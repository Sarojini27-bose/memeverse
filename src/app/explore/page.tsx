"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  comments: number;
}

export default function Explore() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Trending");
  const [sortBy, setSortBy] = useState("none");
  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState(1);
  const memesPerPage = 12;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get("https://api.imgflip.com/get_memes")
      .then((response) => {
        // Cast the fetched memes and add random likes/comments for demonstration
        const memesData: Meme[] = (response.data.data.memes as { id: string; name: string; url: string }[]).map((meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
        }));
        setMemes(memesData);
      })
      .catch((error) => console.error("Error fetching memes:", error));
  }, []);

  // Filtering logic based on search query and selected category
  const getFilteredMemes = () => {
    let filtered = [...memes];

    if (searchQuery) {
      filtered = filtered.filter((meme) =>
        meme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filtering:
    if (selectedCategory === "Trending") {
      // Show all memes
    } else if (selectedCategory === "New") {
      filtered = filtered.slice(0, 20);
    } else if (selectedCategory === "Classic") {
      filtered = filtered.slice(-20);
    } else if (selectedCategory === "Random") {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    if (sortBy === "likes") {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "comments") {
      filtered.sort((a, b) => b.comments - a.comments);
    }

    return filtered;
  };

  const filteredMemes = getFilteredMemes();
  const displayedMemes = filteredMemes.slice(0, page * memesPerPage);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Infinite scrolling with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && displayedMemes.length < filteredMemes.length) {
        setPage((prev) => prev + 1);
      }
    }, { threshold: 1 });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [displayedMemes, filteredMemes]);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-gray-800">
        <h1 className="text-3xl font-extrabold">MemeVerse 🤪</h1>
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="/upload" className="font-bold hover:text-yellow-400">Upload</Link>
              </li>
              <li>
                <Link href="/home" className="font-bold hover:text-yellow-400">Home</Link>
              </li>
              <li>
                <Link href="/profile" className="font-bold hover:text-yellow-400">Profile</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="font-bold hover:text-yellow-400">Leaderboard</Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={toggleDarkMode}
            className="text-xl px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
            title="Toggle Dark Mode"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </header>

      {/* Explore Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-4xl font-extrabold text-center mb-6">Explore Memes</h2>
        {/* Search & Category Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <input
            type="text"
            placeholder="Search memes..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full md:w-1/2 p-3 mb-4 md:mb-0 rounded-md bg-gray-200 text-black focus:outline-none"
          />
          <div className="flex space-x-4">
            {["Trending", "New", "Classic", "Random"].map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); setPage(1); }}
                className={`px-4 py-2 rounded-md font-bold ${
                  selectedCategory === category
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Sort Buttons */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <button
            onClick={() => setSortBy("likes")}
            className={`px-4 py-2 rounded-md font-bold ${
              sortBy === "likes"
                ? "bg-yellow-400 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Sort by Likes
          </button>
          <button
            onClick={() => setSortBy("comments")}
            className={`px-4 py-2 rounded-md font-bold ${
              sortBy === "comments"
                ? "bg-yellow-400 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Sort by Comments
          </button>
          <button
            onClick={() => setSortBy("none")}
            className={`px-4 py-2 rounded-md font-bold ${
              sortBy === "none"
                ? "bg-yellow-400 text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Clear Sort
          </button>
        </div>

        {/* Memes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedMemes.map((meme, index) => (
            <Link href={`/meme/${meme.id}`} key={meme.id}>
              <motion.div
                onClick={() =>
                  localStorage.setItem(`meme_details_${meme.id}`, JSON.stringify(meme))
                }
                className={`p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.05,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={meme.url}
                  alt={meme.name}
                  className="w-full h-64 object-cover rounded-md"
                />
                <p className="mt-2 text-center font-semibold">{meme.name}</p>
                <div className="flex justify-around mt-2">
                  <span className="text-sm">👍 {meme.likes}</span>
                  <span className="text-sm">💬 {meme.comments}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Loader for Infinite Scrolling */}
        <div ref={loaderRef} className="h-10"></div>
      </section>

      {/* Footer */}
      <footer className="text-center py-5 bg-gray-800">
        <p>© 2025 MemeVerse | Made with ❤️</p>
      </footer>
    </div>
  );
}

