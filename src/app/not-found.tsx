"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-grey-900 text-white flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-6xl font-extrabold mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        404 - Meme Not Found!
      </motion.h1>
      <p className="text-xl mb-8">
        Oops! Looks like this meme got lost in the meme-verse.
      </p>
      <motion.img 
        src="https://i.imgflip.com/30b1gx.jpg" 
        alt="Funny 404 meme"
        className="w-80 mb-8 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />
      <Link 
        href="/" 
        className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500"
      >
        Go Home
      </Link>
    </div>
  );
}
