"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  comments: number;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.imgflip.com/get_memes")
      .then((response) => {
        // Map the API data and add random likes/comments for demo
        const memesData: Meme[] = (response.data.data.memes as {
          id: string;
          name: string;
          url: string;
        }[]).map((m) => ({
          id: m.id,
          name: m.name,
          url: m.url,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
        }));
        setMemes(memesData);
      })
      .catch((error) => console.error("Error fetching memes:", error));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen`}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-gray-800">
        <h1 className="text-3xl font-extrabold">MemeVerse 🤪</h1>
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link
                  href="/upload"
                  className="font-bold hover:text-yellow-400"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="font-bold hover:text-yellow-400"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="font-bold hover:text-yellow-400"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="font-bold hover:text-yellow-400"
                >
                  Leaderboard
                </Link>
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

      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.h2
          className="text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Welcome to MemeVerse 🤪
        </motion.h2>
        <p className="text-xl font-bold">
          Discover and create the funniest memes!
        </p>
      </section>

      {/* Trending Memes Section */}
      <section className="container mx-auto px-4 py-10">
      <motion.h2 
          className="text-4xl font-extrabold text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
      
          🔥 Trending Memes
        </motion.h2>
        <div className="grid grid-cols-3 gap-6">
          {memes.slice(0, 12).map((meme, index) => (
            <Link
              href={`/meme/${meme.id}`}
              key={meme.id}
              onClick={() =>
                localStorage.setItem(
                  `meme_details_${meme.id}`,
                  JSON.stringify(meme)
                )
              }
            >
              <motion.div
                className={`p-4 rounded-lg shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
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
      </section>

      {/* Footer */}
      <footer className="text-center py-5 bg-gray-800 mt-10">
        <p>© 2025 MemeVerse | Made with ❤️</p>
      </footer>
    </div>
  );
}
