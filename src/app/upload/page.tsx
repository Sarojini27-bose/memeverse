"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";

export default function UploadPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  // Handle file selection and create a preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Generate AI caption using a meme-related API with a fallback on error
  const handleGenerateCaption = async () => {
    try {
      // Replace with your real meme-related API endpoint
      const response = await axios.get("https://api.example.com/meme-caption", {
        params: { prompt: "Generate a funny meme caption" },
      });
      setCaption(response.data.caption);
    } catch (error) {
      console.error("Error generating caption, using fallback:", error);
      // Fallback: simulate delay and then set a dummy caption
      setTimeout(() => {
        setCaption("When you want to code, but the memes keep calling 😹");
      }, 1000);
    }
  };

  // Simulate the upload process
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Uploading Meme:", selectedFile, caption);
    alert("Meme uploaded (simulated)!");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-gray-800">
        <h1 className="text-3xl font-extrabold">MemeVerse 🤪</h1>
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="/" className="font-bold hover:text-yellow-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="font-bold hover:text-yellow-400">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/profile" className="font-bold hover:text-yellow-400">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="font-bold hover:text-yellow-400">
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

      {/* Upload Section */}
      <section className="container mx-auto px-4 py-10">
        <motion.h2 
          className="text-4xl font-extrabold text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Upload Meme
        </motion.h2>
        <form
          onSubmit={handleUpload}
          className={`max-w-xl mx-auto p-6 border-4 border-dashed rounded-lg shadow-2xl
            ${darkMode 
              ? "bg-gray-800 border-pink-400" 
              : "bg-gray-100 border-pink-500"
            }`}
        >
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">Select Meme (Image/GIF):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full p-2 rounded-md focus:outline-none
                ${darkMode 
                  ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600" 
                  : "bg-white text-black placeholder-gray-600 border-gray-300"
                }`}
            />
          </div>
          <div className="mb-6">
            <label className="block text-xl font-bold mb-2">Caption:</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a funny caption..."
              className={`w-full p-2 rounded-md focus:outline-none resize-none
                ${darkMode 
                  ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600" 
                  : "bg-white text-black placeholder-gray-600 border-gray-300"
                }`}
              rows={3}
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleGenerateCaption}
              className="px-4 py-2 bg-pink-400 text-black font-bold rounded-md hover:bg-pink-500"
            >
              Generate AI Caption
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600"
            >
              Upload Meme
            </button>
          </div>
        </form>

        {/* Preview Section */}
        {previewUrl && (
          <div className="mt-10 max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Preview</h3>
            <motion.img
              src={previewUrl}
              alt="Meme Preview"
              className="w-full h-96 object-cover rounded-md shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            {caption && (
              <p 
                className={`mt-4 text-xl font-semibold ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {caption}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-5 bg-gray-800">
        <p>© 2025 MemeVerse | Made with ❤️</p>
      </footer>
    </div>
  );
}
