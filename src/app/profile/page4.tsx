"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
}

interface UserProfile {
  name: string;
  bio: string;
  profilePicture: string;
}

export default function ProfilePage() {
  // Load profile info from localStorage or use default values
  const [profile, setProfile] = useState<UserProfile>({
    name: "Your Name",
    bio: "This is your bio.",
    profilePicture: "/default-profile.jpg", // ensure you have a default image in your public folder
  });
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  // Load profile info from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("user_profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  // Keep editedProfile in sync with profile
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  // Handle input changes for name/bio
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input for profile picture
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a preview URL for immediate display
      const imageUrl = URL.createObjectURL(file);
      setEditedProfile({
        ...editedProfile,
        profilePicture: imageUrl,
      });
    }
  };

  // Save profile info to localStorage
  const saveProfile = () => {
    setProfile(editedProfile);
    localStorage.setItem("user_profile", JSON.stringify(editedProfile));
    setEditing(false);
  };

  // Simulated user-uploaded memes
  const [uploadedMemes, setUploadedMemes] = useState<Meme[]>([]);
  useEffect(() => {
    const storedUploaded = localStorage.getItem("user_uploaded_memes");
    if (storedUploaded) {
      setUploadedMemes(JSON.parse(storedUploaded));
    } else {
      // Sample data
      setUploadedMemes([
        { id: "1", name: "Uploaded Meme 1", url: "https://i.imgflip.com/1bij.jpg", likes: 100 },
        { id: "2", name: "Uploaded Meme 2", url: "https://i.imgflip.com/26am.jpg", likes: 200 },
      ]);
    }
  }, []);

  // Simulated liked memes
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  useEffect(() => {
    const storedLiked = localStorage.getItem("user_liked_memes");
    if (storedLiked) {
      setLikedMemes(JSON.parse(storedLiked));
    } else {
      // Sample data
      setLikedMemes([
        { id: "3", name: "Liked Meme 1", url: "https://i.imgflip.com/1otk96.jpg", likes: 300 },
        { id: "4", name: "Liked Meme 2", url: "https://i.imgflip.com/1bij.jpg", likes: 150 },
      ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-gray-800">
        <h1 className="text-3xl font-extrabold">MemeVerse 🤪</h1>
        <nav className="flex space-x-6">
          <Link href="/" className="font-bold hover:text-yellow-400">
            Home
          </Link>
          <Link href="/upload" className="font-bold hover:text-yellow-400">
            Upload
          </Link>
          <Link href="/explore" className="font-bold hover:text-yellow-400">
            Explore
          </Link>
          <Link href="/leaderboard" className="font-bold hover:text-yellow-400">
            Leaderboard
          </Link>
        </nav>
      </header>

      {/* Profile Info Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl">
          <div className="flex flex-col md:flex-row items-center space-x-6">
            {/* Profile Picture + Label */}
            <div className="flex flex-col items-center">
              <img
                src={editedProfile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 mb-2"
              />
              {!editing && <p className="text-sm font-semibold">Profile</p>}
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="mt-2 text-sm bg-gray-700 p-1 rounded"
                />
              )}
            </div>

            <div className="flex-1 w-full">
              {editing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleProfileChange}
                    className="text-2xl font-bold bg-gray-700 p-2 rounded-md mb-2 w-full"
                  />
                  <textarea
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleProfileChange}
                    className="bg-gray-700 p-2 rounded-md w-full"
                    rows={2}
                  ></textarea>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p>{profile.bio}</p>
                </>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              {editing ? (
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-green-500 text-black font-bold rounded-md hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Uploaded Memes Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Your Uploaded Memes</h2>
        {uploadedMemes.length === 0 ? (
          <p>You havent uploaded any memes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {uploadedMemes.map((meme) => (
              <div key={meme.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <img
                  src={meme.url}
                  alt={meme.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{meme.name}</h3>
                <p className="text-sm">👍 {meme.likes} Likes</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Liked Memes Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6">Your Liked Memes</h2>
        {likedMemes.length === 0 ? (
          <p>You havent liked any memes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {likedMemes.map((meme) => (
              <div key={meme.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <img
                  src={meme.url}
                  alt={meme.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold">{meme.name}</h3>
                <p className="text-sm">👍 {meme.likes} Likes</p>
              </div>
            ))}
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
