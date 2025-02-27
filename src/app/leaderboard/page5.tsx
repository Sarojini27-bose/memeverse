"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
}

interface User {
  username: string;
  engagement: number;
}

export default function LeaderboardPage() {
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  
  // Simulated user rankings
  const userRankings: User[] = [
    { username: "MemeMaster", engagement: 2345 },
    { username: "MemeLord", engagement: 1987 },
    { username: "DankGuru", engagement: 1765 },
    { username: "MemeQueen", engagement: 1543 },
    { username: "LaughterKing", engagement: 1432 },
    { username: "FunnyGuy", engagement: 1324 },
    { username: "SillySally", engagement: 1256 },
    { username: "HilariousHelen", engagement: 1145 },
    { username: "ComicChris", engagement: 1023 },
    { username: "JokerJack", engagement: 987 },
  ];

  useEffect(() => {
    axios
      .get("https://api.imgflip.com/get_memes")
      .then((response) => {
        // Map fetched memes and assign random likes for demonstration
        const memesData: Meme[] = (response.data.data.memes as { id: string; name: string; url: string }[]).map((meme) => ({
          id: meme.id,
          name: meme.name,
          url: meme.url,
          likes: Math.floor(Math.random() * 1000),
        }));
        // Sort memes descending by likes and take the top 10
        const sortedMemes = memesData.sort((a, b) => b.likes - a.likes).slice(0, 10);
        setTopMemes(sortedMemes);
      })
      .catch((error) => console.error("Error fetching memes:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-gray-800">
        <h1 className="text-3xl font-extrabold">MemeVerse 🤪</h1>
        <nav className="flex space-x-6">
          <Link href="/upload" className="font-bold hover:text-yellow-400">Upload</Link>
          <Link href="/explore" className="font-bold hover:text-yellow-400">Explore</Link>
          <Link href="/profile" className="font-bold hover:text-yellow-400">Profile</Link>
          <Link href="/" className="font-bold hover:text-yellow-400">Home</Link>
          
        </nav>
      </header>

      <section className="container mx-auto px-4 py-10">
        {/* Top 10 Most Liked Memes Section */}
        <motion.h2
          className="text-4xl font-extrabold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Top 10 Most Liked Memes
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
  {topMemes.map((meme, i) => (
    <Link href={`/meme/${meme.id}`} key={meme.id}>
      <motion.div
        className="p-4 rounded-lg shadow-lg bg-gray-800 hover:bg-gray-700"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, delay: i * 0.1 }}
      >
        <img
          src={meme.url}
          alt={meme.name}
          className="w-full h-40 object-cover rounded-md mb-2"
        />
        <h3 className="text-lg font-bold">{meme.name}</h3>
        <p className="text-sm mt-1">👍 {meme.likes} Likes</p>
      </motion.div>
    </Link>
  ))}
</div>


        {/* User Rankings Section */}
        <motion.h2
          className="text-4xl font-extrabold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          Top User Rankings
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-700 text-left">Rank</th>
                <th className="px-4 py-2 border border-gray-700 text-left">Username</th>
                <th className="px-4 py-2 border border-gray-700 text-left">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {userRankings.map((user, index) => (
                <tr key={user.username} className="hover:bg-gray-700">
                  <td className="px-4 py-2 border border-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-700">{user.username}</td>
                  <td className="px-4 py-2 border border-gray-700">{user.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-5 bg-gray-800">
        <p>© 2025 MemeVerse | Made with ❤️</p>
      </footer>
    </div>
  );
}
