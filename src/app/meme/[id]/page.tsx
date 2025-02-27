"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Meme {
  id: string;
  name: string;
  url: string;
}

export default function MemeDetailPage() {
  const params = useParams();
  const memeId = params.id as string;

  const [meme, setMeme] = useState<Meme | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (!memeId) return;

    // Try to get meme details from localStorage
    const storedMeme = localStorage.getItem(`meme_details_${memeId}`);
    if (storedMeme) {
      try {
        const parsedMeme = JSON.parse(storedMeme) as Meme & {
          likes?: number;
          comments?: unknown;
        };
        setMeme(parsedMeme);
        if (typeof parsedMeme.likes === "number") {
          setLikes(parsedMeme.likes);
        }
        if (parsedMeme.comments !== undefined) {
          if (Array.isArray(parsedMeme.comments)) {
            setComments(parsedMeme.comments);
          } else {
            setComments([String(parsedMeme.comments)]);
          }
        }
      } catch (error) {
        console.error("Error parsing stored meme:", error);
      }
    } else {
      // Fallback: sample meme data
      const fetchedMeme: Meme = {
        id: memeId,
        name: `Sample Meme #${memeId}`,
        url: "https://i.imgflip.com/1bij.jpg",
      };
      setMeme(fetchedMeme);
    }

    // Also attempt to load likes/comments if stored separately
    const storedLikes = localStorage.getItem(`meme_likes_${memeId}`);
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    }
    const storedComments = localStorage.getItem(`meme_comments_${memeId}`);
    if (storedComments) {
      try {
        const parsedComments = JSON.parse(storedComments);
        if (Array.isArray(parsedComments)) {
          setComments(parsedComments);
        } else {
          setComments([String(parsedComments)]);
        }
      } catch (error) {
        console.error("Error parsing stored comments:", error);
      }
    }
  }, [memeId]);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`meme_likes_${memeId}`, newLikes.toString());
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComments = [...comments, commentInput.trim()];
    setComments(newComments);
    localStorage.setItem(`meme_comments_${memeId}`, JSON.stringify(newComments));
    setCommentInput("");
  };

  const handleShare = (platform: string) => {
    alert(`Meme shared to ${platform}! (simulated)`);
  };

  if (!meme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-700 text-white flex items-center justify-center">
        <p>Loading Meme...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-black bg-opacity-70">
        <h1 className="text-3xl font-extrabold">MemeVerse 🤪</h1>
        <nav className="flex space-x-6">
          <Link href="/upload" className="font-bold hover:text-yellow-400">
            Upload
          </Link>
          <Link href="/explore" className="font-bold hover:text-yellow-400">
            Explore
          </Link>
          <Link href="/profile" className="font-bold hover:text-yellow-400">
            Profile
          </Link>
          <Link href="/leaderboard" className="font-bold hover:text-yellow-400">
            Leaderboard
          </Link>
        </nav>
      </header>

      {/* Meme Details */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto bg-black bg-opacity-50 p-6 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">{meme.name}</h2>
          <img
            src={meme.url}
            alt={meme.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />

          {/* Like Button & Display */}
          <div className="flex items-center space-x-4 mb-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-600"
            >
              👍 Like
            </motion.button>
            <p className="text-lg font-semibold">{likes} Likes</p>
          </div>

          {/* Sharing Options */}
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => handleShare("Twitter")}
              className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => handleShare("Facebook")}
              className="px-4 py-2 bg-blue-800 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Share on Facebook
            </button>
            <button
              onClick={() => handleShare("Reddit")}
              className="px-4 py-2 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-500"
            >
              Share on Reddit
            </button>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <ul className="space-y-2 mb-4">
              {comments.map((comment, idx) => (
                <li key={idx} className="bg-gray-600 p-2 rounded-md">
                  {comment}
                </li>
              ))}
              {comments.length === 0 && (
                <li className="text-gray-300">No comments yet. Be the first!</li>
              )}
            </ul>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 p-2 rounded-md text-black focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500"
              >
                Comment
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
